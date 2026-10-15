import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "./App.vue";
import { router } from "./providers/router";
import { registerServices } from "./providers/services";
import { setupUI } from "./providers/ui";
import "@/app/styles/main.scss";

registerServices();

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
setupUI(app);
app.use(router);

app.mount("#app");
