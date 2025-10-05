import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControlLabel,
  Switch,
  Chip,
  Typography,
} from '@mui/material';
import {
  Add,
  Delete,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import type { Hotel } from '../../types';

interface HotelFormProps {
  open: boolean;
  hotel?: Hotel | null;
  onClose: () => void;
  onSubmit: (data: HotelFormData) => void;
  loading?: boolean;
}

export interface HotelFormData {
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  amenities: string[];
  images: string[];
  isActive: boolean;
  policies?: string;
  checkInTime?: string;
  checkOutTime?: string;
}

const HotelForm: React.FC<HotelFormProps> = ({
  open,
  hotel,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const isEdit = !!hotel;
  const [newAmenity, setNewAmenity] = React.useState('');
  const [newImage, setNewImage] = React.useState('');

  const { control, handleSubmit, watch, setValue, reset } = useForm<HotelFormData>({
    defaultValues: {
      name: '',
      description: '',
      address: '',
      city: '',
      state: '',
      country: 'India',
      postalCode: '',
      phone: '',
      email: '',
      latitude: 0,
      longitude: 0,
      amenities: [],
      images: [],
      isActive: true,
      policies: '',
      checkInTime: '14:00',
      checkOutTime: '11:00',
    },
  });

  const watchedAmenities = watch('amenities');
  const watchedImages = watch('images');

  React.useEffect(() => {
    if (hotel) {
      reset({
        name: hotel.name,
        description: hotel.description,
        address: hotel.address,
        city: hotel.city,
        state: hotel.state,
        country: hotel.country,
        postalCode: hotel.postalCode,
        phone: hotel.phone || '',
        email: hotel.email || '',
        latitude: hotel.latitude || 0,
        longitude: hotel.longitude || 0,
        amenities: hotel.amenities || [],
        images: hotel.images || [],
        isActive: hotel.isActive,
        policies: hotel.policies || '',
        checkInTime: hotel.checkInTime || '14:00',
        checkOutTime: hotel.checkOutTime || '11:00',
      });
    } else {
      reset({
        name: '',
        description: '',
        address: '',
        city: '',
        state: '',
        country: 'India',
        postalCode: '',
        phone: '',
        email: '',
        latitude: 0,
        longitude: 0,
        amenities: [],
        images: [],
        isActive: true,
        policies: '',
        checkInTime: '14:00',
        checkOutTime: '11:00',
      });
    }
  }, [hotel, reset]);

  const handleAddAmenity = () => {
    if (newAmenity.trim() && !watchedAmenities.includes(newAmenity.trim())) {
      setValue('amenities', [...watchedAmenities, newAmenity.trim()]);
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (amenity: string) => {
    setValue('amenities', watchedAmenities.filter(a => a !== amenity));
  };

  const handleAddImage = () => {
    if (newImage.trim() && !watchedImages.includes(newImage.trim())) {
      setValue('images', [...watchedImages, newImage.trim()]);
      setNewImage('');
    }
  };

  const handleRemoveImage = (image: string) => {
    setValue('images', watchedImages.filter(i => i !== image));
  };

  const onFormSubmit = (data: HotelFormData) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEdit ? 'Edit Hotel' : 'Add New Hotel'}
      </DialogTitle>
      
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <Box display="flex" gap={2} mb={2}>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Hotel name is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Hotel Name"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
            />
            
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  }
                  label="Active"
                />
              )}
            />
          </Box>

          <Controller
            name="description"
            control={control}
            rules={{ required: 'Description is required' }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Description"
                multiline
                rows={3}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
                sx={{ mb: 2 }}
              />
            )}
          />

          {/* Address Fields */}
          <Typography variant="h6" sx={{ mb: 2 }}>Address Information</Typography>
          
          <Controller
            name="address"
            control={control}
            rules={{ required: 'Address is required' }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Address"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
                sx={{ mb: 2 }}
              />
            )}
          />

          <Box display="flex" gap={2} mb={2}>
            <Controller
              name="city"
              control={control}
              rules={{ required: 'City is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="City"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
            />
            
            <Controller
              name="state"
              control={control}
              rules={{ required: 'State is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="State"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
            />
          </Box>

          <Box display="flex" gap={2} mb={2}>
            <Controller
              name="country"
              control={control}
              rules={{ required: 'Country is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Country"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
            />
            
            <Controller
              name="postalCode"
              control={control}
              rules={{ required: 'Postal code is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Postal Code"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
            />
          </Box>

          {/* Contact Information */}
          <Typography variant="h6" sx={{ mb: 2 }}>Contact Information</Typography>
          
          <Box display="flex" gap={2} mb={2}>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Phone"
                  fullWidth
                />
              )}
            />
            
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  fullWidth
                />
              )}
            />
          </Box>

          {/* Check-in/out Times */}
          <Box display="flex" gap={2} mb={2}>
            <Controller
              name="checkInTime"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Check-in Time"
                  type="time"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
            
            <Controller
              name="checkOutTime"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Check-out Time"
                  type="time"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Box>

          {/* Amenities */}
          <Typography variant="h6" sx={{ mb: 1 }}>Amenities</Typography>
          <Box display="flex" gap={1} mb={1}>
            <TextField
              label="Add Amenity"
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddAmenity()}
              fullWidth
            />
            <Button variant="outlined" onClick={handleAddAmenity} startIcon={<Add />}>
              Add
            </Button>
          </Box>
          
          <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
            {watchedAmenities.map((amenity) => (
              <Chip
                key={amenity}
                label={amenity}
                onDelete={() => handleRemoveAmenity(amenity)}
                deleteIcon={<Delete />}
              />
            ))}
          </Box>

          {/* Images */}
          <Typography variant="h6" sx={{ mb: 1 }}>Images</Typography>
          <Box display="flex" gap={1} mb={1}>
            <TextField
              label="Add Image URL"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddImage()}
              fullWidth
            />
            <Button variant="outlined" onClick={handleAddImage} startIcon={<Add />}>
              Add
            </Button>
          </Box>
          
          <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
            {watchedImages.map((image) => (
              <Box key={image} position="relative">
                <Chip
                  label={image.length > 30 ? `${image.substring(0, 30)}...` : image}
                  onDelete={() => handleRemoveImage(image)}
                  deleteIcon={<Delete />}
                />
              </Box>
            ))}
          </Box>

          {/* Policies */}
          <Controller
            name="policies"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Policies"
                multiline
                rows={3}
                fullWidth
                sx={{ mb: 2 }}
              />
            )}
          />
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit(onFormSubmit)} 
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HotelForm;