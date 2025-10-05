import React from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
} from '@mui/material';
import {
  Search,
  FilterList,
} from '@mui/icons-material';
import HotelCard from './HotelCard';
import type { Hotel } from '../../types';

interface HotelListProps {
  hotels: Hotel[];
  loading?: boolean;
  showActions?: boolean;
  onView?: (hotel: Hotel) => void;
  onEdit?: (hotel: Hotel) => void;
  onDelete?: (hotel: Hotel) => void;
  onAdd?: () => void;
}

const HotelList: React.FC<HotelListProps> = ({
  hotels,
  loading = false,
  showActions = false,
  onView,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCity, setSelectedCity] = React.useState('');
  const [sortBy, setSortBy] = React.useState('name');

  // Extract unique cities from hotels
  const cities = React.useMemo(() => {
    const citySet = new Set(hotels.map(hotel => hotel.city));
    return Array.from(citySet).sort();
  }, [hotels]);

  // Filter and sort hotels
  const filteredHotels = React.useMemo(() => {
    let filtered = hotels.filter(hotel => {
      const matchesSearch = hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          hotel.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = selectedCity === '' || hotel.city === selectedCity;
      
      return matchesSearch && matchesCity;
    });

    // Sort hotels
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'city':
          return a.city.localeCompare(b.city);
        default:
          return 0;
      }
    });

    return filtered;
  }, [hotels, searchTerm, selectedCity, sortBy]);

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Hotels
        </Typography>
        {showActions && (
          <Button
            variant="contained"
            onClick={onAdd}
            startIcon={<FilterList />}
          >
            Add Hotel
          </Button>
        )}
      </Box>

      {/* Filters */}
      <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
        <Box 
          display="flex" 
          gap={2} 
          flexDirection={{ xs: 'column', sm: 'row' }}
          flexWrap="wrap" 
          alignItems={{ xs: 'stretch', sm: 'center' }}
        >
          <Box flex={{ xs: 'none', sm: 1 }} minWidth={{ xs: '100%', sm: '250px' }}>
            <TextField
              fullWidth
              placeholder="Search hotels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          
          <Box minWidth={{ xs: '100%', sm: '160px' }}>
            <FormControl fullWidth size="small">
              <InputLabel>City</InputLabel>
              <Select
                value={selectedCity}
                label="City"
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <MenuItem value="">All Cities</MenuItem>
                {cities.map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          <Box minWidth={{ xs: '100%', sm: '120px' }}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
                <MenuItem value="city">City</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <Button
            variant="outlined"
            size="small"
            sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
            onClick={() => {
              setSearchTerm('');
              setSelectedCity('');
              setSortBy('name');
            }}
          >
            Clear Filters
          </Button>
        </Box>
      </Paper>

      {/* Results Info */}
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Typography variant="body1">
          {filteredHotels.length} hotel(s) found
        </Typography>
        {searchTerm && (
          <Chip
            label={`Search: "${searchTerm}"`}
            onDelete={() => setSearchTerm('')}
            size="small"
          />
        )}
        {selectedCity && (
          <Chip
            label={`City: ${selectedCity}`}
            onDelete={() => setSelectedCity('')}
            size="small"
          />
        )}
      </Box>

      {/* Hotels Grid */}
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <Typography>Loading hotels...</Typography>
        </Box>
      ) : filteredHotels.length === 0 ? (
        <Box display="flex" flexDirection="column" alignItems="center" p={4}>
          <Typography variant="h6" gutterBottom>
            No hotels found
          </Typography>
          <Typography color="text.secondary">
            Try adjusting your search criteria
          </Typography>
        </Box>
      ) : (
        <Box 
          display="grid" 
          gridTemplateColumns={{
            xs: '1fr',
            sm: 'repeat(auto-fit, minmax(300px, 1fr))',
            md: 'repeat(auto-fit, minmax(350px, 1fr))',
            lg: 'repeat(auto-fit, minmax(380px, 1fr))'
          }}
          gap={{ xs: 2, sm: 2.5, md: 3 }}
        >
          {filteredHotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              showActions={showActions}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default HotelList;