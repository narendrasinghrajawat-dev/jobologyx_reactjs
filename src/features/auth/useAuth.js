import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as authApi from "../../services/authApi";
import {
  authRequestStart,
  authRequestFailure,
  setCredentials,
  setUser,
  logout as logoutAction,
  finishAuthCheck,
} from "../../store/slices/authSlice";
import { resetProfile } from "../../store/slices/userSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const login = useCallback(
    async (credentials) => {
      dispatch(authRequestStart());
      try {
        const res = await authApi.login(credentials);
        dispatch(setCredentials(res.data));
        return res.data.user;
      } catch (err) {
        dispatch(authRequestFailure(err.message));
        throw err;
      }
    },
    [dispatch]
  );

  const register = useCallback(
    async (payload) => {
      dispatch(authRequestStart());
      try {
        const res = await authApi.register(payload);
        dispatch(setCredentials(res.data));
        return res.data.user;
      } catch (err) {
        dispatch(authRequestFailure(err.message));
        throw err;
      }
    },
    [dispatch]
  );

  const checkAuth = useCallback(async () => {
    try {
      const res = await authApi.getMe();
      dispatch(setUser(res.data.user));
    } catch {
      dispatch(finishAuthCheck());
    }
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch(logoutAction());
    dispatch(resetProfile());
  }, [dispatch]);

  return { user, token, isAuthenticated, loading, error, login, register, checkAuth, logout };
};
