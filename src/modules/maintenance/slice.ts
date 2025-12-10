import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define a type for the slice state based on the dummy data structure we saw
interface MaintenanceState {
  currentVessel: {
    vesselName: string;
    active: boolean;
    imo?: string;
  } | null;
  isLoading: boolean;
}

const initialState: MaintenanceState = {
  currentVessel: {
    vesselName: "EBL-2869",
    active: true,
    imo: "1234567"
  },
  isLoading: false,
};

export const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState,
  reducers: {
    setVesselName: (state, action: PayloadAction<string>) => {
      if (state.currentVessel) {
        state.currentVessel.vesselName = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    resetMaintenanceState: (state) => {
      return initialState;
    }
  },
});

export const { setVesselName, setLoading, resetMaintenanceState } = maintenanceSlice.actions;

export default maintenanceSlice.reducer;

