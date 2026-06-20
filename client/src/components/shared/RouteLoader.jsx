import FullPageLoader from './FullPageLoader.jsx';

const RouteLoader = ({ message = 'Loading page...' }) => (
  <FullPageLoader message={message} />
);

export default RouteLoader;
