import { configureStore, combineReducers } from "@reduxjs/toolkit";
import dashboardsReducer from "./slices/dashboardsSlice";
import globalConfigReducer from "./slices/globalConfigSlice";
import moduleConfigsReducer from "./slices/moduleConfigsSlice";
import { localStorageMiddleware } from "./middleware/localStorageMiddleware";

const rootReducer = combineReducers({
  dashboards: dashboardsReducer,
  globalConfig: globalConfigReducer,
  moduleConfigs: moduleConfigsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(localStorageMiddleware),
    // Preload state from localStorage (passed from StoreProvider)
    preloadedState: preloadedState || undefined,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];

