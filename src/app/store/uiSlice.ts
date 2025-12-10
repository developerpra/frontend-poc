import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isMobileSidebarOpen: boolean;
}

const initialState: UIState = {
  isMobileSidebarOpen: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMobileSidebar: (state) => {
      state.isMobileSidebarOpen = !state.isMobileSidebarOpen;
    },
    setMobileSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileSidebarOpen = action.payload;
    },
    closeMobileSidebar: (state) => {
      state.isMobileSidebarOpen = false;
    },
  },
});

export const { toggleMobileSidebar, setMobileSidebarOpen, closeMobileSidebar } = uiSlice.actions;
export default uiSlice.reducer;

