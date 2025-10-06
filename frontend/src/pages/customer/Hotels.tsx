import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client/react';
import HotelList from '../../components/hotels/HotelList';
import HotelForm from '../../components/hotels/HotelForm';
import HotelDetails from '../../components/hotels/HotelDetails';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import type { HotelFormData } from '../../components/hotels/HotelForm';
import type { Hotel } from '../../types';
import { GET_HOTELS, CREATE_HOTEL, UPDATE_HOTEL, DELETE_HOTEL } from '../../graphql/hotelQueries';

const HotelsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const { data, loading, refetch } = useQuery(GET_HOTELS);
  const [createHotelMutation] = useMutation(CREATE_HOTEL);
  const [updateHotelMutation] = useMutation(UPDATE_HOTEL);
  const [deleteHotelMutation] = useMutation(DELETE_HOTEL);

  const isAdmin = user?.role === UserRole.ADMIN;
  const isHotelManager = user?.role === UserRole.HOTEL_MANAGER;
  const showActions = isAdmin || isHotelManager;
  const showBooking = user?.role === UserRole.USER;

  const hotels: Hotel[] = data?.getHotels ?? [];

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

  const handleDeleteHotel = async (hotel: Hotel) => {
    if (window.confirm(`Are you sure you want to delete ${hotel.name}?`)) {
      try {
        await deleteHotelMutation({ variables: { id: hotel.id } });
        refetch();
      } catch (err) {
        console.error('Failed to delete hotel:', err);
      }
    }
  };

  const handleAddHotel = () => {
    setEditingHotel(null);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: HotelFormData) => {
    try {
      if (editingHotel) {
        await updateHotelMutation({ variables: { id: editingHotel.id, input: data } });
      } else {
        await createHotelMutation({ variables: { input: data } });
      }
      refetch();
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

  return (
    <>
      <HotelList
        hotels={hotels}
        loading={loading}
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
