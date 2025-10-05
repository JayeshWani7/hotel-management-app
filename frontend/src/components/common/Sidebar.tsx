import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
} from '@mui/material';
import {
  Dashboard,
  Hotel,
  MeetingRoom,
  BookOnline,
  Payment,
  People,
  Analytics,
  Settings,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const drawerWidth = 260;

  const customerMenuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Browse Hotels', icon: <Hotel />, path: '/hotels' },
    { text: 'My Bookings', icon: <BookOnline />, path: '/bookings' },
    { text: 'Payment History', icon: <Payment />, path: '/payments' },
  ];

  const adminMenuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
    { text: 'Manage Hotels', icon: <Hotel />, path: '/admin/hotels' },
    { text: 'Manage Rooms', icon: <MeetingRoom />, path: '/admin/rooms' },
    { text: 'All Bookings', icon: <BookOnline />, path: '/admin/bookings' },
    { text: 'Payments', icon: <Payment />, path: '/admin/payments' },
    { text: 'Users', icon: <People />, path: '/admin/users' },
    { text: 'Analytics', icon: <Analytics />, path: '/admin/analytics' },
    { text: 'Settings', icon: <Settings />, path: '/admin/settings' },
  ];

  const hotelManagerMenuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/manager/dashboard' },
    { text: 'My Hotels', icon: <Hotel />, path: '/manager/hotels' },
    { text: 'Rooms', icon: <MeetingRoom />, path: '/manager/rooms' },
    { text: 'Bookings', icon: <BookOnline />, path: '/manager/bookings' },
    { text: 'Payments', icon: <Payment />, path: '/manager/payments' },
    { text: 'Analytics', icon: <Analytics />, path: '/manager/analytics' },
  ];

  const getMenuItems = () => {
    if (!user) return customerMenuItems;
    
    switch (user.role) {
      case UserRole.ADMIN:
        return adminMenuItems;
      case UserRole.HOTEL_MANAGER:
        return hotelManagerMenuItems;
      default:
        return customerMenuItems;
    }
  };

  const getRoleDisplayName = () => {
    if (!user) return 'Guest';
    
    switch (user.role) {
      case UserRole.ADMIN:
        return 'Administrator';
      case UserRole.HOTEL_MANAGER:
        return 'Hotel Manager';
      default:
        return 'Customer';
    }
  };

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '280px', sm: drawerWidth },
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" noWrap component="div">
          {user ? `${user.firstName} ${user.lastName}` : 'Guest'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {getRoleDisplayName()}
        </Typography>
      </Box>
      
      <Divider />
      
      <List>
        {getMenuItems().map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => {
              navigate(item.path);
              onClose();
            }}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;