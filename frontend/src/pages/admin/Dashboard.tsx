import React from 'react';
import { useQuery } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Divider,
} from '@mui/material';
import {
  Hotel,
  MeetingRoom,
  BookOnline,
  Payment,
  People,
  TrendingUp,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { GET_HOTELS } from '../../graphql/hotelQueries';
import { GET_ALL_BOOKINGS } from '../../graphql/bookingQueries';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: hotelsData, loading: hotelsLoading } = useQuery(GET_HOTELS);
  const { data: bookingsData, loading: bookingsLoading } = useQuery(GET_ALL_BOOKINGS);
  const navigate = useNavigate();

  const hotels = hotelsData?.getHotels ?? [];
  const totalHotels = hotels.length;
  const totalRooms = hotels.reduce((sum: number, h: any) => sum + (h.rooms?.length || 0), 0);
  const bookings = bookingsData?.getAllBookings ?? [];
  const activeBookings = bookings.filter((b: any) => ['PENDING','CONFIRMED'].includes(String(b.status).toUpperCase())).length;
  const totalRevenue = bookings.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0);
  const occupancyRate = bookings.length && totalRooms ? Math.min(100, Math.round((activeBookings / totalRooms) * 1000) / 10) : 0;

  const recentActivity = [
    { action: 'New hotel registration', details: 'Luxury Suites Downtown', time: '2 hours ago' },
    { action: 'Booking confirmed', details: 'Room 205 - Grand Palace Hotel', time: '3 hours ago' },
    { action: 'Payment received', details: '₹12,500 from booking #BK-2024-001', time: '4 hours ago' },
    { action: 'User registration', details: 'john.doe@email.com', time: '6 hours ago' },
    { action: 'Room maintenance completed', details: 'Room 301 - Ocean View Resort', time: '1 day ago' },
  ];

  const quickActions = [
    { 
      title: 'Manage Hotels', 
      icon: <Hotel />, 
      color: 'primary', 
      path: '/admin/hotels', 
      description: 'Create and manage hotels',
      implemented: true
    },
    { 
      title: 'View Bookings', 
      icon: <BookOnline />, 
      color: 'info', 
      path: '/admin/bookings', 
      description: 'Manage all bookings and reservations',
      implemented: true
    },
    { 
      title: 'User Management', 
      icon: <People />, 
      color: 'warning', 
      path: '/admin/users', 
      description: 'Manage user accounts (Coming Soon)',
      implemented: false
    },
    { 
      title: 'Revenue Reports', 
      icon: <Payment />, 
      color: 'success', 
      path: '/admin/reports', 
      description: 'View revenue and analytics (Coming Soon)',
      implemented: false
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
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, {user?.firstName}! Here's your business overview.
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Box 
        display="grid" 
        gridTemplateColumns={{ 
          xs: 'repeat(2, 1fr)', 
          sm: 'repeat(3, 1fr)', 
          md: 'repeat(6, 1fr)' 
        }}
        gap={{ xs: 1.5, sm: 2, md: 3 }} 
        mb={{ xs: 3, md: 4 }}
      >
        <Paper sx={{ p: { xs: 2, sm: 2.5, md: 3 }, textAlign: 'center' }}>
          <Hotel sx={{ 
            fontSize: { xs: 28, sm: 32, md: 40 }, 
            color: 'primary.main', 
            mb: { xs: 0.5, md: 1 } 
          }} />
          <Typography 
            variant="h4" 
            color="primary" 
            gutterBottom
            sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' } }}
          >
            {hotelsLoading ? '…' : totalHotels}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            Total Hotels
          </Typography>
        </Paper>
        
        <Paper sx={{ p: { xs: 2, sm: 2.5, md: 3 }, textAlign: 'center' }}>
          <MeetingRoom sx={{ 
            fontSize: { xs: 28, sm: 32, md: 40 }, 
            color: 'secondary.main', 
            mb: { xs: 0.5, md: 1 } 
          }} />
          <Typography 
            variant="h4" 
            color="secondary" 
            gutterBottom
            sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' } }}
          >
            {hotelsLoading ? '…' : totalRooms}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            Total Rooms
          </Typography>
        </Paper>
        
        <Paper sx={{ p: { xs: 2, sm: 2.5, md: 3 }, textAlign: 'center' }}>
          <BookOnline sx={{ 
            fontSize: { xs: 28, sm: 32, md: 40 }, 
            color: 'info.main', 
            mb: { xs: 0.5, md: 1 } 
          }} />
          <Typography 
            variant="h4" 
            color="info.main" 
            gutterBottom
            sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' } }}
          >
            {bookingsLoading ? '…' : activeBookings}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            Active Bookings
          </Typography>
        </Paper>
        
        <Paper sx={{ p: { xs: 2, sm: 2.5, md: 3 }, textAlign: 'center' }}>
          <Payment sx={{ 
            fontSize: { xs: 28, sm: 32, md: 40 }, 
            color: 'success.main', 
            mb: { xs: 0.5, md: 1 } 
          }} />
          <Typography 
            variant="h4" 
            color="success.main" 
            gutterBottom
            sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2.125rem' } }}
          >
            {bookingsLoading ? '…' : `₹${(totalRevenue / 100000).toFixed(1)}L`}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            Total Revenue
          </Typography>
        </Paper>
        
        <Paper sx={{ p: { xs: 2, sm: 2.5, md: 3 }, textAlign: 'center' }}>
          <People sx={{ 
            fontSize: { xs: 28, sm: 32, md: 40 }, 
            color: 'warning.main', 
            mb: { xs: 0.5, md: 1 } 
          }} />
          <Typography 
            variant="h4" 
            color="warning.main" 
            gutterBottom
            sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2.125rem' } }}
          >
            {/* Placeholder; wire when users UI exists */}
            —
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            Total Users
          </Typography>
        </Paper>
        
        <Paper sx={{ p: { xs: 2, sm: 2.5, md: 3 }, textAlign: 'center' }}>
          <TrendingUp sx={{ 
            fontSize: { xs: 28, sm: 32, md: 40 }, 
            color: 'error.main', 
            mb: { xs: 0.5, md: 1 } 
          }} />
          <Typography 
            variant="h4" 
            color="error.main" 
            gutterBottom
            sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' } }}
          >
            {hotelsLoading || bookingsLoading ? '…' : `${occupancyRate}%`}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            Occupancy Rate
          </Typography>
        </Paper>
      </Box>

      {/* Quick Actions */}
      <Box mb={4}>
        <Typography variant="h5" component="h2" gutterBottom>
          Quick Actions
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Access key management features with one click
        </Typography>
        <Box 
          display="grid" 
          gridTemplateColumns={{ 
            xs: 'repeat(2, 1fr)', 
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)' 
          }}
          gap={{ xs: 1.5, sm: 2 }}
        >
          {quickActions.map((action) => (
            <Paper
              key={action.title}
              sx={{ 
                p: { xs: 2, sm: 2.5 },
                cursor: action.implemented ? 'pointer' : 'not-allowed',
                opacity: action.implemented ? 1 : 0.7,
                transition: 'all 0.2s',
                '&:hover': action.implemented ? {
                  boxShadow: 3,
                  transform: 'translateY(-2px)'
                } : {},
                position: 'relative'
              }}
              onClick={() => action.implemented && navigate(action.path)}
            >
              <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                <Box 
                  sx={{ 
                    color: action.implemented ? `${action.color}.main` : 'text.disabled',
                    mb: 1.5
                  }}
                >
                  {React.cloneElement(action.icon, { 
                    sx: { fontSize: { xs: 32, sm: 40 } } 
                  })}
                </Box>
                <Typography 
                  variant="h6" 
                  component="h3" 
                  gutterBottom
                  sx={{ 
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    fontWeight: 600,
                    color: action.implemented ? 'inherit' : 'text.disabled'
                  }}
                >
                  {action.title}
                </Typography>
                {action.description && (
                  <Typography 
                    variant="body2" 
                    color={action.implemented ? "text.secondary" : "text.disabled"}
                    sx={{ 
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      lineHeight: 1.4
                    }}
                  >
                    {action.description}
                  </Typography>
                )}
                {action.implemented && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'success.main'
                    }}
                  />
                )}
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
        <Divider sx={{ mb: 2 }} />
        
        <Box>
          {recentActivity.map((activity, index) => (
            <Box key={index} sx={{ mb: 2, pb: 2, borderBottom: index < recentActivity.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
              <Typography variant="body1" fontWeight="medium">
                {activity.action}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {activity.details}
              </Typography>
              <Typography variant="caption" color="text.disabled">
                {activity.time}
              </Typography>
            </Box>
          ))}
        </Box>
        
        <Button variant="outlined" sx={{ mt: 2 }}>
          View All Activity
        </Button>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;