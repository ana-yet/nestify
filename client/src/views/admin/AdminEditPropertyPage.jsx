import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchPropertyById } from '../../api/properties.api.js';
import PropertyEditForm from '../../components/properties/PropertyEditForm.jsx';
import LoadingSpinner from '../../components/shared/LoadingSpinner.jsx';

const AdminEditPropertyPage = () => {
  const pathname = usePathname();
  const id = pathname.split("/").pop();
  const router = useRouter();

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
      backTo="/dashboard/admin/properties"
      backLabel="Back to All Properties"
      successMessage="Property updated successfully"
      invalidateKeys={[['properties', 'admin']]}
      onSuccessNavigate={() => router.push('/dashboard/admin/properties')}
    />
  );
};

export default AdminEditPropertyPage;
