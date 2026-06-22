import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout.jsx';
import AuthLayout from '../components/layout/AuthLayout.jsx';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import RoleRoute from './RoleRoute.jsx';
import LoadingSpinner from '../components/shared/LoadingSpinner.jsx';

const HomePage = lazy(() => import('../pages/HomePage.jsx'));
const AllPropertiesPage = lazy(() => import('../pages/AllPropertiesPage.jsx'));
const PropertyDetailsPage = lazy(() => import('../pages/PropertyDetailsPage.jsx'));
const PaymentPage = lazy(() => import('../pages/PaymentPage.jsx'));
const PaymentSuccessPage = lazy(() => import('../pages/PaymentSuccessPage.jsx'));
const PaymentCancelPage = lazy(() => import('../pages/PaymentCancelPage.jsx'));
const LoginPage = lazy(() => import('../pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('../pages/RegisterPage.jsx'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage.jsx'));

const TenantHomePage = lazy(() => import('../pages/tenant/TenantHomePage.jsx'));
const MyBookingsPage = lazy(() => import('../pages/tenant/MyBookingsPage.jsx'));
const FavoritesPage = lazy(() => import('../pages/tenant/FavoritesPage.jsx'));
const ProfilePage = lazy(() => import('../pages/tenant/ProfilePage.jsx'));

const OwnerHomePage = lazy(() => import('../pages/owner/OwnerHomePage.jsx'));
const BookingRequestsPage = lazy(() => import('../pages/owner/BookingRequestsPage.jsx'));
const AddPropertyPage = lazy(() => import('../pages/owner/AddPropertyPage.jsx'));
const MyPropertiesPage = lazy(() => import('../pages/owner/MyPropertiesPage.jsx'));
const EditPropertyPage = lazy(() => import('../pages/owner/EditPropertyPage.jsx'));


const AdminHomePage = lazy(() => import('../pages/admin/AdminHomePage.jsx'));
const AdminPropertiesPage = lazy(() => import('../pages/admin/AdminPropertiesPage.jsx'));
const AdminUsersPage = lazy(() => import('../pages/admin/AdminUsersPage.jsx'));
const AdminBookingsPage = lazy(() => import('../pages/admin/AdminBookingsPage.jsx'));
const AdminTransactionsPage = lazy(() => import('../pages/admin/AdminTransactionsPage.jsx'));
const AdminEditPropertyPage = lazy(() => import('../pages/admin/AdminEditPropertyPage.jsx'));


const AppRoutes = () => {
  return (
    <BrowserRouter>
        <Suspense fallback={<LoadingSpinner fullScreen message="Loading page..." />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="properties" element={<AllPropertiesPage />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route element={<PublicLayout />}>
              <Route path="properties/:id" element={<PropertyDetailsPage />} />
              <Route
                path="payment/success"
                element={
                  <RoleRoute roles={['tenant']}>
                    <PaymentSuccessPage />
                  </RoleRoute>
                }
              />
              <Route
                path="payment/cancel"
                element={
                  <RoleRoute roles={['tenant']}>
                    <PaymentCancelPage />
                  </RoleRoute>
                }
              />
              <Route
                path="payment/:bookingId"
                element={
                  <RoleRoute roles={['tenant']}>
                    <PaymentPage />
                  </RoleRoute>
                }
              />
            </Route>

            <Route
              element={
                <RoleRoute roles={['tenant']}>
                  <DashboardLayout role="tenant" />
                </RoleRoute>
              }
            >
              <Route path="dashboard/tenant" element={<TenantHomePage />} />
              <Route path="dashboard/tenant/bookings" element={<MyBookingsPage />} />
              <Route path="dashboard/tenant/favorites" element={<FavoritesPage />} />
              <Route path="dashboard/tenant/profile" element={<ProfilePage />} />
            </Route>

            <Route
              element={
                <RoleRoute roles={['owner']}>
                  <DashboardLayout role="owner" />
                </RoleRoute>
              }
            >
              <Route path="dashboard/owner" element={<OwnerHomePage />} />
              <Route path="dashboard/owner/bookings" element={<BookingRequestsPage />} />
              <Route path="dashboard/owner/add-property" element={<AddPropertyPage />} />
              <Route path="dashboard/owner/properties" element={<MyPropertiesPage />} />
              <Route path="dashboard/owner/edit-property/:id" element={<EditPropertyPage />} />
              <Route path="dashboard/owner/profile" element={<ProfilePage />} />
            </Route>

            <Route
              element={
                <RoleRoute roles={['admin']}>
                  <DashboardLayout role="admin" />
                </RoleRoute>
              }
            >
              <Route path="dashboard/admin" element={<AdminHomePage />} />
              <Route path="dashboard/admin/users" element={<AdminUsersPage />} />
              <Route path="dashboard/admin/properties" element={<AdminPropertiesPage />} />
              <Route path="dashboard/admin/edit-property/:id" element={<AdminEditPropertyPage />} />
              <Route path="dashboard/admin/bookings" element={<AdminBookingsPage />} />
              <Route path="dashboard/admin/transactions" element={<AdminTransactionsPage />} />
              <Route path="dashboard/admin/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          <Route path="dashboard" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
