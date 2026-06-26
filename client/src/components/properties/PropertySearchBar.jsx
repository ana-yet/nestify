import { useRouter } from 'next/navigation';
import { useState } from 'react';

const PropertySearchBar = ({ className = '', compact = false }) => {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (propertyType) params.set('propertyType', propertyType);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    router.push(`/properties?${params.toString()}`);
  };

  if (compact) {
    return (
      <form onSubmit={handleSearch} className={`glass-panel rounded-xl p-4 flex flex-col md:flex-row gap-4 ${className}`}>
        <input
          type="text"
          placeholder="Where do you want to live?"
          className="input input-bordered flex-1 bg-surface"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <select
          className="select select-bordered flex-1 bg-surface"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
        >
          <option value="">Any Type</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="villa">Villa</option>
          <option value="condo">Condo</option>
        </select>
        <button type="submit" className="btn btn-primary-nestify gap-2">
          <span className="material-symbols-outlined text-lg">search</span>
          Search
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSearch} className={`glass-panel rounded-xl p-4 max-w-4xl mx-auto flex flex-col md:flex-row gap-4 shadow-xl ${className}`}>
      <div className="flex-1 bg-surface rounded-lg px-4 py-3 border border-border-subtle flex items-center">
        <span className="material-symbols-outlined text-text-muted mr-3">location_on</span>
        <input
          type="text"
          placeholder="Where do you want to live?"
          className="bg-transparent border-none p-0 focus:ring-0 w-full outline-none"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div className="flex-1 bg-surface rounded-lg px-4 py-3 border border-border-subtle flex items-center">
        <span className="material-symbols-outlined text-text-muted mr-3">home_work</span>
        <select
          className="bg-transparent border-none p-0 focus:ring-0 w-full outline-none cursor-pointer"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
        >
          <option value="">Any Type</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="villa">Villa</option>
          <option value="condo">Condo</option>
        </select>
      </div>
      <div className="flex-1 bg-surface rounded-lg px-4 py-3 border border-border-subtle flex items-center gap-2">
        <span className="material-symbols-outlined text-text-muted">payments</span>
        <input
          type="number"
          placeholder="Min $"
          className="w-1/2 bg-transparent border-none p-0 focus:ring-0 outline-none"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <span className="text-text-muted">-</span>
        <input
          type="number"
          placeholder="Max $"
          className="w-1/2 bg-transparent border-none p-0 focus:ring-0 outline-none"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary-nestify px-8 gap-2">
        <span className="material-symbols-outlined">search</span>
        Search
      </button>
    </form>
  );
};

export default PropertySearchBar;
