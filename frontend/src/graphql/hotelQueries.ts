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
  mutation CreateHotel($createHotelInput: CreateHotelInput!) {
    createHotel(createHotelInput: $createHotelInput) {
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

export const UPDATE_HOTEL = gql`
  mutation UpdateHotel($id: String!, $updateHotelInput: UpdateHotelInput!) {
    updateHotel(id: $id, updateHotelInput: $updateHotelInput) {
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

export const DELETE_HOTEL = gql`
  mutation DeleteHotel($id: String!) {
    deleteHotel(id: $id)
  }
`;
