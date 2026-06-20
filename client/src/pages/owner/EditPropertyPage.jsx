import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchPropertyById } from '../../api/properties.api.js';
import PropertyEditForm from '../../components/properties/PropertyEditForm.jsx';
import LoadingSpinner from '../../components/shared/LoadingSpinner.jsx';

const EditPropertyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: property, isLoading } = useQuery({
    queryKey: ['properties', id],
    queryFn: () => fetchPropertyById(id),
    enabled: Boolean(id),
  });

  if (isLoading) return <LoadingSpinner fullScreen message="Loading property..." />;

  if (!property) {
    return (
      <p className="text-error text-center py-12">Property not found or unavailable.</p>
    );
  }

  return (
    <PropertyEditForm
      propertyId={id}
      property={property}
      backTo="/dashboard/owner/properties"
      backLabel="Back to My Properties"
      successMessage="Property updated — pending re-approval"
      invalidateKeys={[['properties', 'owner']]}
      onSuccessNavigate={() => navigate('/dashboard/owner/properties')}
    />
  );
};

export default EditPropertyPage;
