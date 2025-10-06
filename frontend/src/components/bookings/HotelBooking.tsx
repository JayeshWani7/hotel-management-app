import React from 'react';
import { Container, Typography, Alert } from '@mui/material';

const HotelBooking: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Alert severity="info">
        <Typography variant="h5">Hotel Booking Component</Typography>
        <Typography>This component is temporarily simplified after resolving merge conflicts.</Typography>
      </Alert>
    </Container>
  );
};

export default HotelBooking;
