import { ref } from "vue";

const isDark = ref(localStorage.getItem("theme") === "dark");

export function useTheme() {
  const applyTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleTheme = () => {
    isDark.value = !isDark.value;
    localStorage.setItem("theme", isDark.value ? "dark" : "light");
    applyTheme(isDark.value);
  };

  const initTheme = () => {
    applyTheme(isDark.value);
  };

  return { isDark, toggleTheme, initTheme };
}
