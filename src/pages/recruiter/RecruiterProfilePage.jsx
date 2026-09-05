import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { Building2 } from "lucide-react";
import {
  fetchMyProfile,
  updateMyProfile,
  uploadProfileImage,
  uploadCompanyLogo,
} from "../../store/slices/userSlice";
import { setUser } from "../../store/slices/authSlice";
import { createRecruiterProfileSchema } from "../../schemas/profileSchemas";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Textarea from "../../components/common/Textarea";
import Button from "../../components/common/Button";
import PageLoader from "../../components/common/PageLoader";
import ImageUploadField from "../../components/profile/ImageUploadField";

const RecruiterProfilePage = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { profile, loading, uploading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchMyProfile());
  }, [dispatch]);

  const recruiterProfileSchema = useMemo(() => createRecruiterProfileSchema(t), [t, i18n.language]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(recruiterProfileSchema) });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
        location: profile.location || "",
        companyName: profile.companyName || "",
        companyWebsite: profile.companyWebsite || "",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data) => {
    try {
      const updated = await dispatch(updateMyProfile(data)).unwrap();
      dispatch(setUser(updated));
      toast.success(t("recruiter.profile.updatedToast"));
    } catch (err) {
      toast.error(err || t("recruiter.profile.updateErrorToast"));
    }
  };

  const handleImageUpload = async (file, errorMsg) => {
    if (errorMsg) return toast.error(errorMsg);
    try {
      const updated = await dispatch(uploadProfileImage(file)).unwrap();
      dispatch(setUser(updated));
      toast.success(t("recruiter.profile.imageUpdatedToast"));
    } catch (err) {
      toast.error(err || t("recruiter.profile.imageErrorToast"));
    }
  };

  const handleLogoUpload = async (file, errorMsg) => {
    if (errorMsg) return toast.error(errorMsg);
    try {
      const updated = await dispatch(uploadCompanyLogo(file)).unwrap();
      dispatch(setUser(updated));
      toast.success(t("recruiter.profile.logoUpdatedToast"));
    } catch (err) {
      toast.error(err || t("recruiter.profile.logoErrorToast"));
    }
  };

  if (loading && !profile) return <PageLoader />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t("recruiter.profile.title")}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t("recruiter.profile.subtitle")}</p>
      </div>

      <Card className="p-6">
        <ImageUploadField
          label={t("recruiter.profile.profilePhoto")}
          imageUrl={profile?.profileImage}
          name={profile?.name}
          uploading={uploading}
          onUpload={handleImageUpload}
        />
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
          <Building2 className="h-4.5 w-4.5" /> {t("recruiter.profile.companyLogo")}
        </h2>
        <ImageUploadField
          label={t("recruiter.profile.companyLogo")}
          imageUrl={profile?.companyLogo}
          name={profile?.companyName || "Company"}
          uploading={uploading}
          onUpload={handleLogoUpload}
        />
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">{t("recruiter.profile.detailsTitle")}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input label={t("recruiter.profile.fullName")} error={errors.name?.message} {...register("name")} />
            <Input label={t("recruiter.profile.email")} value={profile?.email || ""} disabled readOnly containerClassName="opacity-70" />
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input label={t("recruiter.profile.phone")} error={errors.phone?.message} {...register("phone")} />
            <Input
              label={t("recruiter.profile.location")}
              placeholder={t("recruiter.profile.locationPlaceholder")}
              error={errors.location?.message}
              {...register("location")}
            />
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input label={t("recruiter.profile.companyName")} error={errors.companyName?.message} {...register("companyName")} />
            <Input
              label={t("recruiter.profile.companyWebsite")}
              placeholder={t("recruiter.profile.companyWebsitePlaceholder")}
              error={errors.companyWebsite?.message}
              {...register("companyWebsite")}
            />
          </div>
          <Textarea label={t("recruiter.profile.bio")} rows={4} error={errors.bio?.message} {...register("bio")} />
          <div className="flex justify-end">
            <Button type="submit" loading={isSubmitting}>
              {t("recruiter.profile.update")}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RecruiterProfilePage;
