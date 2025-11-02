import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModuleConfigsState {
  configs: Record<string, Record<string, any>>; // moduleId -> config object
}

const initialState: ModuleConfigsState = {
  configs: {},
};

const moduleConfigsSlice = createSlice({
  name: "moduleConfigs",
  initialState,
  reducers: {
    setModuleConfig: (
      state,
      action: PayloadAction<{ moduleId: string; config: Record<string, any> }>
    ) => {
      state.configs[action.payload.moduleId] = action.payload.config;
    },
    updateModuleConfig: (
      state,
      action: PayloadAction<{ moduleId: string; config: Partial<Record<string, any>> }>
    ) => {
      if (!state.configs[action.payload.moduleId]) {
        state.configs[action.payload.moduleId] = {};
      }
      state.configs[action.payload.moduleId] = {
        ...state.configs[action.payload.moduleId],
        ...action.payload.config,
      };
    },
    removeModuleConfig: (state, action: PayloadAction<string>) => {
      delete state.configs[action.payload];
    },
  },
});

export const { setModuleConfig, updateModuleConfig, removeModuleConfig } =
  moduleConfigsSlice.actions;

export default moduleConfigsSlice.reducer;

