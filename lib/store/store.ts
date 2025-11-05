import { configureStore } from "@reduxjs/toolkit";
import dashboardsReducer from "./slices/dashboardsSlice";
import globalConfigReducer from "./slices/globalConfigSlice";
import moduleConfigsReducer from "./slices/moduleConfigsSlice";
import { localStorageMiddleware } from "./middleware/localStorageMiddleware";

export const makeStore = (preloadedState?: any) => {
  return configureStore({
    reducer: {
      dashboards: dashboardsReducer,
      globalConfig: globalConfigReducer,
      moduleConfigs: moduleConfigsReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(localStorageMiddleware),
    // Preload state from localStorage (passed from StoreProvider)
    preloadedState: preloadedState || undefined,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

