import { BaseView } from "./BaseView.js";

export class ModalView extends BaseView {

    constructor() {
        super(null);

        this.modalEl = null;
        this.titleEl = null;
        this.messageEl = null;
        this.inputEl = null;
        this.confirmBtn = null;
        this.bsModal = null;

        this.callbacks = {
            onConfirmDelete: null,
            onSave: null
        };
        this.currentMode = null;
    }

    getHtml() {
        return `
            <div class="modal fade" data-modal data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalSnippetLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" data-modal-title></h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p data-modal-message class="small text-muted mb-3"></p>
                            <input type="text" data-modal-input class="form-control" placeholder="Enter snippet name…" required>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" data-modal-confirm-btn></button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        this.modalEl = document.querySelector('[data-modal]');
        this.titleEl = document.querySelector('[data-modal-title]');
        this.messageEl = document.querySelector('[data-modal-message]');
        this.inputEl = document.querySelector('[data-modal-input]');
        this.confirmBtn = document.querySelector('[data-modal-confirm-btn]');

        if (this.modalEl && window.bootstrap) {
            this.bsModal = new window.bootstrap.Modal(this.modalEl);
        }

        if (this.confirmBtn) {
            this.confirmBtn.addEventListener('click', () => this.#handleConfirmClick());
        }

        this.modalEl?.addEventListener('hidden.bs.modal', () => {
            this.inputEl?.classList.remove('is-invalid');
            this.inputEl.value = '';
        });
    }

    setMode(mode, title = '') {
        this.currentMode = mode;
        this.inputEl?.classList.remove('is-invalid');

        if (this.titleEl) this.titleEl.textContent = (mode === 'save' ? 'Save Snippet' : 'Delete Snippet');

        if (mode === 'delete') {
            if (this.messageEl) this.messageEl.textContent = `Are you sure you want to delete the snippet "${title}"? This action cannot be undone.`;
            if (this.confirmBtn) {
                this.confirmBtn.textContent = 'Delete';
                this.confirmBtn.classList.remove('btn-primary');
                this.confirmBtn.classList.add('btn-danger');
            }
            if (this.inputEl) this.inputEl.classList.add('d-none');

        } else if (mode === 'save') {
            if (this.messageEl) this.messageEl.textContent = 'Please enter a name for your snippet:';
            if (this.confirmBtn) {
                this.confirmBtn.textContent = 'Save';
                this.confirmBtn.classList.remove('btn-danger');
                this.confirmBtn.classList.add('btn-primary');
            }
            if (this.inputEl) {
                this.inputEl.classList.remove('d-none');
                this.inputEl.value = title;
            }
        }
    }

    open() {
        this.bsModal?.show();
    }

    close() {
        this.bsModal?.hide();
    }

    #handleConfirmClick() {
        if (this.currentMode === 'delete' && this.callbacks.onConfirmDelete) {
            this.callbacks.onConfirmDelete();
        } else if (this.currentMode === 'save' && this.callbacks.onSave) {
            if (this.inputEl) {
                const newName = this.inputEl.value.trim();
                if (newName) {
                    this.callbacks.onSave(newName);
                    this.inputEl.classList.remove('is-invalid');
                } else {
                    this.inputEl.classList.add('is-invalid');
                }
            }
        }
    }

    onConfirmDelete(callback) { this.callbacks.onConfirmDelete = callback; }
    onSave(callback) { this.callbacks.onSave = callback; }
}