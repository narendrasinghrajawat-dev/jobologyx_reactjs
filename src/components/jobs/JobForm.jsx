import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { createJobSchema } from "../../schemas/jobSchemas";
import {
  useJobTypeMasterOptions,
  useWorkModeMasterOptions,
  useJobStatusMasterOptions,
  useCategoryMasterOptions,
  useExperienceMasterOptions,
} from "../../hooks/useMasterDataOptions";
import Input from "../common/Input";
import Select from "../common/Select";
import Textarea from "../common/Textarea";
import Button from "../common/Button";
import Card from "../common/Card";

const JobForm = ({ defaultValues, onSubmit, submitLabel }) => {
  const { t, i18n } = useTranslation();
  const profile = useSelector((state) => state.user.profile);
  const jobTypeOptions = useJobTypeMasterOptions();
  const workModeOptions = useWorkModeMasterOptions();
  const jobStatusOptions = useJobStatusMasterOptions();
  const categoryOptions = useCategoryMasterOptions();
  const experienceOptions = useExperienceMasterOptions();
  const jobSchema = useMemo(() => createJobSchema(t), [t, i18n.language]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      jobType: "",
      workMode: "",
      salaryMin: "",
      salaryMax: "",
      experience: "",
      skillsInput: "",
      category: "",
      applicationDeadline: "",
      status: "active",
      ...defaultValues,
    },
  });

  const submit = async (data) => {
    const payload = {
      title: data.title,
      description: data.description,
      location: data.location,
      jobType: data.jobType,
      workMode: data.workMode,
      salaryMin: data.salaryMin === "" ? 0 : Number(data.salaryMin),
      salaryMax: data.salaryMax === "" ? 0 : Number(data.salaryMax),
      experience: data.experience,
      category: data.category,
      status: data.status,
      skills: data.skillsInput ? data.skillsInput.split(",").map((s) => s.trim()).filter(Boolean) : [],
      ...(data.applicationDeadline ? { applicationDeadline: data.applicationDeadline } : {}),
    };
    await onSubmit(payload);
  };

  return (
    <div className="space-y-6">
      {profile && (
        <Card className="flex items-center gap-3 p-4">
          {profile.companyLogo ? (
            <img src={profile.companyLogo} alt={profile.companyName} className="h-10 w-10 rounded-lg object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-sm font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
              {profile.companyName?.[0]?.toUpperCase() || "?"}
            </div>
          )}
          <div>
            <p className="text-xs text-slate-400">{t("jobForm.postingAs")}</p>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
              {profile.companyName || t("jobForm.setCompanyName")}
            </p>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
          <Input label={t("jobForm.titleLabel")} error={errors.title?.message} {...register("title")} />
          <Textarea label={t("jobForm.descriptionLabel")} rows={6} error={errors.description?.message} {...register("description")} />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input label={t("jobForm.locationLabel")} error={errors.location?.message} {...register("location")} />
            <Select
              label={t("jobForm.categoryLabel")}
              placeholder={t("jobForm.categoryPlaceholder")}
              options={categoryOptions}
              error={errors.category?.message}
              {...register("category")}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Select
              label={t("jobForm.jobTypeLabel")}
              placeholder={t("jobForm.jobTypePlaceholder")}
              options={jobTypeOptions}
              error={errors.jobType?.message}
              {...register("jobType")}
            />
            <Select
              label={t("jobForm.workModeLabel")}
              placeholder={t("jobForm.workModePlaceholder")}
              options={workModeOptions}
              error={errors.workMode?.message}
              {...register("workMode")}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input label={t("jobForm.minSalaryLabel")} type="number" min="0" error={errors.salaryMin?.message} {...register("salaryMin")} />
            <Input label={t("jobForm.maxSalaryLabel")} type="number" min="0" error={errors.salaryMax?.message} {...register("salaryMax")} />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Select
              label={t("jobForm.experienceLabel")}
              placeholder={t("jobForm.experiencePlaceholder")}
              options={experienceOptions}
              error={errors.experience?.message}
              {...register("experience")}
            />
            <Input label={t("jobForm.deadlineLabel")} type="date" error={errors.applicationDeadline?.message} {...register("applicationDeadline")} />
          </div>

          <Input
            label={t("jobForm.skillsLabel")}
            placeholder={t("jobForm.skillsPlaceholder")}
            error={errors.skillsInput?.message}
            {...register("skillsInput")}
          />

          <Select label={t("jobForm.statusLabel")} options={jobStatusOptions} error={errors.status?.message} {...register("status")} />

          <div className="flex justify-end pt-2">
            <Button type="submit" loading={isSubmitting}>
              {submitLabel}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default JobForm;
