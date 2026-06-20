import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fetchFeaturedReviews } from '../../api/reviews.api.js';
import LoadingSpinner from '../shared/LoadingSpinner.jsx';
import StarRating from '../reviews/StarRating.jsx';

const CustomerReviews = () => {
  const { data: reviews = [], isLoading, isError } = useQuery({
    queryKey: ['reviews', 'featured'],
    queryFn: fetchFeaturedReviews,
  });

  return (
    <section className="py-20 px-4 md:px-margin-desktop bg-surface">
      <div className="max-w-container-max mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-4">What Our Tenants Say</h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            Real reviews from verified tenants who found their perfect home on Nestify.
          </p>
        </motion.div>

        {isLoading ? (
          <LoadingSpinner message="Loading reviews..." />
        ) : isError ? (
          <p className="text-center text-text-muted">Unable to load reviews at this time.</p>
        ) : reviews.length === 0 ? (
          <p className="text-center text-text-muted">No featured reviews yet. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((review, index) => (
              <motion.article
                key={review._id}
                className="bg-surface-container-low rounded-xl p-6 border border-border-subtle shadow-ambient h-full flex flex-col"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <StarRating value={review.rating} readOnly size="sm" />
                <p className="text-sm text-text-muted mt-4 flex-grow leading-relaxed line-clamp-4">
                  &ldquo;{review.comment}&rdquo;
                </p>
                <div className="mt-6 pt-4 border-t border-border-subtle">
                  <p className="font-medium text-sm text-text-main">{review.userSnapshot?.name}</p>
                  <p className="text-xs text-text-muted">{review.userSnapshot?.email}</p>
                  {review.propertyId?.title && (
                    <p className="text-xs text-primary mt-1 truncate">{review.propertyId.title}</p>
                  )}
                  <p className="text-xs text-text-muted mt-1">
                    {format(new Date(review.createdAt), 'MMM yyyy')}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CustomerReviews;
