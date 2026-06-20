const LoadingSpinner = ({ fullScreen = false, message = 'Loading...' }) => {
  const wrapperClass = fullScreen
    ? 'min-h-screen flex flex-col items-center justify-center bg-background'
    : 'flex flex-col items-center justify-center py-16';

  return (
    <div className={wrapperClass}>
      <span className="loading loading-spinner loading-lg text-primary" />
      <p className="mt-4 text-text-muted font-medium">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
