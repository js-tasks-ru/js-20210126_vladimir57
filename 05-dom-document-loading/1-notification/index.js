export default class NotificationMessage {
    element;
    current;
    timeout;

    constructor(message, { duration = 0, type } = {}) {
        this.message = message;
        this.duration = duration;
        this.type = type;
        this.render();
    }

    render() {
        const element = document.createElement('div');
        element.innerHTML = this.template;
        this.element = element.firstElementChild;
    }

    get template() {
        return `
            <div class="notification ${this.type}" data-element="notification" style="--value:${(this.duration / 1000)}s">
                <div class="timer"></div>
                <div class="inner-wrapper">
                    <div class="notification-header" data-element="notification-header">${this.type}</div>
                    <div class="notification-body" data-element="notification-body">${this.message}</div>
                </div>
            </div>
        `;
    }

    show(target = document.body) {
        if (this.constructor.current) {
            this.constructor.current.remove(); 
        }
        this.constructor.current = target.appendChild(this.element);
        if (this.constructor.timeout) {
            clearTimeout(this.constructor.timeout);
        };
        this.constructor.timeout = setTimeout(() => {
            this.remove();
        }, this.duration);
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
        this.notification = {};
    }
}
