import { create } from "zustand";
import { persist } from "zustand/middleware";

const THEME_STORAGE_KEY = "theme-storage";

const useThemeStore = create(
  persist(
    (set, get) => ({
      // State
      mode: "light",
      isLoading: false,

      // Actions
      toggleTheme: () => {
        set((state) => {
          const newMode = state.mode === "light" ? "dark" : "light";
          return { mode: newMode };
        });
      },

      setTheme: (mode) => {
        if (mode === "light" || mode === "dark") {
          set({ mode });
        }
      },

      // Selectors
      isDarkMode: () => {
        return get().mode === "dark";
      },

      isLightMode: () => {
        return get().mode === "light";
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      partialize: (state) => ({ mode: state.mode }),
    }
  )
);

export default useThemeStore;
