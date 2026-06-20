import LoadingSpinner from './LoadingSpinner.jsx';

const FullPageLoader = ({ message = 'Loading Nestify...' }) => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
      <span className="material-symbols-outlined text-primary text-3xl">real_estate_agent</span>
    </div>
    <LoadingSpinner message={message} />
  </div>
);

export default FullPageLoader;
