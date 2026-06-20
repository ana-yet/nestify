import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { checkFavorite, addFavorite, removeFavorite } from '../../api/favorites.api.js';
import useAuth from '../../hooks/useAuth.js';

const FavoriteButton = ({ propertyId, className = '' }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isTenant = user?.role === 'tenant';

  const { data: isFavorited = false, isLoading } = useQuery({
    queryKey: ['favorites', 'check', propertyId],
    queryFn: () => checkFavorite(propertyId),
    enabled: Boolean(propertyId) && isTenant,
  });

  const toggleMutation = useMutation({
    mutationFn: async () => {
      if (isFavorited) {
        await removeFavorite(propertyId);
      } else {
        await addFavorite(propertyId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', 'check', propertyId] });
      queryClient.invalidateQueries({ queryKey: ['favorites', 'list'] });
      toast.success(isFavorited ? 'Removed from favorites' : 'Saved to favorites');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update favorite');
    },
  });

  if (!isTenant) return null;

  return (
    <button
      type="button"
      aria-label={isFavorited ? 'Remove from favorites' : 'Save to favorites'}
      disabled={isLoading || toggleMutation.isPending}
      onClick={() => toggleMutation.mutate()}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-border-subtle bg-surface hover:bg-surface-container-low transition-colors ${className}`}
    >
      <span
        className={`material-symbols-outlined ${isFavorited ? 'text-error' : 'text-text-muted'}`}
        style={{ fontVariationSettings: isFavorited ? "'FILL' 1" : "'FILL' 0" }}
      >
        favorite
      </span>
      <span className="text-sm font-medium">{isFavorited ? 'Saved' : 'Save'}</span>
    </button>
  );
};

export default FavoriteButton;
