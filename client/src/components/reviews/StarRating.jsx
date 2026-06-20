const StarRating = ({ value, onChange, readOnly = false, size = 'md' }) => {
  const sizeClass = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-xl';

  return (
    <div className={`flex items-center gap-0.5 ${sizeClass}`} role={readOnly ? 'img' : 'group'}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value;
        const StarEl = readOnly ? 'span' : 'button';

        return (
          <StarEl
            key={star}
            type={readOnly ? undefined : 'button'}
            className={`${
              readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'
            } ${filled ? 'text-warning' : 'text-border-subtle'}`}
            aria-label={readOnly ? undefined : `Rate ${star} stars`}
            onClick={readOnly ? undefined : () => onChange?.(star)}
            disabled={readOnly}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0" }}>
              star
            </span>
          </StarEl>
        );
      })}
    </div>
  );
};

export default StarRating;
