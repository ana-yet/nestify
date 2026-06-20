const ApiError = ({
  title = 'Something went wrong',
  message,
  onRetry,
}) => {
  const displayMessage =
    message || 'We could not load this data. Please try again.';

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-3xl text-error">error_outline</span>
      </div>
      <h3 className="text-lg font-semibold text-text-main mb-2">{title}</h3>
      <p className="text-sm text-text-muted max-w-md mb-6">{displayMessage}</p>
      {onRetry && (
        <button type="button" className="btn btn-primary-nestify btn-sm" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};

export default ApiError;
