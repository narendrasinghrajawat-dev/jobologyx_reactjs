import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import {
  fetchMyProfile,
  updateMyProfile,
  uploadProfileImage,
  uploadResume,
} from "../../store/slices/userSlice";
import { setUser } from "../../store/slices/authSlice";
import { seekerProfileSchema } from "../../schemas/profileSchemas";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Textarea from "../../components/common/Textarea";
import Button from "../../components/common/Button";
import PageLoader from "../../components/common/PageLoader";
import ImageUploadField from "../../components/profile/ImageUploadField";
import ResumeUploadField from "../../components/profile/ResumeUploadField";

const SeekerProfilePage = () => {
  const dispatch = useDispatch();
  const { profile, loading, uploading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchMyProfile());
  }, [dispatch]);

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
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err || "Failed to update profile");
    }
  };

  const handleImageUpload = async (file, errorMsg) => {
    if (errorMsg) return toast.error(errorMsg);
    try {
      const updated = await dispatch(uploadProfileImage(file)).unwrap();
      dispatch(setUser(updated));
      toast.success("Profile image updated");
    } catch (err) {
      toast.error(err || "Failed to upload image");
    }
  };

  const handleResumeUpload = async (file, errorMsg) => {
    if (errorMsg) return toast.error(errorMsg);
    try {
      const updated = await dispatch(uploadResume(file)).unwrap();
      dispatch(setUser(updated));
      toast.success("Resume uploaded");
    } catch (err) {
      toast.error(err || "Failed to upload resume");
    }
  };

  if (loading && !profile) return <PageLoader />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Profile</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Keep your profile up to date to stand out to recruiters.
        </p>
      </div>

      <Card className="p-6">
        <ImageUploadField
          label="Profile Photo"
          imageUrl={profile?.profileImage}
          name={profile?.name}
          uploading={uploading}
          onUpload={handleImageUpload}
        />
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">Resume</h2>
        <ResumeUploadField resumeUrl={profile?.resumeUrl} uploading={uploading} onUpload={handleResumeUpload} />
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">Profile Details</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input label="Full Name" error={errors.name?.message} {...register("name")} />
            <Input label="Email" value={profile?.email || ""} disabled readOnly containerClassName="opacity-70" />
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input label="Phone" error={errors.phone?.message} {...register("phone")} />
            <Input label="Location" placeholder="City, Country" error={errors.location?.message} {...register("location")} />
          </div>
          <Textarea label="Bio" rows={4} error={errors.bio?.message} {...register("bio")} />
          <div>
            <Input
              label="Skills"
              placeholder="React, Node.js, MongoDB (comma-separated)"
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
                    <button type="button" onClick={() => removeSkill(skill)} aria-label={`Remove ${skill}`}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button type="submit" loading={isSubmitting}>
              Update Profile
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SeekerProfilePage;
