import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './layouts/Layout';
import CustomerDashboard from './pages/customer/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import BookingManagement from './pages/admin/BookingManagement';
import AdminHotelManagement from './pages/admin/HotelManagement';
import Hotels from './pages/customer/Hotels';
import ProfilePage from './pages/ProfilePage';
import HotelBooking from './components/bookings/HotelBooking';
import BookingConfirmation from './pages/BookingConfirmation';
import Payment from './pages/Payment';
import BookingSuccess from './pages/BookingSuccess';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { UserRole } from './types';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: UserRole[] }> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && allowedRoles.length > 0) {
    const hasPermission = allowedRoles.some(role => 
      role === user.role || 
      role.toLowerCase() === user.role?.toLowerCase()
    );
    
    if (!hasPermission) {
      console.log('Access denied. User role:', user.role, 'Allowed roles:', allowedRoles);
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  return <Layout>{children}</Layout>;
};

// Public Route Component (redirect if already logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (isAuthenticated && user) {
    // Redirect based on user role
    switch (user.role.toLowerCase()) {
      case UserRole.ADMIN:
        return <Navigate to="/admin/dashboard" replace />;
      case UserRole.HOTEL_MANAGER:
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      
      {/* Customer Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={[UserRole.USER]}>
          <CustomerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/hotels" element={
        <ProtectedRoute allowedRoles={[UserRole.USER, UserRole.ADMIN, UserRole.HOTEL_MANAGER]}>
          <Hotels />
        </ProtectedRoute>
      } />
      <Route path="/bookings" element={
        <ProtectedRoute allowedRoles={[UserRole.USER]}>
          <div style={{ padding: '2rem' }}>
            <h2>My Bookings</h2>
            <p>Booking management page coming soon...</p>
          </div>
        </ProtectedRoute>
      } />
      <Route path="/payments" element={
        <ProtectedRoute allowedRoles={[UserRole.USER]}>
          <div style={{ padding: '2rem' }}>
            <h2>Payment History</h2>
            <p>Payment history page coming soon...</p>
          </div>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      <Route path="/book-hotel/:hotelId" element={
        <ProtectedRoute allowedRoles={[UserRole.USER]}>
          <HotelBooking />
        </ProtectedRoute>
      } />
      <Route path="/booking-confirmation" element={
        <ProtectedRoute allowedRoles={[UserRole.USER]}>
          <BookingConfirmation />
        </ProtectedRoute>
      } />
      <Route path="/payment" element={
        <ProtectedRoute allowedRoles={[UserRole.USER]}>
          <Payment />
        </ProtectedRoute>
      } />
      <Route path="/booking-success" element={
        <ProtectedRoute allowedRoles={[UserRole.USER]}>
          <BookingSuccess />
        </ProtectedRoute>
      } />
      
      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.HOTEL_MANAGER]}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/hotels" element={
        <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.HOTEL_MANAGER]}>
          <AdminHotelManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/rooms" element={
        <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.HOTEL_MANAGER]}>
          <div style={{ padding: '2rem' }}>
            <h2>Manage Rooms</h2>
            <p>Room management page coming soon...</p>
          </div>
        </ProtectedRoute>
      } />
      <Route path="/admin/bookings" element={
        <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.HOTEL_MANAGER]}>
          <BookingManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
          <div style={{ padding: '2rem' }}>
            <h2>User Management</h2>
            <p>User management page coming soon...</p>
          </div>
        </ProtectedRoute>
      } />
      <Route path="/admin/reports" element={
        <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.HOTEL_MANAGER]}>
          <div style={{ padding: '2rem' }}>
            <h2>Revenue Reports</h2>
            <p>Revenue reporting page coming soon...</p>
          </div>
        </ProtectedRoute>
      } />
      
      {/* Unauthorized page */}
      <Route path="/unauthorized" element={
        <Layout>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>Unauthorized Access</h2>
            <p>You don't have permission to access this page.</p>
          </div>
        </Layout>
      } />
      
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App
