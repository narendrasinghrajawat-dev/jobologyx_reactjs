import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import {
  fetchMyProfile,
  updateMyProfile,
  uploadProfileImage,
  uploadResume,
} from "../../store/slices/userSlice";
import { setUser } from "../../store/slices/authSlice";
import { createSeekerProfileSchema } from "../../schemas/profileSchemas";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Textarea from "../../components/common/Textarea";
import Button from "../../components/common/Button";
import PageLoader from "../../components/common/PageLoader";
import ImageUploadField from "../../components/profile/ImageUploadField";
import ResumeUploadField from "../../components/profile/ResumeUploadField";

const SeekerProfilePage = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { profile, loading, uploading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchMyProfile());
  }, [dispatch]);

  const seekerProfileSchema = useMemo(() => createSeekerProfileSchema(t), [t, i18n.language]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(seekerProfileSchema) });

  const skillsInput = watch("skillsInput");
  const skills = skillsInput
    ? skillsInput.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
        location: profile.location || "",
        skillsInput: (profile.skills || []).join(", "),
      });
    }
  }, [profile, reset]);

  const removeSkill = (skill) => {
    const next = skills.filter((s) => s !== skill);
    setValue("skillsInput", next.join(", "));
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        phone: data.phone,
        bio: data.bio,
        location: data.location,
        skills: data.skillsInput
          ? data.skillsInput.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };
      const updated = await dispatch(updateMyProfile(payload)).unwrap();
      dispatch(setUser(updated));
      toast.success(t("seeker.profile.updatedToast"));
    } catch (err) {
      toast.error(err || t("seeker.profile.updateErrorToast"));
    }
  };

  const handleImageUpload = async (file, errorMsg) => {
    if (errorMsg) return toast.error(errorMsg);
    try {
      const updated = await dispatch(uploadProfileImage(file)).unwrap();
      dispatch(setUser(updated));
      toast.success(t("seeker.profile.imageUpdatedToast"));
    } catch (err) {
      toast.error(err || t("seeker.profile.imageErrorToast"));
    }
  };

  const handleResumeUpload = async (file, errorMsg) => {
    if (errorMsg) return toast.error(errorMsg);
    try {
      const updated = await dispatch(uploadResume(file)).unwrap();
      dispatch(setUser(updated));
      toast.success(t("seeker.profile.resumeUpdatedToast"));
    } catch (err) {
      toast.error(err || t("seeker.profile.resumeErrorToast"));
    }
  };

  if (loading && !profile) return <PageLoader />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t("seeker.profile.title")}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t("seeker.profile.subtitle")}</p>
      </div>

      <Card className="p-6">
        <ImageUploadField
          label={t("seeker.profile.profilePhoto")}
          imageUrl={profile?.profileImage}
          name={profile?.name}
          uploading={uploading}
          onUpload={handleImageUpload}
        />
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">{t("seeker.profile.resumeTitle")}</h2>
        <ResumeUploadField
          resumeUrl={profile?.resumeUrl}
          resumeFileName={profile?.resumeFileName}
          uploading={uploading}
          onUpload={handleResumeUpload}
        />
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">{t("seeker.profile.detailsTitle")}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input label={t("seeker.profile.fullName")} error={errors.name?.message} {...register("name")} />
            <Input label={t("seeker.profile.email")} value={profile?.email || ""} disabled readOnly containerClassName="opacity-70" />
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input label={t("seeker.profile.phone")} error={errors.phone?.message} {...register("phone")} />
            <Input
              label={t("seeker.profile.location")}
              placeholder={t("seeker.profile.locationPlaceholder")}
              error={errors.location?.message}
              {...register("location")}
            />
          </div>
          <Textarea label={t("seeker.profile.bio")} rows={4} error={errors.bio?.message} {...register("bio")} />
          <div>
            <Input
              label={t("seeker.profile.skills")}
              placeholder={t("seeker.profile.skillsPlaceholder")}
              error={errors.skillsInput?.message}
              {...register("skillsInput")}
            />
            {skills.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                  >
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} aria-label={t("seeker.profile.removeSkill", { skill })}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button type="submit" loading={isSubmitting}>
              {t("seeker.profile.update")}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SeekerProfilePage;
