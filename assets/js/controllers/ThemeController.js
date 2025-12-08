export class ThemeController {
    
    constructor(header, store) {
        this.store = store;
        this.header = header;
        this.header.onThemeToggle(() => this.#toggleTheme());
        
        this.#setupSubscription();
    }

    #setupSubscription() {
        this.store.subscribe("theme", (newTheme) => {
            this.#applyTheme(newTheme);
        });
    }
    
    #toggleTheme() {
        this.store.toggleTheme();
    }
    
    #applyTheme(theme) {
        document.body.setAttribute('data-bs-theme', theme);

        this.header.updateThemeIcon(theme); 
    }
}