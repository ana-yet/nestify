import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetchFeaturedProperties } from '../../api/properties.api.js';
import PropertyCard from '../shared/PropertyCard.jsx';
import LoadingSpinner from '../shared/LoadingSpinner.jsx';

const FeaturedProperties = () => {
  const { data: properties = [], isLoading, isError } = useQuery({
    queryKey: ['properties', 'featured'],
    queryFn: fetchFeaturedProperties,
  });

  return (
    <section className="py-20 px-4 md:px-margin-desktop max-w-container-max mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-4">Featured Properties</h2>
        <p className="text-text-muted max-w-2xl mx-auto">
          Handpicked premium listings approved by our team for exceptional quality and value.
        </p>
      </motion.div>

      {isLoading && <LoadingSpinner />}
      {isError && (
        <p className="text-center text-error">Unable to load featured properties.</p>
      )}
      {!isLoading && !isError && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property, index) => (
              <PropertyCard key={property._id} property={property} index={index} />
            ))}
          </div>
          {properties.length === 0 && (
            <p className="text-center text-text-muted py-12">No featured properties yet.</p>
          )}
          <div className="text-center mt-10">
            <Link href="/properties" className="btn btn-outline-nestify">
              View All Properties
            </Link>
          </div>
        </>
      )}
    </section>
  );
};

export default FeaturedProperties;
