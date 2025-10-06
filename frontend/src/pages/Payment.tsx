import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Divider,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  CreditCard,
  Security,
  CheckCircle,
  Hotel,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';

interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  paymentMethod: string;
}

interface BookingData {
  hotel: any;
  room: any;
  checkInDate: Date;
  checkOutDate: Date;
  guests: number;
  specialRequests: string;
  nights: number;
  totalAmount: number;
  taxes: number;
  finalAmount: number;
}

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state as BookingData;
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormData>({
    defaultValues: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
      paymentMethod: 'credit_card',
    },
  });

  if (!bookingData) {
    // Redirect if no booking data
    navigate('/hotels');
    return null;
  }

  const { hotel, room, finalAmount, nights } = bookingData;

  const onSubmit = async (data: PaymentFormData) => {
    try {
      setError('');
      setIsProcessing(true);
      // 1) Create Cashfree order via REST
      const res = await axios.post('/api/payments/create-order', { bookingId: String(bookingData.bookingId) });
      const { orderId, paymentSessionId, orderToken, payment_link } = res.data || {};

      // 2) Redirect to Cashfree hosted page (redirect flow)
      if (payment_link) {
        window.location.href = payment_link;
        return;
      }

      // Fallback: if payment link not provided by backend, navigate to success with orderId (dev only)
      navigate('/booking-success', { state: { ...bookingData, transactionId: orderId, paymentData: data } });
    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-numeric characters
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    // Add spaces every 4 digits
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
        {/* Payment Form */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 4 }}>
            <Box display="flex" alignItems="center" mb={3}>
              <CreditCard color="primary" sx={{ mr: 2, fontSize: 32 }} />
              <Typography variant="h5" component="h1">
                Payment Details
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Payment Method</InputLabel>
                <Controller
                  name="paymentMethod"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Payment Method">
                      <MenuItem value="credit_card">Credit/Debit Card</MenuItem>
                      <MenuItem value="upi">UPI Payment</MenuItem>
                      <MenuItem value="net_banking">Net Banking</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>

              <Controller
                name="cardholderName"
                control={control}
                rules={{ required: 'Cardholder name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Cardholder Name"
                    fullWidth
                    margin="normal"
                    error={!!errors.cardholderName}
                    helperText={errors.cardholderName?.message}
                  />
                )}
              />

              <Controller
                name="cardNumber"
                control={control}
                rules={{ 
                  required: 'Card number is required',
                  pattern: {
                    value: /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/,
                    message: 'Please enter a valid card number'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Card Number"
                    fullWidth
                    margin="normal"
                    placeholder="1234 5678 9012 3456"
                    error={!!errors.cardNumber}
                    helperText={errors.cardNumber?.message}
                    onChange={(e) => {
                      const formatted = formatCardNumber(e.target.value);
                      field.onChange(formatted);
                    }}
                    inputProps={{ maxLength: 19 }}
                  />
                )}
              />

              <Box display="flex" gap={2}>
                <Controller
                  name="expiryDate"
                  control={control}
                  rules={{ 
                    required: 'Expiry date is required',
                    pattern: {
                      value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                      message: 'Please enter valid expiry date (MM/YY)'
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Expiry Date"
                      fullWidth
                      margin="normal"
                      placeholder="MM/YY"
                      error={!!errors.expiryDate}
                      helperText={errors.expiryDate?.message}
                      onChange={(e) => {
                        const formatted = formatExpiryDate(e.target.value);
                        field.onChange(formatted);
                      }}
                      inputProps={{ maxLength: 5 }}
                    />
                  )}
                />

                <Controller
                  name="cvv"
                  control={control}
                  rules={{ 
                    required: 'CVV is required',
                    pattern: {
                      value: /^\d{3,4}$/,
                      message: 'Please enter valid CVV'
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="CVV"
                      fullWidth
                      margin="normal"
                      type="password"
                      error={!!errors.cvv}
                      helperText={errors.cvv?.message}
                      inputProps={{ maxLength: 4 }}
                    />
                  )}
                />
              </Box>

              <Box display="flex" alignItems="center" mt={3} mb={2}>
                <Security color="action" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Your payment information is secure and encrypted
                </Typography>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={isProcessing}
                sx={{ mt: 2, py: 1.5 }}
              >
                {isProcessing ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    Processing Payment...
                  </>
                ) : (
                  `Pay ₹${finalAmount.toLocaleString()}`
                )}
              </Button>
            </Box>
          </Paper>
        </Box>

        {/* Booking Summary */}
        <Box sx={{ width: { xs: '100%', md: '400px' } }}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Booking Summary
            </Typography>

            {/* Hotel Info */}
            <Box display="flex" alignItems="center" mb={3}>
              <Hotel color="primary" sx={{ mr: 1 }} />
              <Box>
                <Typography variant="body1" fontWeight="medium">
                  {hotel.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {hotel.city}, {hotel.state}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Booking Details */}
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Check-in: {new Date(bookingData.checkInDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Check-out: {new Date(bookingData.checkOutDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Guests: {bookingData.guests}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Room: {room.type}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Duration: {nights} {nights === 1 ? 'night' : 'nights'}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Price Breakdown */}
            <Box mb={2}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Room charges</Typography>
                <Typography variant="body2">
                  ₹{bookingData.totalAmount.toLocaleString()}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Taxes & fees</Typography>
                <Typography variant="body2">
                  ₹{bookingData.taxes.toLocaleString()}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6">Total Amount</Typography>
              <Typography variant="h6" color="primary">
                ₹{finalAmount.toLocaleString()}
              </Typography>
            </Box>

            {/* Trust Indicators */}
            <Box mt={3} p={2} bgcolor="grey.50" borderRadius={2}>
              <Box display="flex" alignItems="center" mb={1}>
                <CheckCircle color="success" sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body2">Secure Payment</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <CheckCircle color="success" sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body2">Instant Confirmation</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <CheckCircle color="success" sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body2">24/7 Support</Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default Payment;