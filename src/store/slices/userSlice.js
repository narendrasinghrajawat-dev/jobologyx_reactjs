import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as userApi from "../../services/userApi";

export const fetchMyProfile = createAsyncThunk(
  "user/fetchMyProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await userApi.getMyProfile();
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateMyProfile = createAsyncThunk(
  "user/updateMyProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await userApi.updateMyProfile(payload);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const uploadProfileImage = createAsyncThunk(
  "user/uploadProfileImage",
  async (file, { rejectWithValue }) => {
    try {
      const res = await userApi.uploadProfileImage(file);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const uploadResume = createAsyncThunk(
  "user/uploadResume",
  async (file, { rejectWithValue }) => {
    try {
      const res = await userApi.uploadResume(file);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const uploadCompanyLogo = createAsyncThunk(
  "user/uploadCompanyLogo",
  async (file, { rejectWithValue }) => {
    try {
      const res = await userApi.uploadCompanyLogo(file);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  profile: null,
  loading: false,
  uploading: false,
  error: null,
};

const uploadPending = (state) => {
  state.uploading = true;
  state.error = null;
};
const uploadRejected = (state, action) => {
  state.uploading = false;
  state.error = action.payload;
};
const uploadFulfilled = (state, action) => {
  state.uploading = false;
  state.profile = action.payload;
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetProfile(state) {
      state.profile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateMyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateMyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadProfileImage.pending, uploadPending)
      .addCase(uploadProfileImage.rejected, uploadRejected)
      .addCase(uploadProfileImage.fulfilled, uploadFulfilled)
      .addCase(uploadResume.pending, uploadPending)
      .addCase(uploadResume.rejected, uploadRejected)
      .addCase(uploadResume.fulfilled, uploadFulfilled)
      .addCase(uploadCompanyLogo.pending, uploadPending)
      .addCase(uploadCompanyLogo.rejected, uploadRejected)
      .addCase(uploadCompanyLogo.fulfilled, uploadFulfilled);
  },
});

export const { resetProfile } = userSlice.actions;
export default userSlice.reducer;
