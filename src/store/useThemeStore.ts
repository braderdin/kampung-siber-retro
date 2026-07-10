// Start: Imports
import { create } from 'zustand';
// End: Imports

// Start: Type Definitions
type ThemeId = 'space' | 'gray' | 'matrix';

interface ThemeState {
  currentTheme: ThemeId;
  setTheme: (theme: ThemeId) => void;
}
// End: Type Definitions

// Start: Theme Store Creation
export const useThemeStore = create<ThemeState>((set) => ({
  currentTheme: 'space',
  setTheme: (theme) => set({ currentTheme: theme }),
}));
// End: Theme Store Creation