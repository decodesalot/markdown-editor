import { store } from "./Store.js"; 
import { composeApplication } from "../composition/index.js"; 
const { app } = composeApplication();

app.render();
app.bindEvents();
store.init();