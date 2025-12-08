import { store } from "../core/Store.js";
import { ModalView, ToastView, HeaderView } from "../views/index.js";
import { HeaderController, ThemeController } from "../controllers/index.js";

export function composeGlobalServices() {
    const modal = new ModalView();
    const toast = new ToastView();
    const header = new HeaderView();

    const globalViews = { header, modal, toast, store }; 

    new HeaderController(header, modal, toast, store); 
    new ThemeController(header, store);
    
    return globalViews; 
}