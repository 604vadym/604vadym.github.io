import { createSlice } from "@reduxjs/toolkit";
import type { Theme } from "../../types/types";

const themeSlice = createSlice({
  name: "theme",
  initialState: "dark" as Theme,
  reducers: {
    toggleTheme(state) {
      return state === "dark" ? "light" : "dark";
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export const selectTheme = (state: { theme: Theme }) => state.theme;
export default themeSlice.reducer;
