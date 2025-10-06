import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
} from '@mui/material';
import {
  DatePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  LocationOn,
  Star,
  Person,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useQuery } from '@apollo/client/react';
import { GET_HOTEL } from '../../graphql/hotelQueries';
import { GET_AVAILABLE_ROOMS, GET_ROOMS } from '../../graphql/roomQueries';
import type { Hotel } from '../../types';

interface BookingFormData {
  checkInDate: Date | null;
  checkOutDate: Date | null;
  guests: number;
  roomType: string;
  specialRequests: string;
}

const HotelBooking: React.FC = () => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    defaultValues: {
      checkInDate: null,
      checkOutDate: null,
      guests: 1,
      roomType: '',
      specialRequests: '',
    },
  });

  const watchCheckIn = watch('checkInDate');
  const watchCheckOut = watch('checkOutDate');
  const watchGuests = watch('guests');

  const { data: hotelData, loading: hotelLoading, error: hotelError } = useQuery(GET_HOTEL as any, { variables: { id: hotelId }, skip: !hotelId });
  const hotel: Hotel | undefined = (hotelData as any)?.getHotel;

  const { data: availableRoomsData } = useQuery(GET_AVAILABLE_ROOMS as any, {
    variables: hotel && watchCheckIn && watchCheckOut ? {
      hotelId: hotel.id,
      checkInDate: watchCheckIn?.toISOString(),
      checkOutDate: watchCheckOut?.toISOString(),
    } : undefined,
    skip: !hotel || !watchCheckIn || !watchCheckOut,
  });

  // Fallback: list all rooms for the hotel when dates are not chosen yet
  const { data: roomsData } = useQuery(GET_ROOMS as any, {
    variables: { hotelId: hotel?.id },
    skip: !hotel || !!(watchCheckIn && watchCheckOut),
  });

  const roomTypes = useMemo(() => {
    const rooms = (availableRoomsData as any)?.getAvailableRooms || (roomsData as any)?.getRooms || (hotel as any)?.rooms || [];
    return rooms.map((r: any) => ({
      id: r.id,
      type: r.type,
      price: r.pricePerNight,
      description: r.description || '',
      amenities: r.amenities || [],
      capacity: r.capacity || 1,
    }));
  }, [availableRoomsData, roomsData, hotel]);

  const calculateNights = () => {
    if (watchCheckIn && watchCheckOut) {
      const diffTime = Math.abs(watchCheckOut.getTime() - watchCheckIn.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const calculateTotal = () => {
    if (selectedRoom) {
      const nights = calculateNights();
      return nights * selectedRoom.price;
    }
    return 0;
  };

  const onSubmit = async (data: BookingFormData) => {
    if (!selectedRoom) {
      alert('Please select a room type');
      return;
    }

    const bookingData = {
      hotel: hotel!,
      room: selectedRoom,
      ...data,
      nights: calculateNights(),
      totalAmount: calculateTotal(),
    };
    // Proceed to confirmation first to let user review
    navigate('/booking-confirmation', { state: bookingData });
  };

  if (hotelLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading hotel...</Typography>
      </Container>
    );
  }

  if (hotelError || !hotel) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error">{hotelError ? String(hotelError.message) : 'Hotel not found'}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hotel Information */}
      <Card sx={{ mb: 4 }}>
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }}>
          <Box sx={{ width: { xs: '100%', md: '400px' } }}>
            <CardMedia
              component="img"
              height="300"
              image={"https://placehold.co/600x400"}
              alt={hotel?.name || 'Hotel'}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {hotel?.name || 'Hotel'}
              </Typography>
              <Box display="flex" alignItems="center" mb={2}>
                <LocationOn color="action" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {hotel?.address || '—'}, {hotel?.city || '—'}, {hotel?.state || '—'}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={2}>
                <Star color="warning" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  {(hotel?.rating ?? 0)} Rating
                </Typography>
              </Box>
              <Typography variant="body1" paragraph>
                {hotel?.description || ''}
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {hotel?.amenities?.map((amenity) => (
                  <Chip
                    key={amenity}
                    label={amenity}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </CardContent>
          </Box>
        </Box>
      </Card>

      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
        {/* Booking Form */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Book Your Stay
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={3}>
                  <Controller
                    name="checkInDate"
                    control={control}
                    rules={{ required: 'Check-in date is required' }}
                    render={({ field }) => (
                      <DatePicker
                        label="Check-in Date"
                        {...field}
                        minDate={new Date()}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.checkInDate,
                            helperText: errors.checkInDate?.message,
                          },
                        }}
                      />
                    )}
                  />
                  
                  <Controller
                    name="checkOutDate"
                    control={control}
                    rules={{ required: 'Check-out date is required' }}
                    render={({ field }) => (
                      <DatePicker
                        label="Check-out Date"
                        {...field}
                        minDate={watchCheckIn || new Date()}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.checkOutDate,
                            helperText: errors.checkOutDate?.message,
                          },
                        }}
                      />
                    )}
                  />
                </Box>

                <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={3}>
                  <Controller
                    name="guests"
                    control={control}
                    rules={{ 
                      required: 'Number of guests is required',
                      min: { value: 1, message: 'At least 1 guest required' }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Number of Guests"
                        type="number"
                        fullWidth
                        error={!!errors.guests}
                        helperText={errors.guests?.message}
                        inputProps={{ min: 1, max: 10 }}
                      />
                    )}
                  />

                  <Controller
                    name="specialRequests"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Special Requests (Optional)"
                        multiline
                        rows={2}
                        fullWidth
                        placeholder="Any special requirements..."
                      />
                    )}
                  />
                </Box>
              </LocalizationProvider>
            </Box>
          </Paper>

          {/* Room Selection */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Select Room Type
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              {roomTypes
                .filter((room: any) => room.capacity >= (watchGuests || 1))
                .map((room: any) => (
                    <Card
                      key={room.id}
                      sx={{
                        cursor: 'pointer',
                        border: selectedRoom?.id === room.id ? 2 : 1,
                        borderColor: selectedRoom?.id === room.id ? 'primary.main' : 'divider',
                        '&:hover': {
                          boxShadow: 4,
                        },
                      }}
                      onClick={() => setSelectedRoom(room)}
                    >
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                          <Typography variant="h6">{room.type}</Typography>
                          <Typography variant="h6" color="primary">
                            ₹{room.price.toLocaleString()}/night
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {room.description}
                        </Typography>
                        <Box display="flex" alignItems="center" mb={2}>
                          <Person sx={{ mr: 1, fontSize: 20 }} />
                          <Typography variant="body2">Max {room.capacity} guests</Typography>
                        </Box>
                        <Box display="flex" flexWrap="wrap" gap={1}>
                          {room.amenities.map((amenity: any) => (
                            <Chip
                              key={amenity}
                              label={amenity}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
            </Box>
          </Paper>
        </Box>

        {/* Booking Summary */}
        <Box sx={{ width: { xs: '100%', md: '350px' } }}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Booking Summary
            </Typography>
            
            {watchCheckIn && watchCheckOut && (
              <>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography variant="body2">Check-in:</Typography>
                  <Typography variant="body2">
                    {watchCheckIn.toLocaleDateString()}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography variant="body2">Check-out:</Typography>
                  <Typography variant="body2">
                    {watchCheckOut.toLocaleDateString()}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography variant="body2">Nights:</Typography>
                  <Typography variant="body2">{calculateNights()}</Typography>
                </Box>
              </>
            )}
            
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="body2">Guests:</Typography>
              <Typography variant="body2">{watchGuests}</Typography>
            </Box>
            
            {selectedRoom && (
              <>
                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography variant="body2">Room Type:</Typography>
                  <Typography variant="body2">{selectedRoom.type}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography variant="body2">Rate per night:</Typography>
                  <Typography variant="body2">
                    ₹{selectedRoom.price.toLocaleString()}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="space-between" mb={3}>
                  <Typography variant="h6">Total Amount:</Typography>
                  <Typography variant="h6" color="primary">
                    ₹{calculateTotal().toLocaleString()}
                  </Typography>
                </Box>
              </>
            )}
            
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleSubmit(onSubmit)}
              disabled={!watchCheckIn || !watchCheckOut || !selectedRoom}
            >
              Continue to Payment
            </Button>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default HotelBooking;