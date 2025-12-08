export class SidebarController {

    constructor(sidebar, modal, toast, store) { 
        this.sidebar = sidebar;
        this.modal = modal;
        this.toast = toast;
        this.store = store;
        
        this.#setupListeners();
        this.#setupSubscriptions();
    }

    #setupListeners() {
        this.sidebar.onSelect((name) => {
            if (this.handleUnsavedChanges(() => this.store.loadSnippet(name))) return;
            this.store.loadSnippet(name);
        });

        this.sidebar.onNew(() => {
            if (this.handleUnsavedChanges(() => this.store.newSnippet())) return;
            this.store.newSnippet();
        });
        
        this.sidebar.onDelete((name) => {
            this.modal.setMode('delete', name);
            this.modal.open(name);
            this.modal.onConfirmDelete(() => {
                console.log('name check', name);
                this.store.deleteSnippet(name);
                this.modal.close();
                this.toast.show(`Snippet "${name}" deleted.`);
            });
        });
    }

    #setupSubscriptions() {
        this.store.subscribeAll(() => {
            const { snippets, activeSnippet } = this.store.state;

            this.sidebar.render(snippets, activeSnippet);
        });
    }

    handleUnsavedChanges(callbackIfSaved) {
         const { editorContent, activeSnippet } = this.store.state;

        if (this.store.hasUnsavedChanges(editorContent)) { 
            this.modal.setMode('save');
            this.modal.open(activeSnippet || "Untitled Snippet"); 

            this.modal.onSave((newName) => {
                this.store.addSnippet(newName, editorContent);
                this.modal.close();
                callbackIfSaved?.(newName);
            });
            return true;
        }
        return false;
    }
}