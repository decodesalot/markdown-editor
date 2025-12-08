import { BaseView } from "./BaseView.js";

export class AppView extends BaseView {

    constructor({ header, sidebar, editor, modal, toast }) {
        super(document.getElementById('app-container'));

        this.headerView = header;
        this.sidebarView = sidebar;
        this.editorView = editor;
        this.modalView = modal;
        this.toastView = toast;
    }

    getHtml() {
        return `
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-3 col-lg-2 px-lg-0">
                        <div class="p-4 border-end" id="sidebar">
                            ${this.sidebarView.getHtml()}
                        </div>
                    </div>
                    <main class="col-md-9 ms-sm-auto col-lg-10 px-md-0 app">
                        ${this.headerView.getHtml()}
                        <div class="px-4 py-3">
                            <div id="app-editor-container">
                                ${this.editorView.getHtml()}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            ${this.modalView.getHtml()}
            ${this.toastView.getHtml()}
        `;
    }

    render() {
        if (this.el) {
            this.el.innerHTML = this.getHtml();
        }
    }

    bindEvents() {
        this.headerView.bindEvents();
        this.sidebarView.bindEvents();
        this.editorView.bindEvents();
        this.modalView.bindEvents();
        this.toastView.bindEvents();
    }
}