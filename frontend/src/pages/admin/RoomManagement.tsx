import React, { useMemo, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_ROOMS, ADD_ROOM, UPDATE_ROOM, DELETE_ROOM } from '../../graphql/roomQueries';
import { GET_HOTELS } from '../../graphql/hotelQueries';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

type RoomForm = {
  roomNumber: string;
  type: string;
  pricePerNight: number;
  capacity: number;
  amenities: string;
  images: string;
  hotelId: string;
  description?: string;
  size:number
};

const RoomManagement: React.FC = () => {
  const { data: hotelsData } = useQuery(GET_HOTELS);
  const hotels = hotelsData?.getHotels || [];

  const [selectedHotelId, setSelectedHotelId] = useState<string>('');
  const { data, loading, error, refetch } = useQuery(GET_ROOMS, {
    variables: { hotelId: selectedHotelId || undefined },
  });
  const rooms = data?.getRooms || [];

  const [addRoom] = useMutation(ADD_ROOM);
  const [updateRoom] = useMutation(UPDATE_ROOM);
  const [deleteRoom] = useMutation(DELETE_ROOM);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<RoomForm>({
    roomNumber: '',
    type: 'DELUXE',
    pricePerNight: 0,
    capacity: 1,
    amenities: '',
    images: '',
    hotelId: '',
    description: '',
    size:100,
  });

  const handleOpen = (room?: any) => {
    if (room) {
      setEditing(room);
      setForm({
        roomNumber: room.roomNumber || '',
        type: room.type || 'DELUXE',
        pricePerNight: room.pricePerNight || 0,
        capacity: room.capacity || 1,
        amenities: (room.amenities || []).join(', '),
        images: (room.images || []).join(', '),
        hotelId: room.hotel?.id || selectedHotelId || '',
        description: room.description || '',
        size:100,
      });
    } else {
      setEditing(null);
      setForm((f) => ({ ...f, hotelId: selectedHotelId || '' }));
    }
    setOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      hotelId: form.hotelId,
      roomNumber: form.roomNumber,
      type: form.type,
      pricePerNight: Number(form.pricePerNight),
      capacity: Number(form.capacity),
      amenities: form.amenities
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean),
      images: form.images
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean),
      description: form.description || undefined,
      size:100,
    } as any;

    try {
      if (editing) {
        await updateRoom({ variables: { id: editing.id, updateRoomInput: payload } });
      } else {
        await addRoom({ variables: { createRoomInput: payload } });
      }
      setOpen(false);
      setEditing(null);
      await refetch();
    } catch (e) {
      console.error('Failed to save room:', e);
      alert('Failed to save room');
    }
  };

  const handleDelete = async (room: any) => {
    if (!confirm(`Delete room ${room.roomNumber}?`)) return;
    try {
      await deleteRoom({ variables: { id: room.id } });
      await refetch();
    } catch (e) {
      alert('Failed to delete room');
    }
  };

  const hotelOptions = useMemo(() => hotels.map((h: any) => ({ id: h.id, label: `${h.name} (${h.city})` })), [hotels]);

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Room Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Add Room
        </Button>
      </Box>

      <Box display="flex" gap={2} mb={2}>
        <FormControl sx={{ minWidth: 260 }}>
          <InputLabel>Filter by Hotel</InputLabel>
          <Select
            value={selectedHotelId}
            label="Filter by Hotel"
            onChange={(e) => setSelectedHotelId(String(e.target.value))}
          >
            <MenuItem value="">
              <em>All Hotels</em>
            </MenuItem>
            {hotelOptions.map((h) => (
              <MenuItem key={h.id} value={h.id}>{h.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Paper>
        {loading ? (
          <Box p={3}><Typography>Loading rooms...</Typography></Box>
        ) : error ? (
          <Box p={3}><Typography color="error">Failed to load rooms: {String(error.message)}</Typography></Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Room #</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Price/Night</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell>Amenities</TableCell>
                <TableCell>Hotel</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rooms.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell>{r.roomNumber}</TableCell>
                  <TableCell>{r.type}</TableCell>
                  <TableCell>₹{Number(r.pricePerNight).toLocaleString()}</TableCell>
                  <TableCell>{r.capacity}</TableCell>
                  <TableCell>
                    {(r.amenities || []).slice(0, 3).map((a: string) => (
                      <Chip key={a} label={a} size="small" sx={{ mr: 0.5 }} />
                    ))}
                    {(r.amenities || []).length > 3 && <Chip label={`+${(r.amenities || []).length - 3}`} size="small" />}
                  </TableCell>
                  <TableCell>{r.hotel?.name}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpen(r)}><Edit /></IconButton>
                    <IconButton color="error" onClick={() => handleDelete(r)}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Room' : 'Add Room'}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <FormControl fullWidth>
              <InputLabel>Hotel</InputLabel>
              <Select
                value={form.hotelId}
                label="Hotel"
                onChange={(e) => setForm({ ...form, hotelId: String(e.target.value) })}
              >
                {hotelOptions.map((h) => (
                  <MenuItem key={h.id} value={h.id}>{h.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField label="Room Number" value={form.roomNumber} onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} fullWidth />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select value={form.type} label="Type" onChange={(e) => setForm({ ...form, type: String(e.target.value) })}>
                <MenuItem value="SINGLE">Single</MenuItem>
                <MenuItem value="DOUBLE">Double</MenuItem>
                <MenuItem value="DELUXE">Deluxe</MenuItem>
                <MenuItem value="SUITE">Suite</MenuItem>
                <MenuItem value="FAMILY">Family</MenuItem>
              </Select>
            </FormControl>
            <TextField type="number" label="Price per Night" value={form.pricePerNight} onChange={(e) => setForm({ ...form, pricePerNight: Number(e.target.value) })} fullWidth />
            <TextField type="number" label="Capacity" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} fullWidth />
            <TextField label="Amenities (comma separated)" value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} fullWidth />
            <TextField label="Images (comma separated URLs)" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} fullWidth />
            <TextField label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} fullWidth multiline rows={2} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>{editing ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoomManagement;


