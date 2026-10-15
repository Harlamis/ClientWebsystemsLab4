import { ref } from "vue";

const isDark = ref(localStorage.getItem("theme") === "dark");

export function useTheme() {
  const toggleTheme = () => {
    isDark.value = !isDark.value;
    if (isDark.value) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const initTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add("dark");
    }
  };

  return { isDark, toggleTheme, initTheme };
}
