export class HeaderController {

    constructor(header, modal, toast, store) {
        this.header = header;
        this.store = store;
        this.modal = modal;
        this.toast = toast;

        this.#setupListeners();
        this.#setupSubscriptions();
    }

    #setupListeners() {
        this.header.onSave(() => {
            const currentContent = this.store.state.editorContent;

            if (this.store.state.activeSnippet) {
                this.#handleSaveExisting(currentContent);
            } else {
                this.#handleSaveNew(currentContent);
            }
        });

        this.header.onThemeToggle(() => {
            this.store.toggleTheme();
        });
    }

    #handleSaveExisting(content) {
        const { requiresName } = this.store.saveCurrent(content);

        if (!requiresName) {
            this.toast.show(`Snippet "${this.store.state.activeSnippet}" saved!`);
        } else {
            this.#handleSaveNew(content);
        }
    }

    #handleSaveNew(content) {
        this.modal.setMode('save', this.store.state.activeSnippet || "Untitled Snippet");
        this.modal.open();
        this.modal.onSave((newName) => {
            this.store.addSnippet(newName, content);
            this.modal.close();
            this.toast.show(`Snippet "${newName}" saved successfully!`);
        });
    }


    #setupSubscriptions() {
        this.store.subscribeAll(() => {
            const currentContent = this.store.state.editorContent;
            const hasChanges = this.store.hasUnsavedChanges(currentContent);

            this.#updateSaveButtonVisibility(hasChanges);
        });

        this.store.subscribe("activeSnippet", (snippetName) => {
            this.#updateActiveTitle(snippetName);
        });

        this.#updateActiveTitle(this.store.state.activeSnippet);
    }

    #updateActiveTitle(name) {
        this.header.render(name);
        document.title = `${name} | Markdown Snippet`;
    }

    #updateSaveButtonVisibility(hasChanges) {
        const saveButton = this.header.saveButtonEl;
        if (saveButton) {
            saveButton.classList.toggle("d-none", !hasChanges);
        }
    }
}