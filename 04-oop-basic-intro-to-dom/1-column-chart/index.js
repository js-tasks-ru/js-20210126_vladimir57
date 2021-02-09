export default class ColumnChart {
    element;
    chart = {};
    chartHeight = 50;

    constructor({ data = [], label = '', link = '', value = 0 } = {}) {
        this.data = data;
        this.label = label;
        this.link = link;
        this.value = value;
        this.render();
    }

    render() {
        const element = document.createElement('div');
        element.innerHTML = this.template;
        this.element = element.firstElementChild;
        if (this.data.length) {
            this.element.classList.remove('column-chart_loading');
        }
        this.chart = this.getChart(this.element);
    }

    get template() {
        return `
            <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
                <div class="column-chart__title">
                    Total ${this.label}
                    ${this.getLink()}
                </div>
                <div class="column-chart__container">
                    <div data-element="header" class="column-chart__header">
                        ${this.value}
                    </div>
                    <div data-element="body" class="column-chart__chart">
                        ${this.getColumnChart(this.data)}
                    </div>
                </div>
            </div>
        `;
    }
    getChart(element) {
        const elements = element.querySelectorAll('[data-element]');
        return [...elements].reduce((accumulator, current) => {
            accumulator[current.dataset.element] = current;
            return accumulator;
        }, {});
    }
    getLink() {
        return ((this.link) ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '');
    }
    getColumnChart(data) {
        const columnHeight = Math.max(...data);
        return data.map((item) => {
            const scale = this.chartHeight / columnHeight;
            const percentage = (item / columnHeight * 100).toFixed(0);
            return `<div style="--value: ${Math.floor(item * scale)}" data-tooltip="${percentage}%"></div>`;
        }).join('');
    }

    update(data) {
        this.chart.body.innerHTML = this.getColumnChart(data);
    }
    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
        this.chart = {};
    }
}
