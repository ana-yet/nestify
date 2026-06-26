import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { fetchFavorites, removeFavorite } from "../../api/favorites.api.js";
import LoadingSpinner from "../../components/shared/LoadingSpinner.jsx";
import EmptyState from "../../components/shared/EmptyState.jsx";
import {
  formatRent,
  formatLocation,
  getPropertyImage,
} from "../../utils/propertyHelpers.js";

const FavoritesPage = () => {
  const queryClient = useQueryClient();

  const {
    data: favorites = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["favorites", "list"],
    queryFn: fetchFavorites,
  });

  const removeMutation = useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", "list"] });
      toast.success("Removed from favorites");
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to remove"),
  });

  if (isLoading) return <LoadingSpinner message="Loading favorites..." />;

  if (isError) {
    return (
      <EmptyState
        icon="error_outline"
        title="Failed to load favorites"
        action={
          <button
            type="button"
            className="btn btn-primary-nestify"
            onClick={() => refetch()}
          >
            Retry
          </button>
        }
      />
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-main">My Favorites</h1>
        <p className="text-text-muted mt-1">
          Properties you&apos;ve saved for later
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-surface rounded-xl border border-border-subtle">
          <EmptyState
            icon="favorite"
            title="No favorites yet"
            description="Save properties you love by clicking the heart on any listing."
            action={
              <Link href="/properties" className="btn btn-primary-nestify">
                Browse Properties
              </Link>
            }
          />
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-border-subtle overflow-x-auto shadow-ambient">
          <table className="table w-full">
            <thead>
              <tr className="bg-surface-container-low">
                <th>Property</th>
                <th>Location</th>
                <th>Rent</th>
                <th>Saved</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {favorites
                .filter((item) => item.propertyId)
                .map((item) => {
                  const property = item.propertyId;
                  const { amount, suffix } = formatRent(
                    property.rent,
                    property.rentType,
                  );
                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-surface-container-low/40"
                    >
                      <td>
                        <div className="flex items-center gap-3">
                          <img
                            src={getPropertyImage(property)}
                            alt={property.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <span className="font-medium">{property.title}</span>
                        </div>
                      </td>
                      <td className="text-sm text-text-muted">
                        {formatLocation(property.location)}
                      </td>
                      <td>
                        ${amount}
                        {suffix}
                      </td>
                      <td className="text-sm text-text-muted">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Link
                            href={`/properties/${property._id}`}
                            className="btn btn-outline btn-xs"
                          >
                            View
                          </Link>
                          <button
                            type="button"
                            className="btn btn-error btn-outline btn-xs"
                            disabled={removeMutation.isPending}
                            onClick={() => removeMutation.mutate(property._id)}
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
