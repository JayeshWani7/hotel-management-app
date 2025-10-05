import React from 'react';
import { Box } from '@mui/material';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header onMenuClick={handleMenuClick} />
      
      <Sidebar 
        open={sidebarOpen} 
        onClose={handleSidebarClose} 
      />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 8, sm: 8, md: 9 }, // Account for fixed header
          px: { xs: 1, sm: 2, md: 3 }, // Responsive padding
          minHeight: '100vh',
          bgcolor: 'background.default',
          width: { xs: '100%', sm: 'auto' },
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;