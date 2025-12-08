import { BaseView } from "./BaseView.js";

export class ToastView extends BaseView {

    constructor() {
        super(null);

        this.toastEl = null;
        this.messageEl = null;
        this.bsToast = null;
    }

    getHtml() {
        return `
            <div data-toast-container class="toast-container position-fixed top-0 end-0 p-3">
                <div data-toast-element class="toast text-bg-success" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header">
                        <strong class="me-auto">Notification</strong>
                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div data-toast-message class="toast-body">
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        this.toastEl = document.querySelector('[data-toast-element]');
        this.messageEl = document.querySelector('[data-toast-message]');

        if (!this.toastEl || !window.bootstrap) {
            console.error("FATAL: Toast elements not found or Bootstrap missing.");
            return;
        }

        this.bsToast = new bootstrap.Toast(this.toastEl, {
            autohide: true,
            delay: 3000
        });
    }

    show(message) {
        if (!this.bsToast || !this.messageEl) {
            console.error("ToastView not fully initialized. Call bindEvents first.");
            return;
        }

        this.messageEl.textContent = message;
        this.bsToast.show();
    }
}