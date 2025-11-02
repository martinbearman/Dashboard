import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Dashboard, ModuleInstance } from "@/lib/types/dashboard";

interface DashboardsState {
  activeDashboardId: string | null;
  dashboards: Record<string, Dashboard>;
}

const initialState: DashboardsState = {
  activeDashboardId: null,
  dashboards: {},
};

const dashboardsSlice = createSlice({
  name: "dashboards",
  initialState,
  reducers: {
    addDashboard: (state, action: PayloadAction<Dashboard>) => {
      state.dashboards[action.payload.id] = action.payload;
      if (!state.activeDashboardId) {
        state.activeDashboardId = action.payload.id;
      }
    },
    setActiveDashboard: (state, action: PayloadAction<string>) => {
      if (state.dashboards[action.payload]) {
        state.activeDashboardId = action.payload;
      }
    },
    addModule: (
      state,
      action: PayloadAction<{ dashboardId: string; module: ModuleInstance }>
    ) => {
      const dashboard = state.dashboards[action.payload.dashboardId];
      if (dashboard) {
        dashboard.modules.push(action.payload.module);
      }
    },
    removeModule: (
      state,
      action: PayloadAction<{ dashboardId: string; moduleId: string }>
    ) => {
      const dashboard = state.dashboards[action.payload.dashboardId];
      if (dashboard) {
        dashboard.modules = dashboard.modules.filter(
          (m) => m.id !== action.payload.moduleId
        );
      }
    },
    updateModulePosition: (
      state,
      action: PayloadAction<{
        dashboardId: string;
        moduleId: string;
        position: { x: number; y: number; w: number; h: number };
      }>
    ) => {
      const dashboard = state.dashboards[action.payload.dashboardId];
      if (dashboard) {
        const moduleInstance = dashboard.modules.find(
          (m) => m.id === action.payload.moduleId
        );
        if (moduleInstance) {
          moduleInstance.gridPosition = action.payload.position;
        }
      }
    },
  },
});

export const {
  addDashboard,
  setActiveDashboard,
  addModule,
  removeModule,
  updateModulePosition,
} = dashboardsSlice.actions;

export default dashboardsSlice.reducer;

