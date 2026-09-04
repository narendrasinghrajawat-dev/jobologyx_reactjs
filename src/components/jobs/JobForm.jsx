import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { jobSchema } from "../../schemas/jobSchemas";
import { JOB_TYPES, WORK_MODES, JOB_STATUSES } from "../../utils/constants";
import Input from "../common/Input";
import Select from "../common/Select";
import Textarea from "../common/Textarea";
import Button from "../common/Button";
import Card from "../common/Card";

const JobForm = ({ defaultValues, onSubmit, submitLabel = "Save" }) => {
  const profile = useSelector((state) => state.user.profile);

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
            <p className="text-xs text-slate-400">Posting as</p>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
              {profile.companyName || "Set your company name in Profile"}
            </p>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
          <Input label="Job Title" error={errors.title?.message} {...register("title")} />
          <Textarea label="Description" rows={6} error={errors.description?.message} {...register("description")} />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input label="Location" error={errors.location?.message} {...register("location")} />
            <Input label="Category" placeholder="e.g. Engineering" error={errors.category?.message} {...register("category")} />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Select
              label="Job Type"
              placeholder="Select job type"
              options={JOB_TYPES}
              error={errors.jobType?.message}
              {...register("jobType")}
            />
            <Select
              label="Work Mode"
              placeholder="Select work mode"
              options={WORK_MODES}
              error={errors.workMode?.message}
              {...register("workMode")}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input label="Minimum Salary" type="number" min="0" error={errors.salaryMin?.message} {...register("salaryMin")} />
            <Input label="Maximum Salary" type="number" min="0" error={errors.salaryMax?.message} {...register("salaryMax")} />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input label="Experience" placeholder="e.g. 2-4 years" error={errors.experience?.message} {...register("experience")} />
            <Input label="Application Deadline" type="date" error={errors.applicationDeadline?.message} {...register("applicationDeadline")} />
          </div>

          <Input
            label="Skills"
            placeholder="React, Node.js, MongoDB (comma-separated)"
            error={errors.skillsInput?.message}
            {...register("skillsInput")}
          />

          <Select label="Status" options={JOB_STATUSES} error={errors.status?.message} {...register("status")} />

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
