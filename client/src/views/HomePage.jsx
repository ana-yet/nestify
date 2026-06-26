import { motion } from 'framer-motion';
import PropertySearchBar from '../components/properties/PropertySearchBar.jsx';
import FeaturedProperties from '../components/home/FeaturedProperties.jsx';
import WhyChooseUs from '../components/home/WhyChooseUs.jsx';
import CustomerReviews from '../components/home/CustomerReviews.jsx';
import TopLocations from '../components/home/TopLocations.jsx';
import RecentlyAdded from '../components/home/RecentlyAdded.jsx';
import RentalStatistics from '../components/home/RentalStatistics.jsx';

const HomePage = () => {
  return (
    <>
      <section className="relative min-h-[85vh] flex items-center justify-center pt-12 pb-32 px-4 md:px-margin-desktop overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80"
            alt="Luxury modern villa"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/60 via-dark-bg/40 to-dark-bg/80" />
        </div>

        <div className="relative z-10 max-w-container-max mx-auto w-full text-center">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Find Your Next Chapter
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-200 mb-12 max-w-2xl mx-auto drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Discover premium properties curated for exceptional living experiences.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <PropertySearchBar />
          </motion.div>
        </div>
      </section>

      <FeaturedProperties />
      <WhyChooseUs />
      <CustomerReviews />
      <TopLocations />
      <RecentlyAdded />
      <RentalStatistics />
    </>
  );
};

export default HomePage;
