import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col bg-background">
    <Navbar />
    <main className="flex-grow flex items-center justify-center px-4">
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-5xl text-primary">home_work</span>
        </div>
        <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Error 404</p>
        <h1 className="text-4xl font-bold text-text-main mb-3">Page Not Found</h1>
        <p className="text-text-muted mb-8 leading-relaxed">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn btn-primary-nestify">
            Back to Home
          </Link>
          <Link href="/properties" className="btn btn-outline">
            Browse Properties
          </Link>
        </div>
      </motion.div>
    </main>
    <Footer />
  </div>
);

export default NotFoundPage;
