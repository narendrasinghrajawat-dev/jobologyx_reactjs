import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as masterDataApi from "../../services/masterDataApi";

// Fetched once at app startup and cached here so every form reads the same
// backend-driven option lists instead of hardcoding them.
export const fetchMasterData = createAsyncThunk(
  "masterData/fetchMasterData",
  async (_, { rejectWithValue }) => {
    try {
      const res = await masterDataApi.getMasterData();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  roles: [],
  jobTypes: [],
  workModes: [],
  jobStatuses: [],
  applicationStatuses: [],
  categories: [],
  experienceLevels: [],
  loading: false,
  loaded: false,
  error: null,
};

const masterDataSlice = createSlice({
  name: "masterData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMasterData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMasterData.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.roles = action.payload.roles || [];
        state.jobTypes = action.payload.jobTypes || [];
        state.workModes = action.payload.workModes || [];
        state.jobStatuses = action.payload.jobStatuses || [];
        state.applicationStatuses = action.payload.applicationStatuses || [];
        state.categories = action.payload.categories || [];
        state.experienceLevels = action.payload.experienceLevels || [];
      })
      .addCase(fetchMasterData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default masterDataSlice.reducer;
