import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fetchPropertyReviews } from '../../api/reviews.api.js';
import useAuth from '../../hooks/useAuth.js';
import LoadingSpinner from '../shared/LoadingSpinner.jsx';
import EmptyState from '../shared/EmptyState.jsx';
import StarRating from './StarRating.jsx';
import ReviewForm from './ReviewForm.jsx';

const ReviewsSection = ({ propertyId, averageRating, reviewCount }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['reviews', propertyId],
    queryFn: () => fetchPropertyReviews(propertyId),
    enabled: Boolean(propertyId),
  });

  const reviews = data?.reviews || [];
  const userReview = data?.userReview;
  const canReview = data?.canReview && user?.role === 'tenant';
  const showForm = (canReview && !userReview) || (userReview && isEditing);

  return (
    <div className="border-t border-border-subtle pt-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold">Guest Reviews</h2>
          <div className="flex items-center gap-2 mt-1 text-sm text-text-muted">
            <StarRating value={Math.round(averageRating || 0)} readOnly size="sm" />
            <span>
              {averageRating ? averageRating.toFixed(1) : '0.0'} · {reviewCount || 0} review
              {(reviewCount || 0) !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        {userReview && !isEditing && user?.role === 'tenant' && (
          <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsEditing(true)}>
            Edit Review
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-8">
          <ReviewForm
            propertyId={propertyId}
            existingReview={isEditing ? userReview : null}
            onCancelEdit={() => setIsEditing(false)}
          />
        </div>
      )}

      {isLoading ? (
        <LoadingSpinner message="Loading reviews..." />
      ) : isError ? (
        <EmptyState
          icon="error_outline"
          title="Failed to load reviews"
          action={
            <button type="button" className="btn btn-primary-nestify btn-sm" onClick={() => refetch()}>
              Retry
            </button>
          }
        />
      ) : reviews.length === 0 ? (
        <EmptyState
          icon="rate_review"
          title="No reviews yet"
          description={
            canReview
              ? 'Be the first to share your experience after your stay.'
              : 'Reviews from verified tenants will appear here.'
          }
        />
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <article
              key={review._id}
              className="pb-6 border-b border-border-subtle last:border-0 last:pb-0"
            >
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div>
                  <p className="font-medium text-text-main">{review.userSnapshot?.name}</p>
                  <p className="text-xs text-text-muted">{review.userSnapshot?.email}</p>
                </div>
                <time className="text-xs text-text-muted">
                  {format(new Date(review.createdAt), 'MMM d, yyyy')}
                </time>
              </div>
              <StarRating value={review.rating} readOnly size="sm" />
              <p className="text-text-muted mt-3 text-sm leading-relaxed">{review.comment}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
