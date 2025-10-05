import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import type { Room } from '../../types';

interface BookingFormProps {
  open: boolean;
  room: Room | null;
  onClose: () => void;
  onSubmit: (data: BookingFormData) => void;
  loading?: boolean;
}

export interface BookingFormData {
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  specialRequests?: string;
}

const BookingForm: React.FC<BookingFormProps> = ({
  open,
  room,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const { control, handleSubmit, watch, setValue } = useForm<BookingFormData>({
    defaultValues: {
      checkInDate: '',
      checkOutDate: '',
      numberOfGuests: 1,
      specialRequests: '',
    },
  });

  const checkInDate = watch('checkInDate');
  const checkOutDate = watch('checkOutDate');
  const numberOfGuests = watch('numberOfGuests');

  // Calculate number of nights and total amount
  const calculateStayDetails = () => {
    if (!checkInDate || !checkOutDate || !room) {
      return { nights: 0, totalAmount: 0 };
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.max(0, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
    const totalAmount = nights * room.pricePerNight;

    return { nights, totalAmount };
  };

  const { nights, totalAmount } = calculateStayDetails();

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  React.useEffect(() => {
    // Auto-set checkout date to next day when checkin is selected
    if (checkInDate && !checkOutDate) {
      const nextDay = new Date(checkInDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setValue('checkOutDate', nextDay.toISOString().split('T')[0]);
    }
  }, [checkInDate, checkOutDate, setValue]);

  const onFormSubmit = (data: BookingFormData) => {
    onSubmit(data);
  };

  if (!room) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5">Book Room {room.roomNumber}</Typography>
        <Typography variant="body2" color="text.secondary">
          {room.type.replace('_', ' ')} • {room.hotel?.name || 'Hotel'}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          {/* Date Selection */}
          <Box display="flex" gap={2} mb={3}>
            <Controller
              name="checkInDate"
              control={control}
              rules={{ required: 'Check-in date is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Check-in Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: today }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            
            <Controller
              name="checkOutDate"
              control={control}
              rules={{ 
                required: 'Check-out date is required',
                validate: (value) => {
                  if (checkInDate && value <= checkInDate) {
                    return 'Check-out date must be after check-in date';
                  }
                  return true;
                }
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Check-out Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: checkInDate || today }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Box>

          {/* Number of Guests */}
          <Controller
            name="numberOfGuests"
            control={control}
            rules={{ 
              required: 'Number of guests is required',
              min: { value: 1, message: 'At least 1 guest is required' },
              max: { value: room.capacity, message: `Maximum ${room.capacity} guests allowed` }
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Number of Guests"
                type="number"
                fullWidth
                inputProps={{ min: 1, max: room.capacity }}
                error={!!fieldState.error}
                helperText={fieldState.error?.message || `Maximum capacity: ${room.capacity} guests`}
                sx={{ mb: 3 }}
              />
            )}
          />

          {/* Special Requests */}
          <Controller
            name="specialRequests"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Special Requests"
                multiline
                rows={3}
                fullWidth
                placeholder="Any special requirements or requests..."
                sx={{ mb: 3 }}
              />
            )}
          />

          <Divider sx={{ my: 2 }} />

          {/* Booking Summary */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Booking Summary
            </Typography>
            
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2">Room:</Typography>
              <Typography variant="body2">
                {room.type.replace('_', ' ')} - Room {room.roomNumber}
              </Typography>
            </Box>
            
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2">Price per night:</Typography>
              <Typography variant="body2">₹{room.pricePerNight.toLocaleString()}</Typography>
            </Box>
            
            {nights > 0 && (
              <>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Number of nights:</Typography>
                  <Typography variant="body2">{nights}</Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Guests:</Typography>
                  <Typography variant="body2">{numberOfGuests}</Typography>
                </Box>
                
                <Divider sx={{ my: 1 }} />
                
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography variant="h6">Total Amount:</Typography>
                  <Typography variant="h6" color="primary">
                    ₹{totalAmount.toLocaleString()}
                  </Typography>
                </Box>
              </>
            )}

            {nights === 0 && checkInDate && checkOutDate && (
              <Alert severity="error" sx={{ mt: 1 }}>
                Invalid date selection. Check-out must be after check-in date.
              </Alert>
            )}
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit(onFormSubmit)} 
          variant="contained"
          disabled={loading || nights === 0}
        >
          {loading ? 'Booking...' : 'Confirm Booking'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingForm;