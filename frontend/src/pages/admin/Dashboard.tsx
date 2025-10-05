import React from 'react';
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

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const mockStats = {
    totalHotels: 15,
    totalRooms: 234,
    activeBookings: 89,
    totalRevenue: 2456700,
    totalUsers: 1247,
    occupancyRate: 78.5,
  };

  const recentActivity = [
    { action: 'New hotel registration', details: 'Luxury Suites Downtown', time: '2 hours ago' },
    { action: 'Booking confirmed', details: 'Room 205 - Grand Palace Hotel', time: '3 hours ago' },
    { action: 'Payment received', details: '₹12,500 from booking #BK-2024-001', time: '4 hours ago' },
    { action: 'User registration', details: 'john.doe@email.com', time: '6 hours ago' },
    { action: 'Room maintenance completed', details: 'Room 301 - Ocean View Resort', time: '1 day ago' },
  ];

  const quickActions = [
    { title: 'Add Hotel', icon: <Hotel />, color: 'primary', path: '/admin/hotels' },
    { title: 'Add Room', icon: <MeetingRoom />, color: 'secondary', path: '/admin/rooms' },
    { title: 'View Bookings', icon: <BookOnline />, color: 'info', path: '/admin/bookings' },
    { title: 'Revenue Report', icon: <Payment />, color: 'success', path: '/admin/reports' },
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
            {mockStats.totalHotels}
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
            {mockStats.totalRooms}
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
            {mockStats.activeBookings}
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
            ₹{(mockStats.totalRevenue / 100000).toFixed(1)}L
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
            {mockStats.totalUsers.toLocaleString()}
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
            {mockStats.occupancyRate}%
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
        <Box 
          display="grid" 
          gridTemplateColumns={{ 
            xs: 'repeat(2, 1fr)', 
            sm: 'repeat(4, 1fr)' 
          }}
          gap={{ xs: 1.5, sm: 2 }}
        >
          {quickActions.map((action) => (
            <Button
              key={action.title}
              variant="outlined"
              size={window.innerWidth < 600 ? "medium" : "large"}
              startIcon={action.icon}
              onClick={() => navigate(action.path)}
              sx={{ 
                p: { xs: 1.5, sm: 2 },
                height: 'auto',
                flexDirection: 'column',
                gap: { xs: 0.5, sm: 1 },
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
              }}
            >
              {action.title}
            </Button>
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