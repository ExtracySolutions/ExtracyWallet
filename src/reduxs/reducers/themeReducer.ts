import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type ThemeState = {
  theme: 'dark' | 'light'
}

const defaultThemeState: ThemeState = {
  theme: 'light',
}

const themeSlice = createSlice({
  name: 'theme',
  initialState: defaultThemeState,
  reducers: {
    changeTheme(state: ThemeState, action: PayloadAction<'dark' | 'light'>) {
      if (action.payload === 'light') {
        state.theme = 'light'
      } else {
        state.theme = 'dark'
      }
    },
  },
})

export const { changeTheme } = themeSlice.actions
export const ThemeReducer = themeSlice.reducer
