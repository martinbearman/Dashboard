import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GlobalConfigState {
  theme: "light" | "dark";
}

export const createInitialGlobalConfigState = (): GlobalConfigState => ({
  theme: "light",
});

const initialState: GlobalConfigState = createInitialGlobalConfigState();

const globalConfigSlice = createSlice({
  name: "globalConfig",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },
  },
});

export const { setTheme } = globalConfigSlice.actions;

export default globalConfigSlice.reducer;

