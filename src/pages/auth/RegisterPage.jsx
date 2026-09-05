import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Briefcase, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { createRegisterSchema } from "../../schemas/authSchemas";
import { useAuth } from "../../features/auth/useAuth";
import { useRoleMasterOptions } from "../../hooks/useMasterDataOptions";
import { ROLES } from "../../utils/constants";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const DASHBOARD_BY_ROLE = {
  [ROLES.JOB_SEEKER]: "/seeker/dashboard",
  [ROLES.RECRUITER]: "/recruiter/dashboard",
};

const RegisterPage = () => {
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const registerSchema = useMemo(() => createRegisterSchema(t), [t, i18n.language]);

  // Registration only ever offers job_seeker/recruiter — admin is never a
  // public option. Options render master-data's `label`, but the value
  // submitted is always the exact `name` string the backend validates.
  const roleMasterOptions = useRoleMasterOptions();
  const ROLE_OPTIONS = useMemo(() => {
    const hints = {
      [ROLES.JOB_SEEKER]: t("auth.register.jobSeekerHint"),
      [ROLES.RECRUITER]: t("auth.register.recruiterHint"),
    };
    const fromMasterData = roleMasterOptions
      .filter((r) => r.value === ROLES.JOB_SEEKER || r.value === ROLES.RECRUITER)
      .map((r) => ({ value: r.value, label: r.label, hint: hints[r.value] }));

    if (fromMasterData.length > 0) return fromMasterData;

    // Master data hasn't loaded yet (or failed) — fall back so the page
    // still works.
    return [
      { value: ROLES.JOB_SEEKER, label: t("auth.register.jobSeeker"), hint: t("auth.register.jobSeekerHint") },
      { value: ROLES.RECRUITER, label: t("auth.register.recruiter"), hint: t("auth.register.recruiterHint") },
    ];
  }, [roleMasterOptions, t]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: ROLES.JOB_SEEKER },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data) => {
    setApiError("");
    try {
      const { confirmPassword: _confirmPassword, ...payload } = data;
      const user = await registerUser(payload);
      toast.success(t("auth.register.successToast"));
      navigate(DASHBOARD_BY_ROLE[user.role] || "/", { replace: true });
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t("auth.register.title")}</h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{t("auth.register.subtitle")}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
          {apiError && (
            <div className="mb-5 rounded-lg bg-error-50 px-4 py-3 text-sm text-error-700 dark:bg-error-900/20 dark:text-error-400">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div>
              <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("auth.register.iAmA")}
              </span>
              <div className="grid grid-cols-2 gap-3">
                {ROLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setValue("role", opt.value, { shouldValidate: true })}
                    className={`rounded-lg border px-3 py-2.5 text-left transition-colors ${
                      selectedRole === opt.value
                        ? "border-primary-600 bg-primary-50 dark:bg-primary-900/30"
                        : "border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {opt.label}
                    </span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">{opt.hint}</span>
                  </button>
                ))}
              </div>
              {errors.role && (
                <p className="mt-1.5 text-sm text-error-600 dark:text-error-500">{errors.role.message}</p>
              )}
            </div>

            <Input
              label={t("auth.register.fullNameLabel")}
              autoComplete="name"
              placeholder={t("auth.register.namePlaceholder")}
              error={errors.name?.message}
              {...register("name")}
            />

            <Input
              label={t("auth.register.emailLabel")}
              type="email"
              autoComplete="email"
              placeholder={t("auth.register.emailPlaceholder")}
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label={t("auth.register.passwordLabel")}
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder={t("auth.register.passwordPlaceholder")}
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

            <Input
              label={t("auth.register.confirmPasswordLabel")}
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder={t("auth.register.confirmPasswordPlaceholder")}
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            <Button type="submit" className="w-full" loading={isSubmitting}>
              {t("auth.register.submit")}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          {t("auth.register.haveAccount")}{" "}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
            {t("auth.register.logIn")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
