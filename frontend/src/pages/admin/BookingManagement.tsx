import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Visibility,
  Edit,
  Cancel,
  CheckCircle,
  AccessTime,
  PersonOff,
} from '@mui/icons-material';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_ALL_BOOKINGS, UPDATE_BOOKING, CANCEL_BOOKING } from '../../graphql/bookingQueries';

interface Booking {
  id: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalAmount: number;
  status: string;
  specialRequests?: string;
  notes?: string;
  cancellationReason?: string;
  cancellationDate?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  room: {
    id: string;
    roomNumber: string;
    type: string;
    pricePerNight: number;
    hotel: {
      id: string;
      name: string;
      address: string;
      city: string;
    };
  };
  payment?: {
    id: string;
    amount: number;
    paymentMethod: string;
    status: string;
  };
}

const BookingManagement: React.FC = () => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: '',
    notes: '',
  });

  const { data, loading, refetch } = useQuery(GET_ALL_BOOKINGS);
  const [updateBookingMutation] = useMutation(UPDATE_BOOKING);
  const [cancelBookingMutation] = useMutation(CANCEL_BOOKING);

  const bookings: Booking[] = data?.getAllBookings ?? [];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'warning';
      case 'confirmed': return 'success';
      case 'cancelled': return 'error';
      case 'completed': return 'info';
      case 'no_show': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return <AccessTime />;
      case 'confirmed': return <CheckCircle />;
      case 'cancelled': return <Cancel />;
      case 'completed': return <CheckCircle />;
      case 'no_show': return <PersonOff />;
      default: return null;
    }
  };

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetails(true);
  };

  const handleUpdateBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setUpdateData({
      status: booking.status,
      notes: booking.notes || '',
    });
    setShowUpdateDialog(true);
  };

  const handleCancelBooking = async (bookingId: string) => {
    const reason = window.prompt('Please provide a cancellation reason:');
    if (reason) {
      try {
        await cancelBookingMutation({
          variables: {
            id: bookingId,
            cancelBookingInput: {
              cancellationReason: reason,
            },
          },
        });
        refetch();
      } catch (error) {
        console.error('Failed to cancel booking:', error);
        alert('Failed to cancel booking');
      }
    }
  };

  const handleSubmitUpdate = async () => {
    if (selectedBooking) {
      try {
        await updateBookingMutation({
          variables: {
            id: selectedBooking.id,
            updateBookingInput: updateData,
          },
        });
        setShowUpdateDialog(false);
        refetch();
      } catch (error) {
        console.error('Failed to update booking:', error);
        alert('Failed to update booking');
      }
    }
  };

  if (loading) return <Typography>Loading bookings...</Typography>;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Booking Management
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Bookings
              </Typography>
              <Typography variant="h5">
                {bookings.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending
              </Typography>
              <Typography variant="h5">
                {bookings.filter(b => b.status === 'pending').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Confirmed
              </Typography>
              <Typography variant="h5">
                {bookings.filter(b => b.status === 'confirmed').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Revenue
              </Typography>
              <Typography variant="h5">
                ${bookings.reduce((sum, b) => sum + b.totalAmount, 0).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bookings Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell>Guest</TableCell>
              <TableCell>Hotel</TableCell>
              <TableCell>Room</TableCell>
              <TableCell>Check-in</TableCell>
              <TableCell>Check-out</TableCell>
              <TableCell>Guests</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id.substring(0, 8)}...</TableCell>
                <TableCell>
                  {booking.user.firstName} {booking.user.lastName}
                  <br />
                  <Typography variant="caption" color="textSecondary">
                    {booking.user.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  {booking.room.hotel.name}
                  <br />
                  <Typography variant="caption" color="textSecondary">
                    {booking.room.hotel.city}
                  </Typography>
                </TableCell>
                <TableCell>
                  Room {booking.room.roomNumber}
                  <br />
                  <Typography variant="caption" color="textSecondary">
                    {booking.room.type}
                  </Typography>
                </TableCell>
                <TableCell>
                  {new Date(booking.checkInDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(booking.checkOutDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{booking.numberOfGuests}</TableCell>
                <TableCell>${booking.totalAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    icon={getStatusIcon(booking.status)}
                    label={booking.status.toUpperCase()}
                    color={getStatusColor(booking.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton
                      size="small"
                      onClick={() => handleViewBooking(booking)}
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Update Status">
                    <IconButton
                      size="small"
                      onClick={() => handleUpdateBooking(booking)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  {booking.status !== 'cancelled' && (
                    <Tooltip title="Cancel Booking">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        <Cancel />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Booking Details Dialog */}
      <Dialog 
        open={showDetails} 
        onClose={() => setShowDetails(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Guest Information
                </Typography>
                <Typography>
                  <strong>Name:</strong> {selectedBooking.user.firstName} {selectedBooking.user.lastName}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {selectedBooking.user.email}
                </Typography>
                <Typography>
                  <strong>Guests:</strong> {selectedBooking.numberOfGuests}
                </Typography>
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" gutterBottom>
                  Hotel & Room
                </Typography>
                <Typography>
                  <strong>Hotel:</strong> {selectedBooking.room.hotel.name}
                </Typography>
                <Typography>
                  <strong>Address:</strong> {selectedBooking.room.hotel.address}, {selectedBooking.room.hotel.city}
                </Typography>
                <Typography>
                  <strong>Room:</strong> {selectedBooking.room.roomNumber} ({selectedBooking.room.type})
                </Typography>
                <Typography>
                  <strong>Rate:</strong> ${selectedBooking.room.pricePerNight}/night
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Booking Information
                </Typography>
                <Typography>
                  <strong>Check-in:</strong> {new Date(selectedBooking.checkInDate).toLocaleDateString()}
                </Typography>
                <Typography>
                  <strong>Check-out:</strong> {new Date(selectedBooking.checkOutDate).toLocaleDateString()}
                </Typography>
                <Typography>
                  <strong>Total Amount:</strong> ${selectedBooking.totalAmount}
                </Typography>
                <Typography>
                  <strong>Status:</strong>{' '}
                  <Chip
                    icon={getStatusIcon(selectedBooking.status)}
                    label={selectedBooking.status.toUpperCase()}
                    color={getStatusColor(selectedBooking.status) as any}
                    size="small"
                  />
                </Typography>
                <Typography>
                  <strong>Booked on:</strong> {new Date(selectedBooking.createdAt).toLocaleDateString()}
                </Typography>
                
                {selectedBooking.specialRequests && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Special Requests
                    </Typography>
                    <Typography>{selectedBooking.specialRequests}</Typography>
                  </>
                )}
                
                {selectedBooking.notes && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Notes
                    </Typography>
                    <Typography>{selectedBooking.notes}</Typography>
                  </>
                )}
                
                {selectedBooking.payment && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Payment Information
                    </Typography>
                    <Typography>
                      <strong>Amount:</strong> ${selectedBooking.payment.amount}
                    </Typography>
                    <Typography>
                      <strong>Method:</strong> {selectedBooking.payment.paymentMethod}
                    </Typography>
                    <Typography>
                      <strong>Status:</strong> {selectedBooking.payment.status}
                    </Typography>
                  </>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetails(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Update Booking Dialog */}
      <Dialog
        open={showUpdateDialog}
        onClose={() => setShowUpdateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Booking</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={updateData.status}
                onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="no_show">No Show</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Notes"
              value={updateData.notes}
              onChange={(e) => setUpdateData({ ...updateData, notes: e.target.value })}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUpdateDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmitUpdate} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookingManagement;