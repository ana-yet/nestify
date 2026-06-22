import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateProfile } from "../../api/users.api.js";
import useAuth from "../../hooks/useAuth.js";
import { uploadToImgbb } from "../../utils/imgbbUpload.js";

const ProfileForm = () => {
  const { user, refreshUser } = useAuth();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      photo: "",
      phone: "",
    },
  });

  const currentPhoto = watch("photo");

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        photo: user.photo || "",
        phone: user.phone || "",
      });
      setPhotoPreview(user.photo || "");
    }
  }, [user, reset]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }

    setUploading(true);
    try {
      const url = await uploadToImgbb(file);
      setValue("photo", url, { shouldDirty: true });
      setPhotoPreview(url);
      toast.success("Photo uploaded");
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: async (updatedUser) => {
      await refreshUser(updatedUser);
      toast.success("Profile updated successfully");
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Update failed"),
  });

  const onSubmit = (values) => {
    mutation.mutate({
      name: values.name,
      photo: values.photo,
      phone: values.phone,
    });
  };

  if (!user) return null;

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-main">Profile</h1>
        <p className="text-text-muted mt-1">Manage your account information</p>
      </div>

      <div className="bg-surface rounded-xl border border-border-subtle p-6 shadow-ambient">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border-subtle">
          {photoPreview || user.photo ? (
            <img
              src={photoPreview || user.photo}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-2xl">
                person
              </span>
            </div>
          )}
          <div>
            <p className="font-semibold text-lg">{user.name}</p>
            <p className="text-sm text-text-muted capitalize">{user.role}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="form-label-nestify">Full Name</label>
            <input
              className={`form-input-nestify ${errors.name ? "input-error" : ""}`}
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-error text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="form-label-nestify">Email</label>
            <input
              className="form-input-nestify bg-surface-container-low"
              readOnly
              {...register("email")}
            />
            <p className="text-xs text-text-muted mt-1">
              Email cannot be changed
            </p>
          </div>

          <div>
            <label className="form-label-nestify">Profile Photo</label>
            <div className="flex items-center gap-4">
              <div className="relative group">
                {photoPreview || currentPhoto ? (
                  <img
                    src={photoPreview || currentPhoto}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-2 border-border-subtle"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-surface-container-low border-2 border-dashed border-border-subtle flex items-center justify-center">
                    <span className="material-symbols-outlined text-text-muted">
                      person
                    </span>
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                    <span className="loading loading-spinner loading-sm text-white" />
                  </div>
                )}
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? "Uploading…" : "Change Photo"}
                </button>
                <p className="text-xs text-text-muted mt-1">
                  JPG, PNG or WebP — max 5 MB
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="form-label-nestify">Phone Number</label>
            <input
              type="tel"
              className="form-input-nestify"
              placeholder="+1 (555) 000-0000"
              {...register("phone")}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary-nestify w-full"
            disabled={!isDirty || mutation.isPending}
          >
            {mutation.isPending ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
