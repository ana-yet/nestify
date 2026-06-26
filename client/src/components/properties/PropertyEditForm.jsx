import { useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateProperty } from "../../api/properties.api.js";
import {
  AMENITY_OPTIONS,
  PROPERTY_TYPES,
  RENT_TYPES,
} from "../../utils/propertyHelpers.js";
import ImageUploader from "../shared/ImageUploader.jsx";

const PropertyEditForm = ({
  propertyId,
  property,
  backTo,
  backLabel,
  successMessage,
  invalidateKeys = [],
  onSuccessNavigate,
}) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, watch, setValue } = useForm();

  useEffect(() => {
    if (property) {
      reset({
        title: property.title,
        description: property.description,
        propertyType: property.propertyType,
        rent: property.rent,
        rentType: property.rentType,
        location: property.location,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        propertySize: property.propertySize,
        amenities: property.amenities || [],
        extraFeatures: (property.extraFeatures || []).join("\n"),
        images: property.images || [],
      });
    }
  }, [property, reset]);

  const amenities = watch("amenities") || [];
  const images = watch("images") || [];

  const mutation = useMutation({
    mutationFn: (payload) => updateProperty(propertyId, payload),
    onSuccess: () => {
      invalidateKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
      queryClient.invalidateQueries({ queryKey: ["properties", propertyId] });
      toast.success(successMessage);
      onSuccessNavigate();
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Update failed"),
  });

  const onSubmit = (values) => {
    const imgList = (values.images || []).filter(Boolean);

    const extraFeatures = values.extraFeatures
      ? values.extraFeatures
          .split("\n")
          .map((f) => f.trim())
          .filter(Boolean)
      : [];

    mutation.mutate({
      title: values.title,
      description: values.description,
      propertyType: values.propertyType,
      rent: Number(values.rent),
      rentType: values.rentType,
      location: values.location,
      bedrooms: Number(values.bedrooms) || 0,
      bathrooms: Number(values.bathrooms) || 0,
      propertySize: Number(values.propertySize) || 0,
      amenities: values.amenities || [],
      extraFeatures,
      images: imgList,
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href={backTo}
        className="text-sm text-primary hover:underline mb-4 inline-flex items-center gap-1"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        {backLabel}
      </Link>
      <h1 className="text-2xl font-bold mb-6">Update Property</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-surface rounded-xl border border-border-subtle p-6 space-y-4"
      >
        <div>
          <label className="form-label-nestify">Title</label>
          <input
            className="form-input-nestify"
            {...register("title", { required: true })}
          />
        </div>
        <div>
          <label className="form-label-nestify">Description</label>
          <textarea
            rows={4}
            className="textarea textarea-bordered w-full"
            {...register("description", { required: true })}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label-nestify">Type</label>
            <select
              className="select select-bordered w-full"
              {...register("propertyType")}
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label-nestify">Rent</label>
            <input
              type="number"
              className="form-input-nestify"
              {...register("rent")}
            />
          </div>
        </div>
        <div>
          <label className="form-label-nestify">Rent Type</label>
          <select
            className="select select-bordered w-full"
            {...register("rentType")}
          >
            {RENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label-nestify">City</label>
          <input
            className="form-input-nestify"
            {...register("location.city", { required: true })}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            className="form-input-nestify"
            placeholder="State"
            {...register("location.state")}
          />
          <input
            className="form-input-nestify"
            placeholder="Address"
            {...register("location.address")}
          />
          <input
            className="form-input-nestify"
            placeholder="Zip"
            {...register("location.zip")}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="form-label-nestify">Bedrooms</label>
            <input
              type="number"
              className="form-input-nestify"
              {...register("bedrooms")}
            />
          </div>
          <div>
            <label className="form-label-nestify">Bathrooms</label>
            <input
              type="number"
              className="form-input-nestify"
              {...register("bathrooms")}
            />
          </div>
          <div>
            <label className="form-label-nestify">Size (sq ft)</label>
            <input
              type="number"
              className="form-input-nestify"
              {...register("propertySize")}
            />
          </div>
        </div>
        <div>
          <label className="form-label-nestify mb-2 block">Amenities</label>
          <div className="flex flex-wrap gap-2">
            {AMENITY_OPTIONS.map((amenity) => (
              <label
                key={amenity}
                className={`px-3 py-1 rounded-full border text-sm cursor-pointer ${
                  amenities.includes(amenity)
                    ? "bg-primary/10 border-primary"
                    : ""
                }`}
              >
                <input
                  type="checkbox"
                  value={amenity}
                  className="hidden"
                  {...register("amenities")}
                />
                {amenity}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="form-label-nestify">
            Extra Features (one per line)
          </label>
          <textarea
            rows={3}
            className="textarea textarea-bordered w-full"
            placeholder="Private garden&#10;Smart home system"
            {...register("extraFeatures")}
          />
        </div>
        <div>
          <label className="form-label-nestify">Property Images</label>
          <ImageUploader
            images={images}
            onChange={(imgs) => setValue("images", imgs)}
            maxImages={5}
          />
          <p className="text-xs text-text-muted mt-2">
            First image will be the cover photo.
          </p>
        </div>
        <button
          type="submit"
          className="btn btn-primary-nestify w-full"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
};

export default PropertyEditForm;
