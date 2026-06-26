import Link from 'next/link';
import { motion } from 'framer-motion';
import useAuth from '../../hooks/useAuth.js';
import { formatRent, formatLocation, getPropertyImage } from '../../utils/propertyHelpers.js';

const PropertyCard = ({ property, index = 0, showStatus = false }) => {
  const { isAuthenticated } = useAuth();
  const { amount, suffix } = formatRent(property.rent, property.rentType);
  const image = getPropertyImage(property);
  const detailsPath = `/properties/${property._id}`;
  const linkTo = isAuthenticated ? detailsPath : '/login';
  const linkState = isAuthenticated ? undefined : { from: detailsPath };

  return (
    <motion.article
      className="bg-surface rounded-xl overflow-hidden shadow-ambient border border-border-subtle group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <div className="relative h-48 sm:h-56 overflow-hidden shrink-0">
        <img
          src={image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {showStatus && property.status && (
          <div className="absolute top-3 left-3">
            <span
              className={`px-2 py-1 rounded text-xs font-medium backdrop-blur-md ${
                property.status === 'approved'
                  ? 'bg-secondary/10 text-secondary border border-secondary/20'
                  : property.status === 'rejected'
                    ? 'bg-error/10 text-error border border-error/20'
                    : 'bg-tertiary-fixed-dim/10 text-tertiary border border-tertiary/20'
              }`}
            >
              {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
            </span>
          </div>
        )}
        {!showStatus && (
          <div className="absolute top-3 left-3 bg-secondary/10 text-secondary px-2 py-1 rounded text-xs font-medium backdrop-blur-md border border-secondary/20 capitalize">
            {property.propertyType}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="text-lg font-semibold text-text-main line-clamp-1">{property.title}</h3>
          {property.averageRating > 0 && (
            <div className="flex items-center gap-1 text-tertiary-fixed-dim bg-tertiary-fixed-dim/10 px-1.5 rounded shrink-0">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
              <span className="text-xs font-bold">{property.averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <p className="text-sm text-on-surface-variant flex items-center gap-1 mb-4">
          <span className="material-symbols-outlined text-base">location_on</span>
          {formatLocation(property.location)}
        </p>

        <div className="flex items-center gap-4 text-on-surface-variant text-xs border-t border-border-subtle pt-4 mb-4">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-base">bed</span>
            {property.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-base">bathtub</span>
            {property.bathrooms}
          </span>
          {property.propertySize > 0 && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">straighten</span>
              {property.propertySize.toLocaleString()} sqft
            </span>
          )}
        </div>

        <div className="flex justify-between items-center mt-auto">
          <div>
            <span className="text-lg font-bold text-text-main">${amount}</span>
            <span className="text-xs text-text-muted">{suffix}</span>
          </div>
          <Link
            href={linkTo}
            className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg text-sm font-medium transition-colors border border-primary/20 hover:border-transparent"
          >
            Details
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

export default PropertyCard;
