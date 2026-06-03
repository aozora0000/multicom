import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./style.css";
import { setupAutoTooltip } from "./utils/tooltip";

createApp(App).use(createPinia()).mount("#app");
setupAutoTooltip();
