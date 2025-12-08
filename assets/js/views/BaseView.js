export class BaseView {

    constructor(el = null) {
        this.el = el;
        this.viewName = this.constructor.name;
    }

    getHtml() {
        return '';
    }

    bindEvents() {
        // !Info: BaseView does nothing. Child views must implement this to find elements
    }

    render() {
        // !Info: BaseView does nothing. Child views implement this to update this.el or its children.
    }
}