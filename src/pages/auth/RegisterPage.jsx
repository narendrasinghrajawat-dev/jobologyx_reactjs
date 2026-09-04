import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Briefcase, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { registerSchema } from "../../schemas/authSchemas";
import { useAuth } from "../../features/auth/useAuth";
import { ROLES } from "../../utils/constants";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const DASHBOARD_BY_ROLE = {
  [ROLES.JOB_SEEKER]: "/seeker/dashboard",
  [ROLES.RECRUITER]: "/recruiter/dashboard",
};

const ROLE_OPTIONS = [
  { value: ROLES.JOB_SEEKER, label: "Job Seeker", hint: "I'm looking for a job" },
  { value: ROLES.RECRUITER, label: "Recruiter", hint: "I'm hiring talent" },
];

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

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
      toast.success("Account created successfully!");
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create your account</h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Join JobologyX to get started
          </p>
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
                I am a
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
              label="Full Name"
              autoComplete="name"
              placeholder="Jane Doe"
              error={errors.name?.message}
              {...register("name")}
            />

            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 6 characters"
              error={errors.password?.message}
              endAdornment={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              }
              {...register("password")}
            />

            <Input
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            <Button type="submit" className="w-full" loading={isSubmitting}>
              Create Account
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
