import { EditorView } from "../views/index.js";
import { EditorController } from "../controllers/index.js";

export function composeEditor(sharedServices) {
    const editor = new EditorView();
    const { modal, toast, store } = sharedServices;

    new EditorController(editor, modal, toast, store);

    return { editor };
}