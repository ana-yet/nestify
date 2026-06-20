import ErrorBoundary from './components/shared/ErrorBoundary.jsx';
import AuthProvider from './context/AuthContext.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
