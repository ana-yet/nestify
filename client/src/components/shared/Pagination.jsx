const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const addPage = (p) => pages.push(p);

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i += 1) addPage(i);
  } else {
    addPage(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i += 1) {
      addPage(i);
    }
    if (page < totalPages - 2) pages.push('...');
    addPage(totalPages);
  }

  return (
    <div className="flex justify-center items-center mt-12 gap-2">
      <button
        type="button"
        className="btn btn-sm btn-ghost"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>

      {pages.map((p, idx) =>
        p === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-text-muted">
            ...
          </span>
        ) : (
          <button
            key={p}
            type="button"
            className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        className="btn btn-sm btn-ghost"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
    </div>
  );
};

export default Pagination;
