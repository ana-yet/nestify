import LoadingSpinner from './LoadingSpinner.jsx';
import ApiError from './ApiError.jsx';
import EmptyState from './EmptyState.jsx';

const QueryState = ({
  isLoading,
  isError,
  error,
  onRetry,
  isEmpty,
  emptyIcon = 'inbox',
  emptyTitle = 'No data found',
  emptyDescription,
  emptyAction,
  loadingMessage = 'Loading...',
  children,
  inline = false,
}) => {
  if (isLoading) {
    return inline ? (
      <LoadingSpinner message={loadingMessage} />
    ) : (
      <LoadingSpinner message={loadingMessage} />
    );
  }

  if (isError) {
    return (
      <ApiError
        message={error?.response?.data?.message || undefined}
        onRetry={onRetry}
      />
    );
  }

  if (isEmpty) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return children;
};

export default QueryState;
