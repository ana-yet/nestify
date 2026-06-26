import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  fetchOwnerProperties,
  deleteProperty,
} from "../../api/properties.api.js";
import LoadingSpinner from "../../components/shared/LoadingSpinner.jsx";
import StatusBadge from "../../components/shared/StatusBadge.jsx";
import { formatRent, formatLocation } from "../../utils/propertyHelpers.js";

const RejectionModal = ({ feedback, onClose }) => (
  <dialog open className="modal modal-open">
    <div className="modal-box">
      <h3 className="font-bold text-lg">Rejection Feedback</h3>
      <p className="py-4 text-text-muted whitespace-pre-line">{feedback}</p>
      <div className="modal-action">
        <button type="button" className="btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
    <form method="dialog" className="modal-backdrop">
      <button type="button" onClick={onClose}>
        close
      </button>
    </form>
  </dialog>
);

const MyPropertiesPage = () => {
  const [rejectionView, setRejectionView] = useState(null);
  const queryClient = useQueryClient();

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["properties", "owner"],
    queryFn: fetchOwnerProperties,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties", "owner"] });
      toast.success("Property deleted");
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Delete failed"),
  });

  const handleDelete = (id, title) => {
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-main">My Properties</h1>
          <p className="text-text-muted mt-1">
            Manage your listings and track approval status
          </p>
        </div>
        <Link
          href="/dashboard/owner/add-property"
          className="btn btn-primary-nestify btn-sm"
        >
          Add Property
        </Link>
      </div>

      <div className="bg-surface rounded-xl border border-border-subtle overflow-hidden shadow-ambient">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-surface-container-low">
                <th>Property</th>
                <th>Location</th>
                <th>Rent</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => {
                const { amount, suffix } = formatRent(
                  property.rent,
                  property.rentType,
                );
                return (
                  <tr
                    key={property._id}
                    className="hover:bg-surface-container-low/50"
                  >
                    <td className="font-medium">{property.title}</td>
                    <td className="text-text-muted text-sm">
                      {formatLocation(property.location)}
                    </td>
                    <td>
                      ${amount}
                      {suffix}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={property.status} />
                        {property.status === "rejected" &&
                          property.rejectionFeedback && (
                            <button
                              type="button"
                              className="btn btn-ghost btn-xs"
                              title="View rejection feedback"
                              onClick={() =>
                                setRejectionView(property.rejectionFeedback)
                              }
                            >
                              <span className="material-symbols-outlined text-base">
                                visibility
                              </span>
                            </button>
                          )}
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <Link
                          href={`/dashboard/owner/edit-property/${property._id}`}
                          className="btn btn-outline btn-xs"
                        >
                          Update
                        </Link>
                        <button
                          type="button"
                          className="btn btn-error btn-outline btn-xs"
                          onClick={() =>
                            handleDelete(property._id, property.title)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {properties.length === 0 && (
            <p className="text-center text-text-muted py-12">
              No properties yet. Add your first listing!
            </p>
          )}
        </div>
      </div>

      {rejectionView && (
        <RejectionModal
          feedback={rejectionView}
          onClose={() => setRejectionView(null)}
        />
      )}
    </div>
  );
};

export default MyPropertiesPage;
