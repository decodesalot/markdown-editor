import { BaseView } from "./BaseView.js";

export class HeaderView extends BaseView {

    constructor() {
        super(null);

        this.callbacks = {
            onSave: null,
            onThemeToggle: null
        };

        this.saveButtonEl = null;
        this.themeButtonEl = null;
        this.titleEl = null;
    }

    getHtml() {
        return `
            <header class="shadow-sm d-flex align-items-center" id="main-header" data-header-wrapper>
                <h1>
                    <span class="text-capitalize" data-active-title>Untitled Snippet</span>
                    <button data-save-header-btn class="btn btn-sm btn-link ms-2 d-none fw-medium p-0">Save Changes</button>
                </h1>
                <div class="ms-auto">
                    <button data-bs-toggle="offcanvas" data-bs-target="#sidebar" class="btn btn-sm btn-outline-secondary border d-md-none" id="sidebar-toggle" type="button"><i class="fa fa-ellipsis"></i></button>
                    <button data-theme-toggle class="btn btn-sm btn-outline-secondary" id="theme-toggle" type="button"><i class="fa fa-sun"></i></button>
                </div>
            </header>
        `;
    }

    bindEvents() {
        this.saveButtonEl = document.querySelector('[data-save-header-btn]');
        this.themeButtonEl = document.querySelector('[data-theme-toggle]');
        this.titleEl = document.querySelector('[data-active-title]');

        if (this.saveButtonEl) {
            this.saveButtonEl.addEventListener("click", () => {
                if (this.callbacks.onSave) this.callbacks.onSave();
            });
        }

        if (this.themeButtonEl) {
            this.themeButtonEl.addEventListener("click", () => {
                if (this.callbacks.onThemeToggle) this.callbacks.onThemeToggle();
            });
        }
    }

    render(title) {
        if (!this.titleEl) return;

        this.titleEl.textContent = title || "Untitled Snippet";
    }

    toggleSaveButton(isVisible) {
        if (!this.saveButtonEl) return;

        this.saveButtonEl.classList.toggle('d-none', !isVisible);
    }

    updateThemeIcon(currentTheme) {
        if (!this.themeButtonEl) return;
        const icon = this.themeButtonEl.querySelector('.fa');
        if (icon) {
            if (currentTheme === 'dark') {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            } else {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        }
    }

    updateThemeIcon(currentTheme) {
        if (!this.themeButtonEl) return;
        const icon = this.themeButtonEl.querySelector('.fa');
        if (icon) {
            if (currentTheme === 'dark') {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            } else {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        }
    }

    onSave(callback) { this.callbacks.onSave = callback; }
    onThemeToggle(callback) { this.callbacks.onThemeToggle = callback; }
}