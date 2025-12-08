import { BaseView } from "./BaseView.js";

export class SidebarView extends BaseView {

    constructor() {
        super();

        this.el = null;
        this.listEl = null;
        this.newButtonEl = null;
        this.activeTitleEl = null;

        this.callbacks = {
            onSelect: null,
            onNew: null,
            onDelete: null
        };
    }

    getHtml(snippets = {}, activeSnippet = null) {
        return `
            <h6 class="sidebar-heading d-flex small justify-content-between align-items-center px-3 mt-4 mb-1 text-muted text-uppercase mb-4">
                <span class="text-white">
                    <i class="fa fa-bookmark fa-xs me-1"></i>
                    Saved Snippets
                </span>
            </h6>
            
            <ul data-sidebar-list class="nav flex-column mb-2 saved-snippets-list text-capitalize">
                ${this.#getListItemsHtml(snippets, activeSnippet)}
            </ul>

            <a class="btn btn-primary position-absolute bottom-0 start-0 end-0 m-5" href="#" aria-label="Add new snippet" data-new-snippet-btn>
                <i class="fa fa-plus-circle fa-sm"></i> Create New Snippet
            </a>
        `;
    }

    #getListItemsHtml(snippets, activeSnippet) {
        if (!snippets || Object.keys(snippets).length === 0) {
            return '<li class="nav-item text-muted p-2">No snippets yet.</li>';
        }

        return Object.keys(snippets).map((name) => {
            const isActive = name === activeSnippet;
            const activeClass = isActive ? "active" : "";

            return `
                <li class="nav-item">
                    <span class="snippet-wrapper position-relative">
                        <a class="nav-link snippet-item ${activeClass}" data-name="${name}" href="#">
                            <i class="fa-regular fa-file-lines fa-xs me-2"></i>
                            ${name}
                        </a>
                        <button class="delete-btn position-absolute top-0 end-0 btn btn-sm text-danger mt-1" type="button" data-delete-name="${name}" aria-label="Delete ${name}">
                            <i class="fa fa-xmark fa-xs"></i>
                        </button>
                    </span>
                </li>
            `;
        }).join("\n");
    }

    bindEvents() {

        this.el = document.getElementById('sidebar');

        if (!this.el) {
            console.error("CRITICAL: #sidebar container not found for SidebarView.");
            return;
        }

        this.listEl = this.el.querySelector('[data-sidebar-list]');
        this.newButtonEl = this.el.querySelector('[data-new-snippet-btn]');
        this.activeTitleEl = this.el.querySelector('[data-active-title]');

        if (this.listEl) {
            this.listEl.addEventListener("click", (e) => this.#handleListClick(e));
        } else {
            console.error("Critical Error: [data-sidebar-list] element not found for SidebarView.");
        }

        if (this.newButtonEl) {
            this.newButtonEl.addEventListener("click", () => {
                if (this.callbacks.onNew) this.callbacks.onNew();
            });
        }
    }

    #handleListClick(e) {
        e.preventDefault();

        const deleteButton = e.target.closest("[data-delete-name]");
        if (deleteButton) {
            e.stopPropagation();

            const name = deleteButton.dataset.deleteName;

            if (name && this.callbacks.onDelete) {
                this.callbacks.onDelete(name);
            }
            return;
        }

        const selectLink = e.target.closest(".snippet-item");
        if (selectLink) {
            const name = selectLink.dataset.name;
            if (this.callbacks.onSelect) {
                this.callbacks.onSelect(name);
            }
            return;
        }
    }

    render(snippets, activeSnippet) {
        if (!this.listEl) return;

        this.listEl.innerHTML = this.#getListItemsHtml(snippets, activeSnippet);
        this.updateActive(activeSnippet);
    }

    updateActive(activeSnippet) {
        if (!this.listEl) return;

        this.listEl.querySelectorAll(".snippet-item").forEach((item) => {
            item.classList.toggle("active", item.dataset.name === activeSnippet);
        });

        if (this.activeTitleEl) {
            const titleSpan = this.activeTitleEl.querySelector('span');
            if (titleSpan) {
                titleSpan.textContent = activeSnippet || "Untitled Snippet";
            }
        }
    }

    onSelect(callback) { this.callbacks.onSelect = callback; }
    onNew(callback) { this.callbacks.onNew = callback; }
    onDelete(callback) { this.callbacks.onDelete = callback; }
}