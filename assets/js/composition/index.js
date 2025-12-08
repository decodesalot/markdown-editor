import { AppView } from "../views/index.js";
import { composeGlobalServices } from "./global.composition.js";
import { composeSidebar } from "./sidebar.composition.js";
import { composeEditor } from "./editor.composition.js";

export function composeApplication() {

    const sharedServices = composeGlobalServices();
    const sidebarComponents = composeSidebar(sharedServices);
    const editorComponents = composeEditor(sharedServices);

    const allComponents = {
        ...sharedServices,
        ...sidebarComponents,
        ...editorComponents,
    };

    const appInstance = new AppView(allComponents);
    return { app: appInstance };
}