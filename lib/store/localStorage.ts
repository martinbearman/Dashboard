import { RootState } from "./store";

const STORAGE_KEY = "dashboard-state";

/**
 * Load state from localStorage (browser only)
 * Returns null if localStorage is unavailable or no saved state exists
 */
export function loadState(): Partial<RootState> | null {
  if (typeof window === "undefined") {
    // SSR: localStorage not available
    return null;
  }

  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return null;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.warn("Failed to load state from localStorage:", error);
    return null;
  }
}

/**
 * Save state to localStorage (browser only)
 * Silently fails if localStorage is unavailable
 */
export function saveState(state: RootState): void {
  if (typeof window === "undefined") {
    // SSR: localStorage not available
    return;
  }

  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (error) {
    console.warn("Failed to save state to localStorage:", error);
    // localStorage might be full or disabled
  }
}

/**
 * Clear saved state from localStorage
 */
export function clearState(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to clear state from localStorage:", error);
  }
}

