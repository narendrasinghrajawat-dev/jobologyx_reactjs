import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import jobReducer from "./slices/jobSlice";
import applicationReducer from "./slices/applicationSlice";
import userReducer from "./slices/userSlice";
import masterDataReducer from "./slices/masterDataSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
    applications: applicationReducer,
    user: userReducer,
    masterData: masterDataReducer,
  },
});
