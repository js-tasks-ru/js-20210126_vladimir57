export default class NotificationMessage {
    element;
    timeout;
    notification = {};

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
        if (!target.querySelector('.notification')) {
            target.append(this.element);
        }
        this.timeout = setTimeout(() => {
            this.remove();
        }, this.duration);
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        clearTimeout(this.timeout);
        this.remove();
        this.notification = {};
    }
}
