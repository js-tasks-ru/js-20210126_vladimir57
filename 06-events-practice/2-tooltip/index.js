class Tooltip {
    static eventMove;
    static eventOver;
    static eventOut;
  
    render(text) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <div class="tooltip">${text}</div>
        `;
        this.element = wrapper.firstElementChild;
        document.body.append(this.element);
    }
  
    initialize() {
        document.removeEventListener('pointermove', this.constructor.eventMove);
        this.constructor.eventMove = this.move.bind(this);
        document.addEventListener('pointermove', this.constructor.eventMove);
        document.removeEventListener('pointerover', this.constructor.eventOver);
        this.constructor.eventOver = this.over.bind(this);
        document.addEventListener('pointerover', this.constructor.eventOver);
        document.removeEventListener('pointerout', this.constructor.eventOut);
        this.constructor.eventOut = this.out.bind(this);
        document.addEventListener('pointerout', this.constructor.eventOut);
    }

    move($event) {
        if ($event.target.dataset.tooltip && this.element) {
            this.element.style.left = $event.clientX + 'px';
            this.element.style.top = $event.clientY + 'px';
        }
    }
    over($event) {
        if ($event.target.dataset.tooltip) {
            this.render($event.target.dataset.tooltip);
        }
    }
    out($event) {
        if ($event.target.dataset.tooltip) {
            this.remove();
        }
    }
  
    remove() {
        if (this.element) this.element.remove();
    }
  
    destroy() {
        document.removeEventListener('pointermove', this.constructor.eventMove);
        document.removeEventListener('pointerover', this.constructor.eventOver);
        document.removeEventListener('pointerout', this.constructor.eventOut);
        this.remove();
    }
}

const tooltip = new Tooltip();

export default tooltip;
