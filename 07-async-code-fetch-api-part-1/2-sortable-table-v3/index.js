import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
    element;
    subElements = {};
    data = [];
    loading = false;
    step = 20;
    start = 1;
    end = (this.start + this.step);

    constructor(headersConfig = [], { url = '', sorting = { id: headersConfig.find((item) => { return item.sortable }).id, order: 'asc' }, isSortClient = false, step = 20, start = 1, end = (start + step) } = {}) {
        this.headersConfig = headersConfig;
        this.url = new URL(url, BACKEND_URL);
        this.sorting = sorting;
        this.isSortClient = isSortClient;
        this.step = step;
        this.start = start;
        this.end = end;
        this.render();
    }

    async loadData(id, order, start = this.start, end = this.end) {
        this.url.searchParams.set('_sort', id);
        this.url.searchParams.set('_order', order);
        this.url.searchParams.set('_start', start);
        this.url.searchParams.set('_end', end);
        this.element.classList.add('sortable-table_loading');
        const data = await fetchJson(this.url);
        this.element.classList.remove('sortable-table_loading');
        return data;
    }
    async sortOnServer(id, order, start, end) {
        const data = await this.loadData(id, order, start, end);
        this.renderRows(data);
    }

    onWindowScroll = async () => {
        const { bottom } = this.element.getBoundingClientRect();
        const { id, order } = this.sorting;
        if (bottom < document.documentElement.clientHeight && !this.loading && !this.isSortClient) {
            this.start = this.end;
            this.end = this.start + this.step;
            this.loading = true;
            const data = await this.loadData(id, order, this.start, this.end);
            this.update(data);
            this.loading = false;
        }
    };
    onSortClick = event => {
        const column = event.target.closest('[data-sortable="true"]');
        const toggleOrder = order => {
            const orders = { asc: 'desc', desc: 'asc' };
            return orders[order];
        };
        if (column) {
            const { id, order } = column.dataset;
            const newOrder = toggleOrder(order);
            this.sorting = { id, order: newOrder };
            column.dataset.order = newOrder;
            column.append(this.subElements.arrow);
            if (this.isSortClient) {
                this.sortClient(id, newOrder);
            } else {
                this.sortOnServer(id, newOrder, 1, 1 + this.step);
            }
        }
    };

    async render() {
        const element = document.createElement('div');
        element.innerHTML = this.template;
        this.element = element.firstElementChild;
        this.subElements = this.getSubElements();
        const { id, order } = this.sorting;
        const data = await this.loadData(id, order, this.start, this.end);
        this.renderRows(data);
        this.initEventListeners();
    }
    get template() {
        return `
            <div class="sortable-table">
                ${this.getHeader()}
                ${this.getBody(this.data)}
                <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
                <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
                    <div>
                        <p>No products satisfies your filter criteria</p>
                        <button type="button" class="button-primary-outline">Reset all filters</button>
                    </div>
                </div>
            </div>
        `;
    }
    getSubElements() {
        const elements = this.element.querySelectorAll('[data-element]');
        return [...elements].reduce((accumulator, current) => {
            accumulator[current.dataset.element] = current;
            return accumulator;
        }, {});
    }

    getHeader() {
        return `
            <div data-element="header" class="sortable-table__header sortable-table__row">
                ${this.headersConfig.map(item => this.getHeaderRow(item)).join('')}
            </div>
        `;
    }
    getHeaderRow({ id, title, sortable }) {
        const order = ((this.sorting.id === id) ? this.sorting.order : 'asc');
        return `
            <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="${order}">
                <span>${title}</span>
                ${this.getHeaderSortingArrow(id)}
            </div>
        `;
    }
    getHeaderSortingArrow(id) {
        const isOrderExist = this.sorting.id === id ? this.sorting.order : '';
        return ((isOrderExist) ? `
            <span data-element="arrow" class="sortable-table__sort-arrow">
                <span class="sort-arrow"></span>
            </span>
        ` : '');
    }
    getBody(data) {
        return `
            <div data-element="body" class="sortable-table__body">
                ${this.getRows(data)}
            </div>
        `;
    }
    getRows(data) {
        return data.map((item) => {
            return `
                <div class="sortable-table__row">
                    ${this.getRow(item, data)}
                </div>
            `;
        }).join('');
    }
    renderRows(data) {
        if (data.length) {
            this.element.classList.remove('sortable-table_empty');
            this.addRows(data);
        } else {
            this.element.classList.add('sortable-table_empty');
        }
    }
    getRow(item) {
        const cells = this.headersConfig.map(({ id, template }) => {
            return { id, template };
        });
        return cells.map(({ id, template }) => {
            return ((template) ? template(item[id]) : `
                <div class="sortable-table__cell">${item[id]}</div>
            `);
        }).join('');
    }
    addRows(data) {
        this.data = data;
        this.subElements.body.innerHTML = this.getRows(data);
    }

    sortData(field, order) {
        const direction = ({ asc: 1, desc: -1 })[order];
        if (direction === undefined) {
            return this.data;
        }
        const collator = new Intl.Collator(['ru', 'en'], { numeric: true, caseFirst: 'upper' });
        const sortType = this.header.find((item) => { return item.id === field })?.sortType;
        return [...this.data].sort((a, b) => {
            switch (sortType) {
            case 'string':
                return direction * collator.compare(a[field], b[field]);
            case 'number':
                return direction * (a[field] - b[field]);
            default:
                return direction * (a[field] - b[field]);
            }
        });
    }
    sortClient(field, order) {
        const sortingData = this.sortData(field, order);
        this.subElements.body.innerHTML = this.getBody(sortingData);
    }

    initEventListeners() {
        this.subElements.header.addEventListener('pointerdown', this.onSortClick);
        document.addEventListener('scroll', this.onWindowScroll);
    }

    update(data) {
        const rows = document.createElement('div');
        this.data = [...this.data, ...data];
        rows.innerHTML = this.getRows(data);
        this.subElements.body.append(...rows.childNodes);
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
        this.subElements = {};
        document.removeEventListener('scroll', this.onWindowScroll);
    }
}