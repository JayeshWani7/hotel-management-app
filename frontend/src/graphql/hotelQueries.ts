import { gql } from '@apollo/client';

// Queries
export const GET_HOTELS = gql`
  query GetHotels {
    getHotels {
      id
      name
      description
      address
      city
      state
      country
      postalCode
      phone
      email
      latitude
      longitude
      rating
      amenities
      images
      isActive
      policies
      checkInTime
      checkOutTime
      createdAt
      updatedAt
    }
  }
`;

// Mutations
export const CREATE_HOTEL = gql`
  mutation CreateHotel($input: CreateHotelInput!) {
    createHotel(createHotelInput: $input) {
      id
      name
    }
  }
`;

export const UPDATE_HOTEL = gql`
  mutation UpdateHotel($id: ID!, $input: UpdateHotelInput!) {
    updateHotel(id: $id, updateHotelInput: $input) {
      id
      name
    }
  }
`;

export const DELETE_HOTEL = gql`
  mutation DeleteHotel($id: ID!) {
    deleteHotel(id: $id)
  }
`;
