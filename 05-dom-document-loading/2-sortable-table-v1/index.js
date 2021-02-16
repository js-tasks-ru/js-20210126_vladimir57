export default class SortableTable {
    element;
    subElements;

    constructor(header = [], { data = [] } = {}) {
        this.header = header;
        this.data = data;
        this.render();
    }

    render() {
        const element = document.createElement('div');
        element.innerHTML = this.template;
        this.element = element.firstElementChild;
        this.subElements = this.getSubElements();
    }

    get template() {
        return `
            <div data-element="productsContainer" class="products-list__container">
                <div class="sortable-table">
            
                    <div data-element="header" class="sortable-table__header sortable-table__row">
                        ${this.getHeader(this.header)}
                    </div>
                
                    <div data-element="body" class="sortable-table__body">

                        ${this.getBody(this.data)}

                    </div>
                
                    <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
                
                    <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
                        <div>
                        <p>No products satisfies your filter criteria</p>
                        <button type="button" class="button-primary-outline">Reset all filters</button>
                        </div>
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

    getHeader(header = []) {
        return header.map((item) => { 
            return `
                <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}">
                    <span>${item.title}</span>
                    <span data-element="arrow" class="sortable-table__sort-arrow">
                        <span class="sort-arrow"></span>
                    </span>
                </div>
            `;
        }).join('');
    }
    
    getBody(data = []) {
        return data.map((item) => {
            return `
                <a href="/products/${item.id}" class="sortable-table__row">
                    ${this.getRow(item)}
                </a>
            `;
        }).join('');
    }

    getRow(row) {
        return this.header.map((item) => {
            return item.template ? item.template(row.images) : `
                <div class="sortable-table__cell">${row[item.id]}</div>
            `;
        }).join('');
    }

    sort(field, order) {
        this.element.querySelectorAll('.sortable-table__cell').forEach(item => {
          item.dataset.order = '';
        });
        this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`).dataset.order = order;
        const sortedData = this.sortData(field, order);
        this.subElements.body.innerHTML = this.getBody(sortedData);
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

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
        this.subElements = {};
    }
}

