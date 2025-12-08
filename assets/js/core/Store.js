const THEME_STORAGE_KEY = 'appTheme';
const SNIPPET_STORAGE_KEY = 'markdownSnippets';

class Store {
    constructor() {
        this.state = {
            snippets: JSON.parse(localStorage.getItem("markdownSnippets") || "{}"),
            activeSnippet: null,
            editorContent: "",
            theme: localStorage.getItem(THEME_STORAGE_KEY) || "light",
        };

        this.subscribers = {};
        this.globalSubscribers = [];
    }

    #notify(key, value) {
        if (this.subscribers[key]) {
            this.subscribers[key].forEach(cb => cb(value, this.state));
        }
        this.globalSubscribers.forEach(cb => cb(key, value, this.state));
    }

    #persist() {
        localStorage.setItem(SNIPPET_STORAGE_KEY, JSON.stringify(this.state.snippets));
        localStorage.setItem(THEME_STORAGE_KEY, this.state.theme);
    }

    #setState(changes) {
        this.state = { ...this.state, ...changes };
        this.#persist();

        Object.keys(changes).forEach(key => {
            this.#notify(key, changes[key]);
        });

        this.globalSubscribers.forEach(cb => cb(null, null, this.state));
    }

    subscribe(key, callback) {
        if (!this.subscribers[key]) this.subscribers[key] = [];
        this.subscribers[key].push(callback);
    }

    subscribeAll(callback) {
        this.globalSubscribers.push(callback);
    }

    init() {
        this.globalSubscribers.forEach(cb => cb(null, null, this.state));
        this.#notify('theme', this.state.theme);
    }

    loadSnippet(name) {
        const content = this.state.snippets[name] || "";

        this.#setState({
            activeSnippet: name,
            editorContent: content
        });
    }

    addSnippet(name, content) {
        const newSnippets = { ...this.state.snippets, [name]: content };

        this.#setState({
            snippets: newSnippets,
            activeSnippet: name,
            editorContent: content
        });
    }

    newSnippet() {
        this.#setState({
            activeSnippet: null,
            editorContent: ""
        });
    }

    toggleTheme() {
        const currentTheme = this.state.theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.#setState({ theme: newTheme });
    }

    updateEditorContent(content) {
        this.#setState({ "editorContent": content });
    }

    saveCurrent(content) {
        const active = this.state.activeSnippet;

        if (active) {
            const newSnippets = {
                ...this.state.snippets,
                [active]: content
            };

            this.#setState({ "snippets": newSnippets });
            return { requiresName: false };
        }

        return { requiresName: true };
    }

    hasUnsavedChanges(currentEditorValue) {
        const active = this.state.activeSnippet;
        if (!active) return currentEditorValue.trim() !== "";
        const savedContent = this.state.snippets[active] || "";
        return savedContent !== currentEditorValue;
    }

    deleteSnippet(name) {
        if (!this.state.snippets[name]) return;

        const { [name]: deletedSnippet, ...remainingSnippets } = this.state.snippets;

        const changes = {
            snippets: remainingSnippets
        };

        if (this.state.activeSnippet === name) {
            const remainingKeys = Object.keys(remainingSnippets);

            if (remainingKeys.length > 0) {
                const nextActiveName = remainingKeys.at(-1);
                changes.activeSnippet = nextActiveName;
                changes.editorContent = remainingSnippets[nextActiveName];
            } else {
                changes.activeSnippet = null;
                changes.editorContent = "";
            }
        }

        this.#setState(changes);
    }
}

export const store = new Store();