import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Divider,
  Chip,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const getRoleDisplayName = () => {
    switch (user.role) {
      case UserRole.ADMIN:
        return 'Administrator';
      case UserRole.HOTEL_MANAGER:
        return 'Hotel Manager';
      case UserRole.USER:
        return 'Customer';
      default:
        return user.role;
    }
  };

  const getRoleColor = () => {
    switch (user.role) {
      case UserRole.ADMIN:
        return 'error';
      case UserRole.HOTEL_MANAGER:
        return 'warning';
      case UserRole.USER:
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Box display="flex" alignItems="center" mb={4}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              fontSize: '2rem',
              bgcolor: 'primary.main',
              mr: 3 
            }}
          >
            {user.firstName[0]}{user.lastName[0]}
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {user.firstName} {user.lastName}
            </Typography>
            <Chip
              label={getRoleDisplayName()}
              color={getRoleColor() as any}
              size="medium"
            />
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="h6" gutterBottom>
            Account Information
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Email:</strong> {user.email}
            </Typography>
            
            {user.phone && (
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Phone:</strong> {user.phone}
              </Typography>
            )}
            
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Status:</strong> {user.isActive ? (
                <Chip label="Active" color="success" size="small" sx={{ ml: 1 }} />
              ) : (
                <Chip label="Inactive" color="error" size="small" sx={{ ml: 1 }} />
              )}
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}
            </Typography>
            
            <Typography variant="body1">
              <strong>Last Updated:</strong> {new Date(user.updatedAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 4, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Profile management features coming soon! You'll be able to update your personal information, 
            change your password, and manage your preferences.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;