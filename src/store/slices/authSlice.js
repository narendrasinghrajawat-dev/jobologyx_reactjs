import { createSlice } from "@reduxjs/toolkit";
import { AUTH_TOKEN_KEY } from "../../utils/constants";

const initialState = {
  user: null,
  token: localStorage.getItem(AUTH_TOKEN_KEY) || null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authRequestStart(state) {
      state.loading = true;
      state.error = null;
    },
    authRequestFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    setCredentials(state, action) {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
    },
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem(AUTH_TOKEN_KEY);
    },
    finishAuthCheck(state) {
      state.loading = false;
    },
  },
});

export const {
  authRequestStart,
  authRequestFailure,
  setCredentials,
  setUser,
  logout,
  finishAuthCheck,
} = authSlice.actions;

export default authSlice.reducer;
