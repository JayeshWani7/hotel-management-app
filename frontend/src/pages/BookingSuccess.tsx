import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import {
  CheckCircle,
  Hotel,
  Download,
  Home,
  CalendarToday,
} from '@mui/icons-material';

const BookingSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state;

  if (!bookingData) {
    navigate('/hotels');
    return null;
  }

  const {
    hotel,
    room,
    checkInDate,
    checkOutDate,
    guests,
    nights,
    finalAmount,
    transactionId,
    bookingId,
  } = bookingData;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        {/* Success Header */}
        <Box mb={4}>
          <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom color="success.main">
            Booking Confirmed!
          </Typography>
          <Typography variant="h6" color="text.secondary" mb={2}>
            Your reservation has been successfully created
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Booking ID: <strong>{bookingId}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Transaction ID: {transactionId}
          </Typography>
        </Box>

        {/* Hotel Details */}
        <Card sx={{ mb: 4, textAlign: 'left' }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={3}>
              <Hotel color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">{hotel.name}</Typography>
            </Box>
            
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={3}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Check-in
                </Typography>
                <Typography variant="body1" fontWeight="medium" mb={2}>
                  {new Date(checkInDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Room Type
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {room.type}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Check-out
                </Typography>
                <Typography variant="body1" fontWeight="medium" mb={2}>
                  {new Date(checkOutDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Guests
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {guests} {guests === 1 ? 'Guest' : 'Guests'}
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">
                Total Paid
              </Typography>
              <Typography variant="h6" color="primary">
                ₹{finalAmount.toLocaleString()}
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" mt={1}>
              Duration: {nights} {nights === 1 ? 'night' : 'nights'}
            </Typography>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card sx={{ mb: 4, bgcolor: 'primary.50', textAlign: 'left' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Important Information
            </Typography>
            
            <Box mb={2}>
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                Check-in Instructions:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Check-in time: {hotel.checkInTime || '2:00 PM'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Please carry a valid government ID
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Present this booking confirmation at the front desk
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                Contact Hotel:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Phone: {hotel.phone}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: {hotel.email}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} justifyContent="center" mb={4}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<Download />}
            sx={{ minWidth: 200 }}
          >
            Download Receipt
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            startIcon={<CalendarToday />}
            onClick={() => navigate('/bookings')}
            sx={{ minWidth: 200 }}
          >
            View My Bookings
          </Button>
          
          <Button
            variant="contained"
            size="large"
            startIcon={<Home />}
            onClick={() => navigate('/dashboard')}
            sx={{ minWidth: 200 }}
          >
            Go to Dashboard
          </Button>
        </Box>

        {/* Thank You Message */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Thank you for choosing us!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            We've sent a confirmation email with all the details. 
            Have a wonderful stay at {hotel.name}!
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default BookingSuccess;