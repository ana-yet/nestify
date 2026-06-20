import { PROPERTY_TYPES } from '../../utils/propertyHelpers.js';

const FilterSidebar = ({ filters, onChange, onApply, onClear }) => {
  const toggleType = (type) => {
    const current = filters.propertyType ? filters.propertyType.split(',') : [];
    const next = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    onChange({ ...filters, propertyType: next.join(',') });
  };

  const selectedTypes = filters.propertyType ? filters.propertyType.split(',') : [];

  return (
    <aside className="w-full md:w-64 shrink-0">
      <div className="bg-surface rounded-xl p-6 shadow-ambient border border-border-subtle sticky top-28">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-text-main">Filters</h2>
          <button type="button" className="text-primary text-sm hover:underline" onClick={onClear}>
            Clear all
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="form-label-nestify">Location</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-lg">
                location_on
              </span>
              <input
                type="text"
                className="input input-bordered w-full pl-10 bg-surface-container-low"
                placeholder="Search cities..."
                value={filters.location || ''}
                onChange={(e) => onChange({ ...filters, location: e.target.value })}
              />
            </div>
          </div>

          <hr className="border-border-subtle" />

          <div>
            <label className="form-label-nestify mb-3 block">Property Type</label>
            <div className="space-y-2">
              {PROPERTY_TYPES.map(({ value, label }) => (
                <label key={value} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary checkbox-sm"
                    checked={selectedTypes.includes(value)}
                    onChange={() => toggleType(value)}
                  />
                  <span className="text-sm group-hover:text-primary transition-colors">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <hr className="border-border-subtle" />

          <div>
            <label className="form-label-nestify mb-3 block">Price Range</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="input input-bordered w-full bg-surface-container-low"
                placeholder="Min"
                value={filters.minPrice || ''}
                onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
              />
              <span className="text-text-muted">-</span>
              <input
                type="number"
                className="input input-bordered w-full bg-surface-container-low"
                placeholder="Max"
                value={filters.maxPrice || ''}
                onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
              />
            </div>
          </div>

          <hr className="border-border-subtle" />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="form-label-nestify mb-0">Min Bedrooms</label>
              <input
                type="number"
                min="0"
                className="input input-bordered input-sm w-20"
                value={filters.bedrooms || ''}
                onChange={(e) => onChange({ ...filters, bedrooms: e.target.value })}
              />
            </div>
            <div className="flex justify-between items-center">
              <label className="form-label-nestify mb-0">Min Bathrooms</label>
              <input
                type="number"
                min="0"
                step="0.5"
                className="input input-bordered input-sm w-20"
                value={filters.bathrooms || ''}
                onChange={(e) => onChange({ ...filters, bathrooms: e.target.value })}
              />
            </div>
          </div>

          <button type="button" className="btn btn-primary-nestify w-full" onClick={onApply}>
            Apply Filters
          </button>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
