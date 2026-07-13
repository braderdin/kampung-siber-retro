// Start: Imports
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
// End: Imports

// Start: Type Definitions
// Enum values map 1:1 to CSS [data-theme] hooks in globals.css
type ThemeId = "space-neon" | "windows-gray" | "retro-matrix";

interface ThemeState {
  currentTheme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  applyTheme: () => void;
}

// Maps each ThemeId to its CSS [data-theme] attribute value
const THEME_ATTR: Record<ThemeId, string> = {
  "space-neon": "space-neon",
  "windows-gray": "windows-gray",
  "retro-matrix": "retro-matrix",
};
// End: Type Definitions

// Start: Theme Store Creation
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentTheme: "space-neon",
      setTheme: (theme) => {
        set({ currentTheme: theme });
        if (typeof document !== "undefined") {
          document.documentElement.dataset.theme = THEME_ATTR[theme];
        }
      },
      applyTheme: () => {
        if (typeof document !== "undefined") {
          document.documentElement.dataset.theme = THEME_ATTR[get().currentTheme];
        }
      },
    }),
    {
      name: "kampung-siber-theme",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state && typeof document !== "undefined") {
          document.documentElement.dataset.theme = THEME_ATTR[state.currentTheme];
        }
      },
    }
  )
);
// End: Theme Store Creation