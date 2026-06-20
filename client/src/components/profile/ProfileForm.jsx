import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateProfile } from '../../api/users.api.js';
import useAuth from '../../hooks/useAuth.js';

const ProfileForm = () => {
  const { user, refreshUser } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      photo: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        photo: user.photo || '',
        phone: user.phone || '',
      });
    }
  }, [user, reset]);

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: async (updatedUser) => {
      await refreshUser(updatedUser);
      toast.success('Profile updated successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Update failed'),
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
          {user.photo ? (
            <img src={user.photo} alt={user.name} className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-2xl">person</span>
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
              className={`form-input-nestify ${errors.name ? 'input-error' : ''}`}
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <p className="text-error text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="form-label-nestify">Email</label>
            <input className="form-input-nestify bg-surface-container-low" readOnly {...register('email')} />
            <p className="text-xs text-text-muted mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="form-label-nestify">Photo URL</label>
            <input
              type="url"
              className="form-input-nestify"
              placeholder="https://example.com/photo.jpg"
              {...register('photo')}
            />
          </div>

          <div>
            <label className="form-label-nestify">Phone Number</label>
            <input
              type="tel"
              className="form-input-nestify"
              placeholder="+1 (555) 000-0000"
              {...register('phone')}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary-nestify w-full"
            disabled={!isDirty || mutation.isPending}
          >
            {mutation.isPending ? <span className="loading loading-spinner loading-sm" /> : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
