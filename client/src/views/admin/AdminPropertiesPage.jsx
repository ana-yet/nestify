import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  fetchAdminProperties,
  approveProperty,
  rejectProperty,
  deleteProperty,
} from "../../api/properties.api.js";
import LoadingSpinner from "../../components/shared/LoadingSpinner.jsx";
import Pagination from "../../components/shared/Pagination.jsx";
import StatusBadge from "../../components/shared/StatusBadge.jsx";
import { formatRent, formatLocation } from "../../utils/propertyHelpers.js";

const RejectModal = ({ property, onClose, onConfirm, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { rejectionFeedback: "" },
  });

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Reject Property</h3>
        <p className="text-sm text-text-muted py-2">
          Rejecting: <strong>{property?.title}</strong>
        </p>
        <form
          onSubmit={handleSubmit((data) => onConfirm(data.rejectionFeedback))}
        >
          <label className="form-label-nestify">
            Rejection Feedback (required)
          </label>
          <textarea
            rows={4}
            className={`textarea textarea-bordered w-full ${errors.rejectionFeedback ? "textarea-error" : ""}`}
            placeholder="Explain why this listing was rejected..."
            {...register("rejectionFeedback", {
              required: "Feedback is required",
              minLength: { value: 10, message: "At least 10 characters" },
            })}
          />
          {errors.rejectionFeedback && (
            <p className="text-error text-sm mt-1">
              {errors.rejectionFeedback.message}
            </p>
          )}
          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-error" disabled={loading}>
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Confirm Reject"
              )}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={onClose}>
          close
        </button>
      </form>
    </dialog>
  );
};

const AdminPropertiesPage = () => {
  const [page, setPage] = useState(1);
  const [rejectTarget, setRejectTarget] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["properties", "admin", page],
    queryFn: () => fetchAdminProperties({ page, limit: 12 }),
  });

  const approveMutation = useMutation({
    mutationFn: approveProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties", "admin"] });
      toast.success("Property approved");
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Approve failed"),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, feedback }) => rejectProperty(id, feedback),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties", "admin"] });
      toast.success("Property rejected");
      setRejectTarget(null);
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Reject failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties", "admin"] });
      toast.success("Property deleted");
    },
  });

  const properties = data?.properties || [];
  const pagination = data?.pagination || { page: 1, totalPages: 1 };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-main mb-2">All Properties</h1>
      <p className="text-text-muted mb-8">
        Moderate listings — approve, reject, or remove
      </p>

      <div className="bg-surface rounded-xl border border-border-subtle overflow-x-auto shadow-ambient">
        <table className="table w-full">
          <thead>
            <tr className="bg-surface-container-low">
              <th>Title</th>
              <th>Owner</th>
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
                <tr key={property._id}>
                  <td className="font-medium max-w-[180px] truncate">
                    {property.title}
                  </td>
                  <td className="text-sm">{property.ownerInfo?.name}</td>
                  <td className="text-sm text-text-muted">
                    {formatLocation(property.location)}
                  </td>
                  <td>
                    ${amount}
                    {suffix}
                  </td>
                  <td>
                    <StatusBadge status={property.status} />
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      <Link
                        href={`/dashboard/admin/edit-property/${property._id}`}
                        className="btn btn-outline btn-xs"
                      >
                        Update
                      </Link>
                      {property.status !== "approved" && (
                        <button
                          type="button"
                          className="btn btn-success btn-xs"
                          onClick={() => approveMutation.mutate(property._id)}
                        >
                          Approve
                        </button>
                      )}
                      {property.status !== "rejected" && (
                        <button
                          type="button"
                          className="btn btn-warning btn-xs"
                          onClick={() => setRejectTarget(property)}
                        >
                          Reject
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn btn-error btn-outline btn-xs"
                        onClick={() => {
                          if (window.confirm("Delete this property?")) {
                            deleteMutation.mutate(property._id);
                          }
                        }}
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
            No properties in the system.
          </p>
        )}
      </div>

      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={setPage}
      />

      {rejectTarget && (
        <RejectModal
          property={rejectTarget}
          onClose={() => setRejectTarget(null)}
          onConfirm={(feedback) =>
            rejectMutation.mutate({ id: rejectTarget._id, feedback })
          }
          loading={rejectMutation.isPending}
        />
      )}
    </div>
  );
};

export default AdminPropertiesPage;
