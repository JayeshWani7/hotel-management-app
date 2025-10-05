import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Edit,
  Delete,
  Visibility,
  People,
  SingleBed,
  Bed,
  KingBed,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import type { Room } from '../../types';
import { RoomType, RoomStatus } from '../../types';

interface RoomCardProps {
  room: Room;
  showActions?: boolean;
  onView?: (room: Room) => void;
  onEdit?: (room: Room) => void;
  onDelete?: (room: Room) => void;
  onBook?: (room: Room) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({
  room,
  showActions = false,
  onView,
  onEdit,
  onDelete,
  onBook,
}) => {
  const handleView = () => {
    onView?.(room);
  };

  const handleEdit = () => {
    onEdit?.(room);
  };

  const handleDelete = () => {
    onDelete?.(room);
  };

  const handleBook = () => {
    onBook?.(room);
  };

  const getRoomTypeIcon = (type: RoomType) => {
    switch (type) {
      case RoomType.SINGLE:
        return <SingleBed />;
      case RoomType.DOUBLE:
        return <Bed />;
      default:
        return <KingBed />;
    }
  };

  const getRoomTypeColor = (type: RoomType) => {
    switch (type) {
      case RoomType.SINGLE:
        return 'primary';
      case RoomType.DOUBLE:
        return 'secondary';
      case RoomType.DELUXE:
        return 'warning';
      case RoomType.SUITE:
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={room.images?.[0] || '/api/placeholder/400/200'}
        alt={`${room.type} - ${room.roomNumber}`}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
          <Typography variant="h6" component="div">
            Room {room.roomNumber}
          </Typography>
          <Chip
            icon={room.status === RoomStatus.AVAILABLE ? <CheckCircle /> : <Cancel />}
            label={room.status === RoomStatus.AVAILABLE ? 'Available' : room.status.replace('_', ' ')}
            color={room.status === RoomStatus.AVAILABLE ? 'success' : 'error'}
            size="small"
          />
        </Box>

        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Chip
            icon={getRoomTypeIcon(room.type)}
            label={room.type.replace('_', ' ')}
            color={getRoomTypeColor(room.type) as any}
            size="small"
          />
          <Chip
            icon={<People />}
            label={`${room.capacity} guests`}
            size="small"
            variant="outlined"
          />
        </Box>

        {room.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {room.description}
          </Typography>
        )}

        {/* Amenities */}
        {room.amenities && room.amenities.length > 0 && (
          <Box mb={2}>
            <Typography variant="body2" fontWeight="bold" gutterBottom>
              Amenities:
            </Typography>
            <Box display="flex" gap={0.5} flexWrap="wrap">
              {room.amenities.slice(0, 3).map((amenity, index) => (
                <Chip
                  key={index}
                  label={amenity}
                  size="small"
                  variant="outlined"
                />
              ))}
              {room.amenities.length > 3 && (
                <Chip
                  label={`+${room.amenities.length - 3} more`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 1 }} />

        {/* Pricing */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h6" color="primary">
              ₹{room.pricePerNight}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              per night
            </Typography>
          </Box>

        </Box>

        {/* Actions */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mt="auto">
          {room.status === RoomStatus.AVAILABLE && !showActions && (
            <Button 
              variant="contained" 
              size="small"
              onClick={handleBook}
              fullWidth
            >
              Book Now
            </Button>
          )}
          
          {room.status !== RoomStatus.AVAILABLE && !showActions && (
            <Button 
              variant="outlined" 
              size="small"
              onClick={handleView}
              fullWidth
            >
              View Details
            </Button>
          )}
          
          {showActions && (
            <>
              <Button 
                variant="outlined" 
                size="small"
                onClick={handleView}
              >
                View Details
              </Button>
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
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default RoomCard;