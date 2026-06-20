import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createReview, updateReview } from '../../api/reviews.api.js';
import StarRating from './StarRating.jsx';

const ReviewForm = ({ propertyId, existingReview, onCancelEdit }) => {
  const queryClient = useQueryClient();
  const isEditing = Boolean(existingReview);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rating: existingReview?.rating || 0,
      comment: existingReview?.comment || '',
    },
  });

  const rating = watch('rating');

  useEffect(() => {
    reset({
      rating: existingReview?.rating || 0,
      comment: existingReview?.comment || '',
    });
  }, [existingReview, reset]);

  const mutation = useMutation({
    mutationFn: (values) =>
      isEditing
        ? updateReview(existingReview._id, values)
        : createReview({ propertyId, ...values }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', propertyId] });
      queryClient.invalidateQueries({ queryKey: ['properties', propertyId] });
      toast.success(isEditing ? 'Review updated' : 'Review submitted');
      if (!isEditing) {
        reset({ rating: 0, comment: '' });
      }
      onCancelEdit?.();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to save review');
    },
  });

  const onSubmit = (values) => {
    if (values.rating < 1) {
      toast.error('Please select a rating');
      return;
    }
    mutation.mutate(values);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-surface-container-low rounded-xl p-6 border border-border-subtle space-y-4"
    >
      <h3 className="font-semibold text-lg">
        {isEditing ? 'Edit Your Review' : 'Write a Review'}
      </h3>

      <div>
        <label className="form-label-nestify">Rating</label>
        <StarRating value={rating} onChange={(v) => setValue('rating', v, { shouldValidate: true })} />
        {errors.rating && <p className="text-error text-xs mt-1">{errors.rating.message}</p>}
      </div>

      <div>
        <label className="form-label-nestify" htmlFor="review-comment">
          Comment
        </label>
        <textarea
          id="review-comment"
          rows={4}
          className="textarea textarea-bordered w-full"
          placeholder="Share your experience with this property..."
          {...register('comment', { required: 'Comment is required' })}
        />
        {errors.comment && <p className="text-error text-xs mt-1">{errors.comment.message}</p>}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="btn btn-primary-nestify"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <span className="loading loading-spinner loading-sm" />
          ) : isEditing ? (
            'Update Review'
          ) : (
            'Submit Review'
          )}
        </button>
        {isEditing && onCancelEdit && (
          <button type="button" className="btn btn-ghost" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;
