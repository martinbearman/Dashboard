import { configureStore } from "@reduxjs/toolkit";
import dashboardsReducer from "./slices/dashboardsSlice";
import globalConfigReducer from "./slices/globalConfigSlice";
import moduleConfigsReducer from "./slices/moduleConfigsSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      dashboards: dashboardsReducer,
      globalConfig: globalConfigReducer,
      moduleConfigs: moduleConfigsReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

