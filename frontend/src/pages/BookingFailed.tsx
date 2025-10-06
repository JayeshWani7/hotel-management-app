import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  ErrorOutline,
  Home,
  Replay,
  SupportAgent,
} from '@mui/icons-material';

const BookingFailed: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        {/* Failure Header */}
        <Box mb={4}>
          <ErrorOutline sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom color="error.main">
            Booking Failed
          </Typography>
          <Typography variant="h6" color="text.secondary" mb={2}>
            Oops! Something went wrong while processing your booking.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Don’t worry — no payment has been deducted. You can try again or contact support.
          </Typography>
        </Box>

        {/* Possible Causes */}
        <Card sx={{ mb: 4, textAlign: 'left', bgcolor: 'error.50' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="error.main">
              Possible Reasons
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              • Payment could not be completed due to a network issue.
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              • The selected room may no longer be available.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Temporary server issue. Please try again after a few minutes.
            </Typography>
          </CardContent>
        </Card>

        {/* Retry / Help Options */}
        <Card sx={{ mb: 4, textAlign: 'left' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              What You Can Do
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              • Retry the booking process with the same or a different hotel.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • If the problem persists, contact our customer support for assistance.
            </Typography>
          </CardContent>
        </Card>

        <Divider sx={{ my: 3 }} />

        {/* Action Buttons */}
        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} justifyContent="center" mb={4}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<Replay />}
            onClick={() => navigate('/hotels')}
            sx={{ minWidth: 200 }}
          >
            Try Again
          </Button>

          <Button
            variant="outlined"
            size="large"
            startIcon={<SupportAgent />}
            onClick={() => navigate('/support')}
            sx={{ minWidth: 200 }}
          >
            Contact Support
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

        {/* Note */}
        <Typography variant="body2" color="text.secondary">
          We apologize for the inconvenience and appreciate your patience.
        </Typography>
      </Paper>
    </Container>
  );
};

export default BookingFailed;
