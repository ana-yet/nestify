import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetchRentalStats } from '../../api/properties.api.js';
import LoadingSpinner from '../shared/LoadingSpinner.jsx';

const STAT_ICONS = ['home_work', 'payments', 'location_city', 'real_estate_agent'];

const RentalStatistics = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['properties', 'stats'],
    queryFn: fetchRentalStats,
  });

  const items = stats
    ? [
        { label: 'Active Listings', value: stats.totalListings, icon: STAT_ICONS[0] },
        { label: 'Average Rent', value: `$${stats.avgRent?.toLocaleString()}`, icon: STAT_ICONS[1] },
        { label: 'Cities Covered', value: stats.totalCities, icon: STAT_ICONS[2] },
        { label: 'Trusted Owners', value: stats.totalOwners, icon: STAT_ICONS[3] },
      ]
    : [];

  return (
    <section className="py-20 bg-primary text-white px-4 md:px-margin-desktop">
      <div className="max-w-container-max mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Rental Statistics</h2>
          <p className="opacity-90 max-w-2xl mx-auto">
            Real numbers from our growing premium rental marketplace.
          </p>
        </motion.div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item, index) => (
              <motion.div
                key={item.label}
                className="bg-white/10 backdrop-blur rounded-xl p-6 text-center border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="material-symbols-outlined text-3xl mb-3 opacity-90">{item.icon}</span>
                <p className="text-3xl font-bold mb-1">{item.value ?? 0}</p>
                <p className="text-sm opacity-80">{item.label}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RentalStatistics;
