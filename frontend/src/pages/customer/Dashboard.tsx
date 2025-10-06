import React from 'react';
import { useQuery } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
} from '@mui/material';
import { Hotel, BookOnline, Payment } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { GET_USER_BOOKINGS } from '../../graphql/bookingQueries';

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { data, loading, error } = useQuery(GET_USER_BOOKINGS, {
    variables: { userId: user?.id },
    skip: !user?.id,
  });
  const navigate = useNavigate();

  const bookings = (data as any)?.getBookings ?? [];
  const upcomingBookings = bookings.filter((b: any) => ['PENDING', 'CONFIRMED'].includes((b.status || '').toUpperCase())).length;
  const completedBookings = bookings.filter((b: any) => (b.status || '').toUpperCase() === 'COMPLETED').length;
  const totalSpent = bookings.filter((b: any) => (b.status || '').toUpperCase() === 'COMPLETED').reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0);

  const quickActions = [
    {
      title: 'Browse Hotels',
      description: 'Find and book your next stay',
      icon: <Hotel />,
      path: '/hotels',
      color: 'primary' as const,
    },
    {
      title: 'My Bookings',
      description: 'View and manage your reservations',
      icon: <BookOnline />,
      path: '/bookings',
      color: 'secondary' as const,
    },
    {
      title: 'Payment History',
      description: 'Check your transaction history',
      icon: <Payment />,
      path: '/payments',
      color: 'success' as const,
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      {/* Welcome Section */}
      <Box mb={{ xs: 3, md: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' } }}
        >
          Welcome back, {user?.firstName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your bookings and explore new destinations
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box 
        display="grid" 
        gridTemplateColumns={{ 
          xs: '1fr', 
          sm: 'repeat(2, 1fr)', 
          md: 'repeat(3, 1fr)' 
        }}
        gap={{ xs: 2, sm: 2.5, md: 3 }} 
        mb={{ xs: 3, md: 4 }}
      >
        <Paper sx={{ p: { xs: 2, sm: 2.5, md: 3 }, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            color="primary" 
            gutterBottom
            sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}
          >
            {loading ? '…' : upcomingBookings}
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' } }}
          >
            Upcoming Bookings
          </Typography>
        </Paper>
        
        <Paper sx={{ p: { xs: 2, sm: 2.5, md: 3 }, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            color="secondary" 
            gutterBottom
            sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}
          >
            {loading ? '…' : completedBookings}
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' } }}
          >
            Completed Stays
          </Typography>
        </Paper>
        
        <Paper sx={{ p: { xs: 2, sm: 2.5, md: 3 }, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            color="success.main" 
            gutterBottom
            sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}
          >
            {loading ? '…' : `₹${totalSpent.toLocaleString()}`}
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' } }}
          >
            Total Spent
          </Typography>
        </Paper>
      </Box>

      {/* Quick Actions */}
      <Box mb={4}>
        <Typography variant="h5" component="h2" gutterBottom>
          Quick Actions
        </Typography>
        <Box 
          display="grid" 
          gridTemplateColumns={{ 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            lg: 'repeat(3, 1fr)' 
          }}
          gap={{ xs: 2, sm: 2.5, md: 3 }}
        >
          {quickActions.map((action) => (
            <Paper 
              key={action.title} 
              sx={{ 
                p: { xs: 2, sm: 2.5, md: 3 }, 
                display: 'flex', 
                alignItems: 'center', 
                gap: { xs: 1.5, md: 2 },
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
                minHeight: { xs: '80px', sm: 'auto' }
              }}
              onClick={() => navigate(action.path)}
            >
              <Box 
                sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  bgcolor: `${action.color}.light`,
                  color: `${action.color}.contrastText`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {action.icon}
              </Box>
              <Box flex={1}>
                <Typography variant="h6" gutterBottom>
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {action.description}
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* Recent Activity */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        {error ? (
          <Typography variant="body2" color="error">Failed to load activity: {error.message}</Typography>
        ) : (
          <Box>
            {(bookings || []).slice(0, 3).map((b: any) => (
              <Typography key={b.id} variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                • {String(b.status).toUpperCase()} - {new Date(b.checkInDate).toLocaleDateString()} at Room {b?.room?.roomNumber}
              </Typography>
            ))}
            {!loading && bookings.length === 0 && (
              <Typography variant="body2" color="text.secondary">No recent activity</Typography>
            )}
          </Box>
        )}
        <Button variant="outlined" sx={{ mt: 2 }}>
          View All Activity
        </Button>
      </Paper>
    </Container>
  );
};

export default CustomerDashboard;