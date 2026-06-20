import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetchRecentProperties } from '../../api/properties.api.js';
import PropertyCard from '../shared/PropertyCard.jsx';
import LoadingSpinner from '../shared/LoadingSpinner.jsx';

const RecentlyAdded = () => {
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['properties', 'recent'],
    queryFn: () => fetchRecentProperties(4),
  });

  return (
    <section className="py-20 bg-surface px-4 md:px-margin-desktop">
      <div className="max-w-container-max mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-4">Recently Added</h2>
          <p className="text-text-muted">The newest approved listings on the platform.</p>
        </motion.div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.map((property, index) => (
              <PropertyCard key={property._id} property={property} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentlyAdded;
