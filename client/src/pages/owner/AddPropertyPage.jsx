import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createProperty } from '../../api/properties.api.js';
import { AMENITY_OPTIONS, PROPERTY_TYPES, RENT_TYPES } from '../../utils/propertyHelpers.js';

const STEPS = ['Basic Info', 'Location & Details', 'Media'];

const AddPropertyPage = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      propertyType: 'apartment',
      rent: '',
      rentType: 'monthly',
      location: { address: '', city: '', state: '', zip: '', country: 'USA' },
      bedrooms: 0,
      bathrooms: 0,
      propertySize: 0,
      amenities: [],
      extraFeatures: [],
      imageUrls: '',
    },
  });

  const amenities = watch('amenities') || [];

  const mutation = useMutation({
    mutationFn: createProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties', 'owner'] });
      toast.success('Property submitted for admin approval');
      navigate('/dashboard/owner/properties');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create property');
    },
  });

  const stepFields = [
    ['title', 'description', 'propertyType', 'rent', 'rentType'],
    ['location.city', 'bedrooms', 'bathrooms'],
    [],
  ];

  const nextStep = async () => {
    const valid = await trigger(stepFields[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const onSubmit = (values) => {
    const images = values.imageUrls
      .split('\n')
      .map((u) => u.trim())
      .filter(Boolean);

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
      extraFeatures: values.extraFeatures || [],
      images,
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-main">Add New Listing</h1>
        <p className="text-text-muted mt-1">Submit a property for admin approval</p>
      </div>

      <div className="bg-surface rounded-xl border border-border-subtle overflow-hidden">
        <div className="border-b border-border-subtle px-6 py-4">
          <div className="flex justify-between">
            {STEPS.map((label, i) => (
              <div key={label} className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    i <= step ? 'bg-primary text-white' : 'bg-surface-container-low text-text-muted'
                  }`}
                >
                  {i + 1}
                </div>
                <span className="text-xs mt-1 hidden sm:block">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
          {step === 0 && (
            <>
              <div>
                <label className="form-label-nestify">Property Title</label>
                <input
                  className={`form-input-nestify ${errors.title ? 'input-error' : ''}`}
                  {...register('title', { required: 'Title is required' })}
                  placeholder="Luxury Downtown Loft"
                />
                {errors.title && <p className="text-error text-sm mt-1">{errors.title.message}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label-nestify">Property Type</label>
                  <select className="select select-bordered w-full" {...register('propertyType')}>
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label-nestify">Rent ($)</label>
                  <input
                    type="number"
                    min="0"
                    className={`form-input-nestify ${errors.rent ? 'input-error' : ''}`}
                    {...register('rent', { required: 'Rent is required', min: 0 })}
                  />
                </div>
              </div>
              <div>
                <label className="form-label-nestify">Rent Type</label>
                <select className="select select-bordered w-full" {...register('rentType')}>
                  {RENT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label-nestify">Description</label>
                <textarea
                  rows={5}
                  className={`textarea textarea-bordered w-full ${errors.description ? 'textarea-error' : ''}`}
                  {...register('description', { required: 'Description is required' })}
                />
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div>
                <label className="form-label-nestify">Street Address</label>
                <input className="form-input-nestify" {...register('location.address')} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="col-span-2">
                  <label className="form-label-nestify">City</label>
                  <input
                    className={`form-input-nestify ${errors.location?.city ? 'input-error' : ''}`}
                    {...register('location.city', { required: 'City is required' })}
                  />
                </div>
                <div>
                  <label className="form-label-nestify">State</label>
                  <input className="form-input-nestify" {...register('location.state')} />
                </div>
                <div>
                  <label className="form-label-nestify">Zip</label>
                  <input className="form-input-nestify" {...register('location.zip')} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="form-label-nestify">Bedrooms</label>
                  <input type="number" min="0" className="form-input-nestify" {...register('bedrooms')} />
                </div>
                <div>
                  <label className="form-label-nestify">Bathrooms</label>
                  <input type="number" min="0" step="0.5" className="form-input-nestify" {...register('bathrooms')} />
                </div>
                <div>
                  <label className="form-label-nestify">Sq Ft</label>
                  <input type="number" min="0" className="form-input-nestify" {...register('propertySize')} />
                </div>
              </div>
              <div>
                <label className="form-label-nestify mb-3 block">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {AMENITY_OPTIONS.map((amenity) => (
                    <label
                      key={amenity}
                      className={`px-3 py-1.5 rounded-full border text-sm cursor-pointer transition-colors ${
                        amenities.includes(amenity)
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'border-border-subtle'
                      }`}
                    >
                      <input
                        type="checkbox"
                        value={amenity}
                        className="hidden"
                        {...register('amenities')}
                      />
                      {amenity}
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <div>
              <label className="form-label-nestify">Image URLs (one per line)</label>
              <textarea
                rows={6}
                className="textarea textarea-bordered w-full font-mono text-sm"
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                {...register('imageUrls')}
              />
              <p className="text-xs text-text-muted mt-2">Paste direct image links (ImgBB or other hosts).</p>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-border-subtle">
            <button
              type="button"
              className="btn btn-ghost"
              disabled={step === 0}
              onClick={() => setStep((s) => s - 1)}
            >
              Back
            </button>
            {step < STEPS.length - 1 ? (
              <button type="button" className="btn btn-primary-nestify" onClick={nextStep}>
                Next Step
              </button>
            ) : (
              <button type="submit" className="btn btn-primary-nestify" disabled={mutation.isPending}>
                {mutation.isPending ? <span className="loading loading-spinner loading-sm" /> : 'Publish Listing'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyPage;
