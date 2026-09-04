import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as applicationApi from "../../services/applicationApi";

export const applyToJob = createAsyncThunk(
  "applications/applyToJob",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await applicationApi.applyToJob(payload);
      return res.data.application;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchMyApplications = createAsyncThunk(
  "applications/fetchMyApplications",
  async (params, { rejectWithValue }) => {
    try {
      const res = await applicationApi.getMyApplications(params);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchRecruiterApplications = createAsyncThunk(
  "applications/fetchRecruiterApplications",
  async (params, { rejectWithValue }) => {
    try {
      const res = await applicationApi.getRecruiterApplications(params);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchApplicationById = createAsyncThunk(
  "applications/fetchApplicationById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await applicationApi.getApplicationById(id);
      return res.data.application;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  "applications/updateApplicationStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await applicationApi.updateApplicationStatus(id, status);
      return res.data.application;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  applications: [],
  pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
  currentApplication: null,
  loading: false,
  error: null,
};

const applyListFulfilled = (state, action) => {
  state.loading = false;
  state.applications = action.payload.applications;
  state.pagination = action.payload.pagination;
};

const applicationSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    clearCurrentApplication(state) {
      state.currentApplication = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyApplications.fulfilled, applyListFulfilled)
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRecruiterApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecruiterApplications.fulfilled, applyListFulfilled)
      .addCase(fetchRecruiterApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchApplicationById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentApplication = null;
      })
      .addCase(fetchApplicationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentApplication = action.payload;
      })
      .addCase(fetchApplicationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.applications = state.applications.map((app) =>
          app._id === action.payload._id ? action.payload : app
        );
        if (state.currentApplication?._id === action.payload._id) {
          state.currentApplication = action.payload;
        }
      });
  },
});

export const { clearCurrentApplication } = applicationSlice.actions;
export default applicationSlice.reducer;
