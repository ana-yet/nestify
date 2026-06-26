import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetchPropertyById } from '../api/properties.api.js';
import LoadingSpinner from '../components/shared/LoadingSpinner.jsx';
import PropertyGallery from '../components/properties/PropertyGallery.jsx';
import FavoriteButton from '../components/favorites/FavoriteButton.jsx';
import BookingCard from '../components/booking/BookingCard.jsx';
import ReviewsSection from '../components/reviews/ReviewsSection.jsx';
import StarRating from '../components/reviews/StarRating.jsx';
import { formatLocation } from '../utils/propertyHelpers.js';

const AMENITY_ICONS = {
  'High-Speed WiFi': 'wifi',
  Parking: 'local_parking',
  'Pet Friendly': 'pets',
  'Air Conditioning': 'ac_unit',
  'In-Unit Washer': 'laundry',
  'Swimming Pool': 'pool',
  'Gym Access': 'fitness_center',
  'Central Heating': 'heat',
  'Balcony': 'balcony',
  'Security System': 'verified_user',
};

const PropertyDetailsPage = () => {
  const pathname = usePathname();
  const id = pathname.split("/").pop();

  const { data: property, isLoading, isError, error } = useQuery({
    queryKey: ['properties', id],
    queryFn: () => fetchPropertyById(id),
    enabled: Boolean(id),
  });

  if (isLoading) return <LoadingSpinner fullScreen message="Loading property..." />;

  if (isError || !property) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center px-4">
        <span className="material-symbols-outlined text-5xl text-error mb-4">error_outline</span>
        <p className="text-error mb-2 font-medium">Unable to load property</p>
        <p className="text-text-muted text-sm mb-6">
          {error?.response?.data?.message || 'Property not found or unavailable.'}
        </p>
        <Link href="/properties" className="btn btn-primary-nestify">
          Browse Properties
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <p className="text-text-muted flex items-center gap-1 text-sm mb-2">
            <span className="material-symbols-outlined text-base">location_on</span>
            {formatLocation(property.location)}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-text-main">{property.title}</h1>
          {(property.reviewCount > 0 || property.averageRating > 0) && (
            <div className="flex items-center gap-2 mt-2 text-sm text-text-muted">
              <StarRating value={Math.round(property.averageRating || 0)} readOnly size="sm" />
              <span>
                {property.averageRating?.toFixed(1)} ({property.reviewCount} review
                {property.reviewCount !== 1 ? 's' : ''})
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <FavoriteButton propertyId={property._id} />
        </div>
      </div>

      <PropertyGallery images={property.images} title={property.title} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 flex flex-col gap-10">
          <div className="flex flex-wrap gap-6 py-4 border-b border-border-subtle">
            {[
              { icon: 'bed', label: 'Bedrooms', value: property.bedrooms },
              { icon: 'bathtub', label: 'Bathrooms', value: property.bathrooms },
              { icon: 'straighten', label: 'Sq Ft', value: property.propertySize?.toLocaleString() },
              { icon: 'home_work', label: 'Type', value: property.propertyType },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="material-symbols-outlined text-text-muted text-[28px]">{item.icon}</span>
                <div>
                  <p className="font-semibold text-lg capitalize">{item.value}</p>
                  <p className="text-xs text-text-muted">{item.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">About this home</h2>
            <p className="text-text-muted leading-relaxed whitespace-pre-line">{property.description}</p>
          </div>

          {property.amenities?.length > 0 && (
            <div className="border-t border-border-subtle pt-8">
              <h2 className="text-xl font-semibold mb-6">Premium Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-5 gap-x-4">
                {property.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-3 text-sm text-text-main">
                    <span className="material-symbols-outlined text-text-muted">
                      {AMENITY_ICONS[amenity] || 'check_circle'}
                    </span>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          )}

          {property.extraFeatures?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Extra Features</h2>
              <ul className="list-disc list-inside text-text-muted space-y-1">
                {property.extraFeatures.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {property.ownerInfo && (
            <div className="border-t border-border-subtle pt-8">
              <h2 className="text-xl font-semibold mb-6">Hosted by {property.ownerInfo.name}</h2>
              <div className="flex items-start gap-4">
                {property.ownerInfo.photo ? (
                  <img
                    src={property.ownerInfo.photo}
                    alt={property.ownerInfo.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center">
                    <span className="material-symbols-outlined text-text-muted text-2xl">person</span>
                  </div>
                )}
                <div>
                  <p className="font-medium text-text-main">{property.ownerInfo.name}</p>
                  <p className="text-sm text-text-muted mt-1">{property.ownerInfo.email}</p>
                  <div className="flex gap-4 mt-3 text-sm text-text-muted">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">verified_user</span>
                      Verified Host
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <ReviewsSection
            propertyId={property._id}
            averageRating={property.averageRating}
            reviewCount={property.reviewCount}
          />
        </div>

        <div className="lg:col-span-1">
          <BookingCard property={property} />
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyDetailsPage;
