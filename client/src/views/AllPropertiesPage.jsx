import { useMemo, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchProperties } from '../api/properties.api.js';
import FilterSidebar from '../components/properties/FilterSidebar.jsx';
import PropertyCard from '../components/shared/PropertyCard.jsx';
import Pagination from '../components/shared/Pagination.jsx';
import LoadingSpinner from '../components/shared/LoadingSpinner.jsx';
import { SORT_OPTIONS } from '../utils/propertyHelpers.js';

const parseFiltersFromParams = (params) => ({
  location: params.get('location') || '',
  propertyType: params.get('propertyType') || '',
  minPrice: params.get('minPrice') || '',
  maxPrice: params.get('maxPrice') || '',
  bedrooms: params.get('bedrooms') || '',
  bathrooms: params.get('bathrooms') || '',
  sort: params.get('sort') || 'newest',
  page: params.get('page') || '1',
});

const AllPropertiesPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [draftFilters, setDraftFilters] = useState(() => parseFiltersFromParams(searchParams));

  const queryParams = useMemo(() => {
    const params = Object.fromEntries(searchParams.entries());
    return {
      ...params,
      page: params.page || 1,
      limit: 12,
    };
  }, [searchParams]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['properties', 'list', queryParams],
    queryFn: () => fetchProperties(queryParams),
  });

  const applyFilters = () => {
    const next = new URLSearchParams();
    Object.entries({ ...draftFilters, page: '1' }).forEach(([key, value]) => {
      if (value) next.set(key, value);
    });
    router.push(`${pathname}?${next.toString()}`);
  };

  const clearFilters = () => {
    const cleared = {
      location: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      sort: 'newest',
      page: '1',
    };
    setDraftFilters(cleared);
    router.push(pathname);
  };

  const handleSortChange = (sort) => {
    const next = new URLSearchParams(searchParams);
    next.set('sort', sort);
    next.set('page', '1');
    setDraftFilters((prev) => ({ ...prev, sort }));
    router.push(`${pathname}?${next.toString()}`);
  };

  const handlePageChange = (page) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(page));
    router.push(`${pathname}?${next.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const properties = data?.properties || [];
  const pagination = data?.pagination || { page: 1, totalPages: 1, total: 0 };

  return (
    <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-8 flex flex-col md:flex-row gap-6">
      <FilterSidebar
        filters={draftFilters}
        onChange={setDraftFilters}
        onApply={applyFilters}
        onClear={clearFilters}
      />

      <div className="flex-grow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-text-main mb-1">Explore Properties</h1>
            <p className="text-text-muted text-sm">
              {isLoading ? 'Loading...' : `Showing ${pagination.total} available listings`}
            </p>
          </div>
          <select
            className="select select-bordered bg-surface text-sm"
            value={draftFilters.sort || 'newest'}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {isLoading && <LoadingSpinner />}
        {isError && (
          <p className="text-center text-error py-12">Failed to load properties. Please try again.</p>
        )}

        {!isLoading && !isError && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property, index) => (
                <PropertyCard key={property._id} property={property} index={index} />
              ))}
            </div>
            {properties.length === 0 && (
              <p className="text-center text-text-muted py-16">No properties match your filters.</p>
            )}
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AllPropertiesPage;
