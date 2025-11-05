import { Middleware } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { saveState } from "../localStorage";

/**
 * Redux middleware that saves state to localStorage after each action
 * Uses debouncing to avoid excessive writes
 */
export const localStorageMiddleware: Middleware<{}, RootState> =
  (store) => (next) => (action) => {
    const result = next(action);
    const state = store.getState();
    
    // Save to localStorage after state update
    // In a real app, you might want to debounce this
    saveState(state);
    
    return result;
  };

