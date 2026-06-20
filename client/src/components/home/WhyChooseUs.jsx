import { motion } from 'framer-motion';

const FEATURES = [
  {
    icon: 'verified_user',
    title: 'Verified Listings',
    description: 'Every property is reviewed and approved by our admin team before going live.',
  },
  {
    icon: 'payments',
    title: 'Secure Payments',
    description: 'Book with confidence using industry-standard secure payment processing.',
  },
  {
    icon: 'support_agent',
    title: 'Dedicated Support',
    description: 'Our team is available to help tenants and owners throughout the rental journey.',
  },
  {
    icon: 'travel_explore',
    title: 'Premium Locations',
    description: 'Discover curated properties in the most desirable neighborhoods and cities.',
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-surface-container-low px-4 md:px-margin-desktop">
      <div className="max-w-container-max mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-4">Why Choose Nestify</h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            A transparent, secure marketplace built for modern renters and property owners.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-surface rounded-xl p-6 border border-border-subtle shadow-ambient h-full flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary text-2xl">{feature.icon}</span>
              </div>
              <h3 className="text-lg font-semibold text-text-main mb-2">{feature.title}</h3>
              <p className="text-sm text-text-muted flex-grow">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
