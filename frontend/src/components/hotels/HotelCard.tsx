import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Rating,
  IconButton,
} from '@mui/material';
import {
  LocationOn,
  Edit,
  Delete,
  Visibility,
} from '@mui/icons-material';
import type { Hotel } from '../../types';

interface HotelCardProps {
  hotel: Hotel;
  showActions?: boolean;
  showBooking?: boolean;
  onView?: (hotel: Hotel) => void;
  onEdit?: (hotel: Hotel) => void;
  onDelete?: (hotel: Hotel) => void;
  onBook?: (hotel: Hotel) => void;
}

const HotelCard: React.FC<HotelCardProps> = ({
  hotel,
  showActions = false,
  showBooking = false,
  onView,
  onEdit,
  onDelete,
  onBook,
}) => {
  const handleView = () => {
    onView?.(hotel);
  };

  const handleEdit = () => {
    onEdit?.(hotel);
  };

  const handleDelete = () => {
    onDelete?.(hotel);
  };

  const handleBook = () => {
    onBook?.(hotel);
  };

  return (
    <Card sx={{
      width: '100%',
      maxWidth: { xs: '100%', sm: 345 },
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      mx: 'auto'
    }}>
      <CardMedia
        component="img"
        height="200"
        image={hotel.images?.[0] || '/api/placeholder/400/200'}
        alt={hotel.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 2, md: 3 } }}>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          noWrap
          sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' } }}
        >
          {hotel.name}
        </Typography>

        <Box display="flex" alignItems="center" mb={1}>
          <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary" noWrap>
            {hotel.address}, {hotel.city}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {hotel.description}
        </Typography>

        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Rating value={hotel.rating} readOnly size="small" />
          <Typography variant="body2" color="primary" fontWeight="bold">
            From ₹2,500/night
          </Typography>
        </Box>

        <Box display="flex" gap={0.5} flexWrap="wrap" mb={2}>
          {hotel.amenities?.slice(0, 3).map((amenity, index) => (
            <Chip
              key={index}
              label={amenity}
              size="small"
              variant="outlined"
            />
          ))}
          {hotel.amenities && hotel.amenities.length > 3 && (
            <Chip
              label={`+${hotel.amenities.length - 3} more`}
              size="small"
              variant="outlined"
            />
          )}
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" gap={1}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleView}
          >
            View Details
          </Button>

          {showBooking && (
            <Button
              variant="contained"
              size="small"
              onClick={handleBook}
              color="primary"
            >
              Book Now
            </Button>
          )}

          {showActions && (
            <Box>
              <IconButton size="small" onClick={handleView}>
                <Visibility />
              </IconButton>
              <IconButton size="small" onClick={handleEdit}>
                <Edit />
              </IconButton>
              <IconButton size="small" onClick={handleDelete} color="error">
                <Delete />
              </IconButton>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default HotelCard;