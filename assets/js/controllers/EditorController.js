import { parseMarkdown } from "../utils/markdown.js";

export class EditorController {

    constructor(editor, modal, toast, store) {
        this.editor = editor;
        this.store = store;
        this.modal = modal;
        this.toast = toast;

        this.#setupListeners();
        this.#setupSubscriptions();
    }

    #setupListeners() {
        this.editor.onInput((content) => {
            this.store.updateEditorContent(content);
        });

        this.editor.onSave(() => {
            const content = this.editor.getContent();
            const result = this.store.saveCurrent(content);

            if (result.requiresName) {
                this.modal.setMode('save');
                this.modal.open(this.store.state.activeSnippet || "New Snippet");

                this.modal.onSave((name) => {
                    this.store.addSnippet(name, content);
                    this.modal.close();
                    this.toast.show(`Snippet "${name}" saved.`);
                });
            } else {
                this.toast.show("Snippet saved.");
            }
        });
    }

    #setupSubscriptions() {
        this.store.subscribe("editorContent", (content) => {
            const htmlContent = parseMarkdown(content);

            this.editor.setEditorContent(content);
            this.editor.setPreviewContent(htmlContent);
        });

    }
}