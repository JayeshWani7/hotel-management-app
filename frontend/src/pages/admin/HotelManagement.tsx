import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Divider,
  Tooltip,
  Alert,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Hotel as HotelIcon,
  LocationOn,
  Star,
} from '@mui/icons-material';
import { GET_HOTELS, CREATE_HOTEL, UPDATE_HOTEL, DELETE_HOTEL } from '../../graphql/hotelQueries';
import HotelForm from '../../components/hotels/HotelForm';
import HotelDetails from '../../components/hotels/HotelDetails';
import type { Hotel } from '../../types';
import type { HotelFormData } from '../../components/hotels/HotelForm';

const AdminHotelManagement: React.FC = () => {
  const navigate = useNavigate();
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Hotel | null>(null);

  const { data, loading, refetch, error } = useQuery(GET_HOTELS);
  const [createHotelMutation] = useMutation(CREATE_HOTEL);
  const [updateHotelMutation] = useMutation(UPDATE_HOTEL);
  const [deleteHotelMutation] = useMutation(DELETE_HOTEL);

  const hotels: Hotel[] = data?.getHotels ?? [];

  const handleCreateHotel = () => {
    setEditingHotel(null);
    setShowForm(true);
  };

  const handleEditHotel = (hotel: Hotel) => {
    setEditingHotel(hotel);
    setShowForm(true);
  };

  const handleViewHotel = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setShowDetails(true);
  };

  const handleDeleteHotel = async (hotel: Hotel) => {
    setDeleteConfirm(hotel);
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      try {
        await deleteHotelMutation({ 
          variables: { id: deleteConfirm.id } 
        });
        await refetch();
        setDeleteConfirm(null);
      } catch (err) {
        console.error('Failed to delete hotel:', err);
        alert('Failed to delete hotel');
      }
    }
  };

  const handleFormSubmit = async (data: HotelFormData) => {
    try {
      if (editingHotel) {
        await updateHotelMutation({ 
          variables: { 
            id: editingHotel.id, 
            updateHotelInput: data 
          } 
        });
      } else {
        await createHotelMutation({ 
          variables: { 
            createHotelInput: data 
          } 
        });
      }
      await refetch();
      setShowForm(false);
      setEditingHotel(null);
    } catch (err) {
      console.error('Failed to save hotel:', err);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingHotel(null);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedHotel(null);
  };

  if (loading) return <Typography>Loading hotels...</Typography>;
  if (error) return <Alert severity="error">Failed to load hotels: {error.message}</Alert>;

  return (
    <Box p={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Hotel Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage all hotels in the system
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateHotel}
          size="large"
        >
          Add New Hotel
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <HotelIcon color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Hotels
                  </Typography>
                  <Typography variant="h4">
                    {hotels.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <LocationOn color="secondary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Cities
                  </Typography>
                  <Typography variant="h4">
                    {new Set(hotels.map(h => h.city)).size}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Star color="warning" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Avg Rating
                  </Typography>
                  <Typography variant="h4">
                    {hotels.length > 0 
                      ? (hotels.reduce((sum, h) => sum + h.rating, 0) / hotels.length).toFixed(1)
                      : '0'
                    }
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <HotelIcon color="success" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Active Hotels
                  </Typography>
                  <Typography variant="h4">
                    {hotels.filter(h => h.isActive).length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Hotels Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Hotel Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {hotels.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                      No hotels found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Start by adding your first hotel
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={handleCreateHotel}
                    >
                      Add First Hotel
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                hotels.map((hotel) => (
                  <TableRow key={hotel.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {hotel.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {hotel.description?.substring(0, 60)}...
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {hotel.city}, {hotel.state}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {hotel.country}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                        <Typography variant="body2">
                          {hotel.rating.toFixed(1)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={hotel.isActive ? 'Active' : 'Inactive'}
                        color={hotel.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(hotel.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewHotel(hotel)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Hotel">
                        <IconButton
                          size="small"
                          onClick={() => handleEditHotel(hotel)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Hotel">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteHotel(hotel)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Hotel Form Dialog */}
      <HotelForm
        open={showForm}
        hotel={editingHotel}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
      />

      {/* Hotel Details Dialog */}
      <HotelDetails
        open={showDetails}
        hotel={selectedHotel}
        onClose={handleCloseDetails}
        onEdit={handleEditHotel}
        showEditButton={true}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteConfirm?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminHotelManagement;