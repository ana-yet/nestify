import { useState } from 'react';
import { formatRent } from '../../utils/propertyHelpers.js';
import useAuth from '../../hooks/useAuth.js';
import BookingModal from '../booking/BookingModal.jsx';

const BookingCard = ({ property }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useAuth();
  const { amount, suffix } = formatRent(property.rent, property.rentType);
  const isTenant = user?.role === 'tenant';
  const canBook = isTenant && property.status === 'approved';

  return (
    <>
      <div className="sticky top-28 bg-surface border border-border-subtle rounded-xl p-6 shadow-ambient flex flex-col gap-4">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-3xl font-bold text-text-main">${amount}</span>
            <span className="text-text-muted">{suffix}</span>
          </div>
          {property.averageRating > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <span className="material-symbols-outlined text-base">star</span>
              {property.averageRating.toFixed(1)}
            </div>
          )}
        </div>

        <p className="text-sm text-text-muted capitalize">{property.rentType} rent</p>

        <div className="border border-border-subtle rounded-lg p-3 bg-surface-container-low/50">
          <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Reservation Fee</p>
          <p className="font-semibold text-text-main">${amount}</p>
          <p className="text-xs text-text-muted mt-1">Payable upon confirmation (Phase 4)</p>
        </div>

        {canBook ? (
          <>
            <button
              type="button"
              className="btn btn-primary-nestify w-full py-3 text-base"
              onClick={() => setModalOpen(true)}
            >
              Book Property
            </button>
            <p className="text-xs text-text-muted text-center">You won&apos;t be charged yet</p>
          </>
        ) : (
          <p className="text-sm text-text-muted text-center py-2">
            {!isTenant
              ? 'Only tenants can book properties'
              : 'This property is not available for booking'}
          </p>
        )}
      </div>

      {canBook && (
        <BookingModal
          property={property}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
};

export default BookingCard;
