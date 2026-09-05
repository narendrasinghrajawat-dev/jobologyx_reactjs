import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Briefcase, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { createLoginSchema } from "../../schemas/authSchemas";
import { useAuth } from "../../features/auth/useAuth";
import { ROLES } from "../../utils/constants";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const DASHBOARD_BY_ROLE = {
  [ROLES.JOB_SEEKER]: "/seeker/dashboard",
  [ROLES.RECRUITER]: "/recruiter/dashboard",
  [ROLES.ADMIN]: "/admin/dashboard",
};

const LoginPage = () => {
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const loginSchema = useMemo(() => createLoginSchema(t), [t, i18n.language]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    setApiError("");
    try {
      const user = await login(data);
      toast.success(t("auth.login.welcomeToast"));
      const redirectTo = location.state?.from?.pathname || DASHBOARD_BY_ROLE[user.role] || "/";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setApiError(err.message);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-600 text-white">
            <Briefcase className="h-6 w-6" />
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t("auth.login.title")}</h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{t("auth.login.subtitle")}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
          {apiError && (
            <div className="mb-5 rounded-lg bg-error-50 px-4 py-3 text-sm text-error-700 dark:bg-error-900/20 dark:text-error-400">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <Input
              label={t("auth.login.emailLabel")}
              type="email"
              autoComplete="email"
              placeholder={t("auth.login.emailPlaceholder")}
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label={t("auth.login.passwordLabel")}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder={t("auth.login.passwordPlaceholder")}
              error={errors.password?.message}
              endAdornment={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  tabIndex={-1}
                  aria-label={showPassword ? t("auth.login.hidePassword") : t("auth.login.showPassword")}
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              }
              {...register("password")}
            />

            <Button type="submit" className="w-full" loading={isSubmitting}>
              {t("auth.login.submit")}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          {t("auth.login.noAccount")}{" "}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
            {t("auth.login.createOne")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
