import { BaseView } from "./BaseView.js";

export class EditorView extends BaseView {

    constructor() {
        super(null);

        this.editorEl = null;
        this.previewEl = null;

        this.callbacks = {
            onInput: null,
            onSave: null
        };
    }

    getHtml() {
        return `
            <div class="editor-container rounded">
                <textarea data-editor placeholder="Type Markdown here..." class="form-control p-5"></textarea>
                <div data-preview class="p-5 border-start" id="preview"></div>
            </div>
        `;
    }

    bindEvents() {

        this.editorEl = document.querySelector('[data-editor]');
        this.previewEl = document.querySelector('[data-preview]');

        if (!this.editorEl) {
            console.error("FATAL: Editor element [data-editor] not found for EditorView.");
            return;
        }

        this.editorEl.addEventListener("input", (e) => {
            if (this.callbacks.onInput) {
                this.callbacks.onInput(e.target.value);
            }
        });
    }

    setEditorContent(content) {
        if (!this.editorEl) return;
        if (this.editorEl.value !== content) {
            this.editorEl.value = content;
        }
    }

    setPreviewContent(htmlContent) {
        if (!this.previewEl) return;
        this.previewEl.innerHTML = htmlContent;
    }

    onInput(callback) {
        this.callbacks.onInput = callback;
    }

    onSave(callback) {
        this.callbacks.onSave = callback;
    }
}