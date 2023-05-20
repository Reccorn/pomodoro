import { createSlice } from "@reduxjs/toolkit";

export interface IThemeState {
    isDark: boolean;
}

const initialState: IThemeState = {
    isDark: false
}

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        switchTheme: (state) => {
            state.isDark = !state.isDark
        }
    }
});

export const { switchTheme } = themeSlice.actions;

export default themeSlice.reducer;