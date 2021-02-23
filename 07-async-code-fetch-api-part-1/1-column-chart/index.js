import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
    element;
    subElements = {};
    chartHeight = 50;

    constructor({ label = '', link = '', range = { from: new Date(), to: new Date() }, url = '' } = {}) {
        this.label = label;
        this.link = link;
        this.range = range;
        this.url = new URL(url, BACKEND_URL);
        this.render();
    }

    async loadData(from, to) {
        this.element.classList.add('column-chart_loading');
        this.subElements.header.textContent = '';
        this.subElements.body.innerHTML = '';
        this.url.searchParams.set('from', from.toISOString());
        this.url.searchParams.set('to', to.toISOString());
        const data = Object.values(await fetchJson(this.url));
        this.changeRange(from, to);
        if (data.length) {
            this.subElements.header.textContent = this.getHeaderChart(data);
            this.subElements.body.innerHTML = this.getColumnChart(data);
            this.element.classList.remove('column-chart_loading');
        }
    }
    async update(from, to) {
        return await this.loadData(from, to);
    }

    render() {
        const element = document.createElement('div');
        element.innerHTML = this.template;
        this.element = element.firstElementChild;
        this.subElements = this.getSubElements(this.element);
        this.loadData(this.range.from, this.range.to);
    }

    get template() {
        return `
            <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
                <div class="column-chart__title">
                    Total ${this.label}
                    ${this.getLink()}
                </div>
                <div class="column-chart__container">
                    <div data-element="header" class="column-chart__header"></div>
                    <div data-element="body" class="column-chart__chart"></div>
                </div>
            </div>
        `;
    }
    getHeaderChart(data) {
        return Object.values(data).reduce((accumulator, current) => {
            return accumulator + current;
        }, 0);
    }
    getColumnChart(data) {
        const columnHeight = Math.max(...data);
        return data.map((item) => {
            const scale = this.chartHeight / columnHeight;
            const percentage = (item / columnHeight * 100).toFixed(0);
            return `<div style="--value: ${Math.floor(item * scale)}" data-tooltip="${percentage}%"></div>`;
        }).join('');
    }
    getLink() {
        return ((this.link) ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '');
    }
    getSubElements(element) {
        const elements = element.querySelectorAll('[data-element]');
        return [...elements].reduce((accumulator, current) => {
            accumulator[current.dataset.element] = current;
            return accumulator;
        }, {});
    }

    changeRange(from, to) {
        this.range.from = from;
        this.range.to = to;
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
    }
}
