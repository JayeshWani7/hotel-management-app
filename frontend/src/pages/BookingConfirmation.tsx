import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import {
  Hotel,
  LocationOn,
  CalendarToday,
  Person,
  MeetingRoom,
  Payment as PaymentIcon,
} from '@mui/icons-material';

interface BookingData {
  hotel: any;
  room: any;
  checkInDate: Date;
  checkOutDate: Date;
  guests: number;
  specialRequests: string;
  nights: number;
  totalAmount: number;
}

const BookingConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state as BookingData;

  if (!bookingData) {
    // Redirect if no booking data
    navigate('/hotels');
    return null;
  }

  const {
    hotel,
    room,
    checkInDate,
    checkOutDate,
    guests,
    specialRequests,
    nights,
    totalAmount,
  } = bookingData;

  const taxes = Math.round(totalAmount * 0.18); // 18% GST
  const finalAmount = totalAmount + taxes;

  const handleConfirmBooking = () => {
    // Navigate to payment page with booking data
    navigate('/payment', {
      state: {
        ...bookingData,
        taxes,
        finalAmount,
      },
    });
  };

  const handleEditBooking = () => {
    // Go back to booking form
    navigate(`/book-hotel/${hotel.id}`, {
      state: bookingData,
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom textAlign="center">
          Booking Confirmation
        </Typography>
        
        <Typography variant="body1" color="text.secondary" textAlign="center" mb={4}>
          Please review your booking details before proceeding to payment
        </Typography>

        {/* Hotel Details */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Hotel color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">{hotel.name}</Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={2}>
              <LocationOn color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {hotel.address}, {hotel.city}, {hotel.state}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {hotel.description}
            </Typography>
          </CardContent>
        </Card>

        {/* Booking Details */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Booking Details
            </Typography>
            
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={3}>
              <Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <CalendarToday color="action" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      Check-in
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(checkInDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Typography>
                  </Box>
                </Box>
                
                <Box display="flex" alignItems="center" mb={2}>
                  <Person color="action" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      Guests
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {guests} {guests === 1 ? 'Guest' : 'Guests'}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <CalendarToday color="action" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      Check-out
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(checkOutDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Typography>
                  </Box>
                </Box>
                
                <Box display="flex" alignItems="center" mb={2}>
                  <MeetingRoom color="action" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      Room Type
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {room.type}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box mt={2}>
              <Typography variant="body2" fontWeight="medium" mb={1}>
                Duration: {nights} {nights === 1 ? 'Night' : 'Nights'}
              </Typography>
            </Box>

            {specialRequests && (
              <Box mt={2}>
                <Typography variant="body2" fontWeight="medium" mb={1}>
                  Special Requests:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {specialRequests}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Room Details */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Room Information
            </Typography>
            
            <Box mb={2}>
              <Typography variant="body1" fontWeight="medium">
                {room.type}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                {room.description}
              </Typography>
              
              <Typography variant="body2" fontWeight="medium" mb={1}>
                Amenities:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {room.amenities.map((amenity: string) => (
                  <Chip
                    key={amenity}
                    label={amenity}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Price Breakdown */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Price Breakdown
            </Typography>
            
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2">
                {room.type} × {nights} {nights === 1 ? 'night' : 'nights'}
              </Typography>
              <Typography variant="body2">
                ₹{totalAmount.toLocaleString()}
              </Typography>
            </Box>
            
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2">
                Taxes & Fees (18% GST)
              </Typography>
              <Typography variant="body2">
                ₹{taxes.toLocaleString()}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6">
                Total Amount
              </Typography>
              <Typography variant="h6" color="primary">
                ₹{finalAmount.toLocaleString()}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} justifyContent="center">
          <Button
            variant="outlined"
            size="large"
            onClick={handleEditBooking}
            sx={{ minWidth: 200 }}
          >
            Edit Booking
          </Button>
          
          <Button
            variant="contained"
            size="large"
            startIcon={<PaymentIcon />}
            onClick={handleConfirmBooking}
            sx={{ minWidth: 200 }}
          >
            Proceed to Payment
          </Button>
        </Box>

        {/* Cancellation Policy */}
        <Paper sx={{ mt: 4, p: 3, bgcolor: 'grey.50' }}>
          <Typography variant="h6" gutterBottom>
            Cancellation Policy
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Free cancellation until 24 hours before check-in
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • 50% refund if cancelled between 24-6 hours before check-in
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • No refund if cancelled within 6 hours of check-in
          </Typography>
        </Paper>
      </Paper>
    </Container>
  );
};

export default BookingConfirmation;