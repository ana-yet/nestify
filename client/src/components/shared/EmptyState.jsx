const EmptyState = ({ icon = 'inbox', title, description, action, compact = false }) => (
  <div
    className={`flex flex-col items-center justify-center text-center ${
      compact ? 'py-10 px-4' : 'py-16 px-4'
    }`}
  >
    <div
      className={`rounded-full bg-surface-container-low flex items-center justify-center mb-4 ${
        compact ? 'w-12 h-12' : 'w-16 h-16'
      }`}
    >
      <span
        className={`material-symbols-outlined text-text-muted ${
          compact ? 'text-2xl' : 'text-3xl'
        }`}
      >
        {icon}
      </span>
    </div>
    <h3 className={`font-semibold text-text-main mb-2 ${compact ? 'text-base' : 'text-lg'}`}>
      {title}
    </h3>
    {description && (
      <p className="text-sm text-text-muted max-w-sm mb-6 leading-relaxed">{description}</p>
    )}
    {action}
  </div>
);

export default EmptyState;
