import { gql } from '@apollo/client';

export const GET_ROOMS_BY_HOTEL = gql`
  query GetRooms($hotelId: String) {
    getRooms(hotelId: $hotelId) {
      id
      roomNumber
      type
      description
      pricePerNight
      capacity
      size
      status
      amenities
      images
      isActive
      hotel {
        id
        name
        city
      }
    }
  }
`;

// --- Create Room ---
export const ADD_ROOM = gql`
  mutation CreateRoom($createRoomInput: CreateRoomInput!) {
    createRoom(createRoomInput: $createRoomInput) {
      id
      roomNumber
      type
      description
      pricePerNight
      capacity
      size
      status
      amenities
      images
      isActive
      hotel {
        id
        name
      }
    }
  }
`;

// --- Update Room ---
export const UPDATE_ROOM = gql`
  mutation UpdateRoom($id: String!, $updateRoomInput: UpdateRoomInput!) {
    updateRoom(id: $id, updateRoomInput: $updateRoomInput) {
      id
      roomNumber
      type
      description
      pricePerNight
      capacity
      size
      status
      amenities
      images
      isActive
    }
  }
`;

// --- Delete Room ---
export const DELETE_ROOM = gql`
  mutation RemoveRoom($id: String!) {
    removeRoom(id: $id)
  }
`;
