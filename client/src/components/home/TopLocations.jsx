import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetchTopLocations } from '../../api/properties.api.js';
import LoadingSpinner from '../shared/LoadingSpinner.jsx';

const TopLocations = () => {
  const { data: locations = [], isLoading } = useQuery({
    queryKey: ['properties', 'locations', 'top'],
    queryFn: fetchTopLocations,
  });

  return (
    <section className="py-20 px-4 md:px-margin-desktop max-w-container-max mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-4">Top Locations</h2>
        <p className="text-text-muted">Explore the most popular cities on Nestify.</p>
      </motion.div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((loc, index) => (
            <motion.div
              key={loc.city}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <Link
                href={`/properties?location=${encodeURIComponent(loc.city)}`}
                className="group block relative h-48 rounded-xl overflow-hidden border border-border-subtle"
              >
                <img
                  src={loc.image || 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80'}
                  alt={loc.city}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">
                    {loc.city}
                    {loc.state ? `, ${loc.state}` : ''}
                  </h3>
                  <p className="text-sm opacity-90">
                    {loc.count} listings · avg ${loc.avgRent?.toLocaleString()}/mo
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
          {locations.length === 0 && (
            <p className="text-text-muted col-span-full text-center py-8">No locations available yet.</p>
          )}
        </div>
      )}
    </section>
  );
};

export default TopLocations;
