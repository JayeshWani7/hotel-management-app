import { gql } from '@apollo/client';

export const GET_ROOMS_BY_HOTEL = gql`
  query GetRooms($hotelId: String) {
    getRooms(hotelId: $hotelId) {
      id
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
