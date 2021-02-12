export default class SortableTable {
    element;
    timeout;

    constructor(header = [], { data = [] } = {}) {
        this.header = header;
        this.data = data;
        this.render();
    }

    render() {
        const element = document.createElement('div');
        element.innerHTML = this.template;
        this.element = element.firstElementChild;
    }

    get template() {
        return `
            <div data-element="productsContainer" class="products-list__container">
                <div class="sortable-table">
            
                    <div data-element="header" class="sortable-table__header sortable-table__row">
                        ${this.getHeader(this.header)}
                    </div>
                
                    <div data-element="body" class="sortable-table__body">

                        ${this.getData(this.header, this.data)}

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

    getHeader(header) {
        return header.map((item) => {
            return `
                <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="asc">
                    <span>${item.title}</span>
                </div>
            `;
        }).join('');
    }
    getData(header, data) {
        console.log(header, data);
        return data.map((row) => {
            const select = [];
            header.forEach((col) => {
                if (col.id in row) {
                    const value = row[col.id];
                    if (col.template) {
                        select.push(col.template(value));
                    } else {
                        select.push(`<div class="sortable-table__cell">${value}</div>`);
                    }
                }
            });
            return `
                <a href="#" class="sortable-table__row">${select.join('')}</a>
            `;
        }).join('');
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
        this.notification = {};
    }
}

