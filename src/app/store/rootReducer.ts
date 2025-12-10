import { combineReducers } from '@reduxjs/toolkit';
import maintenanceReducer from '../../modules/maintenance/slice';
import { apiSlice } from '../../services/api/apiSlice';
import uiReducer from './uiSlice';

const rootReducer = combineReducers({
  ui: uiReducer,
  maintenance: maintenanceReducer,
  // Add the generated reducer as a specific top-level slice
  [apiSlice.reducerPath]: apiSlice.reducer,
});

export default rootReducer;
