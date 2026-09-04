import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as jobApi from "../../services/jobApi";

export const fetchJobs = createAsyncThunk("jobs/fetchJobs", async (params, { rejectWithValue }) => {
  try {
    const res = await jobApi.getJobs(params);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchJobById = createAsyncThunk("jobs/fetchJobById", async (id, { rejectWithValue }) => {
  try {
    const res = await jobApi.getJobById(id);
    return res.data.job;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createJob = createAsyncThunk("jobs/createJob", async (payload, { rejectWithValue }) => {
  try {
    const res = await jobApi.createJob(payload);
    return res.data.job;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await jobApi.updateJob(id, payload);
      return res.data.job;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteJob = createAsyncThunk("jobs/deleteJob", async (id, { rejectWithValue }) => {
  try {
    await jobApi.deleteJob(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const initialState = {
  jobs: [],
  pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
  currentJob: null,
  loading: false,
  error: null,
};

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    clearCurrentJob(state) {
      state.currentJob = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentJob = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.jobs.unshift(action.payload);
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.currentJob = action.payload;
        state.jobs = state.jobs.map((job) =>
          job._id === action.payload._id ? action.payload : job
        );
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter((job) => job._id !== action.payload);
      });
  },
});

export const { clearCurrentJob } = jobSlice.actions;
export default jobSlice.reducer;
