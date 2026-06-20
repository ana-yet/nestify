import { useState } from 'react';
import { getPropertyImage } from '../../utils/propertyHelpers.js';

const PropertyGallery = ({ images = [], title }) => {
  const gallery = images.length > 0 ? images : [getPropertyImage({ images: [] })];
  const [activeIndex, setActiveIndex] = useState(0);
  const extraCount = gallery.length > 5 ? gallery.length - 5 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[500px] rounded-xl overflow-hidden mb-8">
      <div
        className="md:col-span-2 md:row-span-2 relative group cursor-pointer min-h-[240px]"
        onClick={() => setActiveIndex(0)}
      >
        <img
          src={gallery[activeIndex] || gallery[0]}
          alt={title}
          className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>

      {gallery.slice(1, 5).map((img, i) => (
        <button
          key={i}
          type="button"
          className="hidden md:block relative group overflow-hidden rounded-lg min-h-[120px]"
          onClick={() => setActiveIndex(i + 1)}
        >
          <img
            src={img}
            alt=""
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              activeIndex === i + 1 ? 'ring-2 ring-primary' : ''
            }`}
          />
          {i === 3 && extraCount > 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-semibold">+{extraCount} Photos</span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default PropertyGallery;
