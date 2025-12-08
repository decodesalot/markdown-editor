import { SidebarView } from "../views/index.js";
import { SidebarController } from "../controllers/index.js";

export function composeSidebar(sharedServices) {
    const sidebar = new SidebarView();
    const { modal, toast, store } = sharedServices;

    new SidebarController(sidebar, modal, toast, store);

    return { sidebar };
}