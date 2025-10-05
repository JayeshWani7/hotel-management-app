import React from 'react';
import { useNavigate } from 'react-router-dom';
import HotelList from '../../components/hotels/HotelList';
import HotelForm from '../../components/hotels/HotelForm';
import type { HotelFormData } from '../../components/hotels/HotelForm';
import HotelDetails from '../../components/hotels/HotelDetails';
import type { Hotel } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

const HotelsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedHotel, setSelectedHotel] = React.useState<Hotel | null>(null);
  const [editingHotel, setEditingHotel] = React.useState<Hotel | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [showDetails, setShowDetails] = React.useState(false);

  const isAdmin = user?.role === UserRole.ADMIN;
  const isHotelManager = user?.role === UserRole.HOTEL_MANAGER;
  const showActions = isAdmin || isHotelManager;
  const showBooking = user?.role === UserRole.USER;

  // Mock hotels data
  const mockHotels: Hotel[] = [
    {
      id: '1',
      name: 'Grand Palace Hotel',
      description: 'Luxury hotel in the heart of the city with world-class amenities',
      address: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '400001',
      phone: '+91 9876543210',
      email: 'info@grandpalace.com',
      latitude: 19.0760,
      longitude: 72.8777,
      rating: 4.5,
      amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant'],
      images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
      isActive: true,
      policies: 'Check-in: 2 PM, Check-out: 11 AM',
      checkInTime: '14:00',
      checkOutTime: '11:00',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Ocean View Resort',
      description: 'Beachfront resort with stunning ocean views and pristine beaches',
      address: '456 Beach Road',
      city: 'Goa',
      state: 'Goa',
      country: 'India',
      postalCode: '403001',
      phone: '+91 9876543211',
      email: 'reservations@oceanview.com',
      latitude: 15.2993,
      longitude: 74.1240,
      rating: 4.8,
      amenities: ['Beach Access', 'Water Sports', 'Bar', 'Restaurant', 'Pool'],
      images: ['/api/placeholder/400/300'],
      isActive: true,
      policies: 'No pets allowed, Smoking prohibited',
      checkInTime: '15:00',
      checkOutTime: '12:00',
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
    },
    {
      id: '3',
      name: 'Mountain Retreat Inn',
      description: 'Peaceful mountain getaway surrounded by nature',
      address: '789 Hill Station Road',
      city: 'Shimla',
      state: 'Himachal Pradesh',
      country: 'India',
      postalCode: '171001',
      phone: '+91 9876543212',
      email: 'stay@mountainretreat.com',
      latitude: 31.1048,
      longitude: 77.1734,
      rating: 4.2,
      amenities: ['Mountain View', 'Fireplace', 'Hiking Trails', 'Restaurant'],
      images: ['/api/placeholder/400/300'],
      isActive: true,
      policies: 'Mountain weather conditions apply',
      checkInTime: '14:00',
      checkOutTime: '11:00',
      createdAt: '2024-01-03T00:00:00Z',
      updatedAt: '2024-01-03T00:00:00Z',
    },
  ];

  const handleViewHotel = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setShowDetails(true);
  };

  const handleBookHotel = (hotel: Hotel) => {
    navigate(`/book-hotel/${hotel.id}`);
  };

  const handleEditHotel = (hotel: Hotel) => {
    setEditingHotel(hotel);
    setShowForm(true);
  };

  const handleDeleteHotel = (hotel: Hotel) => {
    // Implement delete logic
    console.log('Delete hotel:', hotel.name);
    // Show confirmation dialog and call API
  };

  const handleAddHotel = () => {
    setEditingHotel(null);
    setShowForm(true);
  };

  const handleFormSubmit = (data: HotelFormData) => {
    console.log('Form submitted:', data);
    // Implement API call to create/update hotel
    setShowForm(false);
    setEditingHotel(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingHotel(null);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedHotel(null);
  };

  return (
    <>
      <HotelList
        hotels={mockHotels}
        showActions={showActions}
        showBooking={showBooking}
        onView={handleViewHotel}
        onEdit={handleEditHotel}
        onDelete={handleDeleteHotel}
        onAdd={handleAddHotel}
        onBook={handleBookHotel}
      />

      <HotelForm
        open={showForm}
        hotel={editingHotel}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
      />

      <HotelDetails
        open={showDetails}
        hotel={selectedHotel}
        onClose={handleCloseDetails}
        onEdit={handleEditHotel}
        showEditButton={showActions}
      />
    </>
  );
};

export default HotelsPage;