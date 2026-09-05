import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import { useAuth } from "./features/auth/useAuth";
import { finishAuthCheck } from "./store/slices/authSlice";
import { fetchMasterData } from "./store/slices/masterDataSlice";
import { AUTH_TOKEN_KEY } from "./utils/constants";

function App() {
  const dispatch = useDispatch();
  const { checkAuth } = useAuth();

  useEffect(() => {
    if (localStorage.getItem(AUTH_TOKEN_KEY)) {
      checkAuth();
    } else {
      dispatch(finishAuthCheck());
    }
    dispatch(fetchMasterData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          className: "!bg-white !text-slate-800 dark:!bg-slate-800 dark:!text-slate-100",
          duration: 3500,
        }}
      />
    </>
  );
}

export default App;
