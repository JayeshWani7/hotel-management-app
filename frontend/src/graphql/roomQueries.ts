import { gql } from '@apollo/client';

export const GET_ROOMS = gql`
  query GetRooms($hotelId: String) {
    getRooms(hotelId: $hotelId) {
      id
      roomNumber
      type
      pricePerNight
      capacity
      amenities
      images
      isActive
      hotel {
        id
        name
        city
        state
      }
    }
  }
`;

export const GET_AVAILABLE_ROOMS = gql`
  query GetAvailableRooms($hotelId: String!, $checkInDate: DateTime!, $checkOutDate: DateTime!) {
    getAvailableRooms(hotelId: $hotelId, checkInDate: $checkInDate, checkOutDate: $checkOutDate) {
      id
      roomNumber
      type
      pricePerNight
      capacity
      amenities
      images
      isActive
    }
  }
`;

export const GET_ROOM = gql`
  query GetRoom($id: String!) {
    getRoom(id: $id) {
      id
      roomNumber
      type
      pricePerNight
      capacity
      amenities
      images
      isActive
      status
      description
      hotel { id name }
    }
  }
`;

export const ADD_ROOM = gql`
  mutation AddRoom($createRoomInput: CreateRoomInput!) {
    addRoom(createRoomInput: $createRoomInput) {
      id
      roomNumber
      type
      pricePerNight
      capacity
      size
      amenities
      images
      isActive
    }
  }
`;

export const UPDATE_ROOM = gql`
  mutation UpdateRoom($id: String!, $updateRoomInput: UpdateRoomInput!) {
    updateRoom(id: $id, updateRoomInput: $updateRoomInput) {
      id
      roomNumber
      type
      pricePerNight
      capacity
      amenities
      images
      isActive
      status
      description
    }
  }
`;

export const DELETE_ROOM = gql`
  mutation DeleteRoom($id: String!) {
    deleteRoom(id: $id)
  }
`;



