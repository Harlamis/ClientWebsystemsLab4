import type { App } from "vue";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";
import Aura from "@primevue/themes/aura";

export function setupUI(app: App): void {
  app.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: ".dark",
      },
    },
  });
  app.use(ToastService);
  app.use(ConfirmationService);
}
