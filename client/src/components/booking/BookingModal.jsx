import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createBooking } from '../../api/bookings.api.js';
import useAuth from '../../hooks/useAuth.js';

const BookingModal = ({ property, isOpen, onClose }) => {
  const { user } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      moveInDate: '',
      contactNumber: user?.phone || '',
      tenantName: user?.name || '',
      tenantEmail: user?.email || '',
      additionalNotes: '',
    },
  });

  const mutation = useMutation({
    mutationFn: createBooking,
    onSuccess: (booking) => {
      toast.success('Booking created! Proceed to payment.');
      onClose();
      router.push(`/payment/${booking._id}`);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create booking');
    },
  });

  const onSubmit = (values) => {
    mutation.mutate({
      propertyId: property._id,
      moveInDate: values.moveInDate,
      contactNumber: values.contactNumber,
      tenantInfo: {
        name: values.tenantName,
        email: values.tenantEmail,
      },
      additionalNotes: values.additionalNotes,
    });
  };

  if (!isOpen) return null;

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box max-w-lg">
        <h3 className="font-bold text-xl mb-1">Book Property</h3>
        <p className="text-sm text-text-muted mb-6">{property.title}</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="form-label-nestify">Move-in Date</label>
            <input
              type="date"
              className={`form-input-nestify ${errors.moveInDate ? 'input-error' : ''}`}
              min={new Date().toISOString().split('T')[0]}
              {...register('moveInDate', { required: 'Move-in date is required' })}
            />
            {errors.moveInDate && (
              <p className="text-error text-sm mt-1">{errors.moveInDate.message}</p>
            )}
          </div>

          <div>
            <label className="form-label-nestify">Contact Number</label>
            <input
              type="tel"
              className={`form-input-nestify ${errors.contactNumber ? 'input-error' : ''}`}
              placeholder="+1 (555) 000-0000"
              {...register('contactNumber', { required: 'Contact number is required' })}
            />
            {errors.contactNumber && (
              <p className="text-error text-sm mt-1">{errors.contactNumber.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label-nestify">Your Name</label>
              <input
                className="form-input-nestify"
                {...register('tenantName', { required: 'Name is required' })}
              />
            </div>
            <div>
              <label className="form-label-nestify">Your Email</label>
              <input
                type="email"
                className="form-input-nestify"
                readOnly
                {...register('tenantEmail')}
              />
            </div>
          </div>

          <div>
            <label className="form-label-nestify">Additional Notes (optional)</label>
            <textarea
              rows={3}
              className="textarea textarea-bordered w-full"
              placeholder="Any special requests or questions..."
              {...register('additionalNotes')}
            />
          </div>

          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary-nestify" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                'Confirm Booking'
              )}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default BookingModal;
