# Modular Markdown Editor (Vanilla JS)

This project started as both a personal challenge and a showcase of how far you can push pure JavaScript without relying on heavy frameworks. I wanted a clean, single page markdown editor that stayed modular and easy to reason about. To achieve that, I leaned on solid architectural patterns, especially Dependency Injection (DI) and a dedicated Composition Root to keep the codebase organized and fully testable.

## Why this architecture?

Vanilla JS apps tend to devolve into spaghetti once they grow beyond a few files. To avoid that, this project follows a few core principles:

### 1. No Imports in Components  
Components never reach out to fetch their dependencies (no `import { store } from ... }`). Instead, all dependencies are passed into each component's constructor. This keeps everything decoupled, swappable, and much easier to test.

### 2. A Single Composition Root  
All wiring happens in one place: the `composition/` folder. It’s the only part of the app that understands how the pieces fit together. It creates instances and injects dependencies where they belong, nowhere else.

### 3. Immutable Global State  
The global `Store.js` manages state as an immutable object. Any update to a snippet, deleting a file, etc. produces a brand new state instead of mutating the old one. This avoids hidden side effects and makes debugging far more predictable.

## Folder Structure  
* **`composition/`** – The brain of the app; wires everything together  
* **`controllers/`** – Handle user actions and interact with the store  
* **`views/`** – Manage the DOM and events; they don’t know controllers exist  
* **`core/Store.js`** – The single source of truth  
* **`utils/`** – Helper utilities like the Markdown parser  
