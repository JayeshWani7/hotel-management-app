import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Rating,
  Divider,
  ImageList,
  ImageListItem,
} from '@mui/material';
import {
  LocationOn,
  Phone,
  Email,
  AccessTime,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import type { Hotel } from '../../types';

interface HotelDetailsProps {
  open: boolean;
  hotel: Hotel | null;
  onClose: () => void;
  onEdit?: (hotel: Hotel) => void;
  showEditButton?: boolean;
}

const HotelDetails: React.FC<HotelDetailsProps> = ({
  open,
  hotel,
  onClose,
  onEdit,
  showEditButton = false,
}) => {
  if (!hotel) return null;

  const handleEdit = () => {
    onEdit?.(hotel);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="start">
          <Box>
            <Typography variant="h5" component="div">
              {hotel.name}
            </Typography>
            <Box display="flex" alignItems="center" mt={1}>
              <Rating value={hotel.rating} readOnly size="small" />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({hotel.rating}/5)
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              icon={hotel.isActive ? <CheckCircle /> : <Cancel />}
              label={hotel.isActive ? 'Active' : 'Inactive'}
              color={hotel.isActive ? 'success' : 'error'}
              size="small"
            />
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box>
          {/* Images */}
          {hotel.images && hotel.images.length > 0 && (
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>Images</Typography>
              <ImageList sx={{ width: '100%', height: 200 }} cols={3} rowHeight={150}>
                {hotel.images.map((image, index) => (
                  <ImageListItem key={index}>
                    <img
                      src={image}
                      alt={`${hotel.name} - ${index + 1}`}
                      loading="lazy"
                      style={{ objectFit: 'cover' }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Box>
          )}

          {/* Description */}
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>Description</Typography>
            <Typography variant="body1" color="text.secondary">
              {hotel.description}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Location Information */}
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>Location</Typography>
            <Box display="flex" alignItems="start" mb={1}>
              <LocationOn sx={{ mr: 1, mt: 0.5, color: 'text.secondary' }} />
              <Box>
                <Typography variant="body2">
                  {hotel.address}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {hotel.city}, {hotel.state} {hotel.postalCode}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {hotel.country}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Contact Information */}
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>Contact Information</Typography>
            {hotel.phone && (
              <Box display="flex" alignItems="center" mb={1}>
                <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">{hotel.phone}</Typography>
              </Box>
            )}
            {hotel.email && (
              <Box display="flex" alignItems="center" mb={1}>
                <Email sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">{hotel.email}</Typography>
              </Box>
            )}
          </Box>

          {/* Check-in/out Times */}
          {(hotel.checkInTime || hotel.checkOutTime) && (
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>Check-in & Check-out</Typography>
              {hotel.checkInTime && (
                <Box display="flex" alignItems="center" mb={1}>
                  <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    Check-in: {hotel.checkInTime}
                  </Typography>
                </Box>
              )}
              {hotel.checkOutTime && (
                <Box display="flex" alignItems="center" mb={1}>
                  <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    Check-out: {hotel.checkOutTime}
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Amenities */}
          {hotel.amenities && hotel.amenities.length > 0 && (
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>Amenities</Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {hotel.amenities.map((amenity, index) => (
                  <Chip
                    key={index}
                    label={amenity}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Policies */}
          {hotel.policies && (
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>Policies</Typography>
              <Typography variant="body2" color="text.secondary">
                {hotel.policies}
              </Typography>
            </Box>
          )}

          {/* Additional Info */}
          <Divider sx={{ my: 2 }} />
          <Box>
            <Typography variant="body2" color="text.secondary">
              Created: {new Date(hotel.createdAt).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Last Updated: {new Date(hotel.updatedAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {showEditButton && (
          <Button onClick={handleEdit} variant="contained">
            Edit Hotel
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default HotelDetails;