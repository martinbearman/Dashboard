import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GlobalConfigState {
  theme: "light" | "dark";
}

const initialState: GlobalConfigState = {
  theme: "light",
};

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

