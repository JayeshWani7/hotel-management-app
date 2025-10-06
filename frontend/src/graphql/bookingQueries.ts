import { gql } from '@apollo/client';

// Queries
export const GET_ALL_BOOKINGS = gql`
  query GetAllBookings {
    getAllBookings {
      id
      checkInDate
      checkOutDate
      numberOfGuests
      totalAmount
      status
      specialRequests
      notes
      cancellationReason
      cancellationDate
      createdAt
      updatedAt
      user {
        id
        firstName
        lastName
        email
      }
      room {
        id
        roomNumber
        type
        pricePerNight
        hotel {
          id
          name
          address
          city
        }
      }
      payment {
        id
        amount
        paymentMethod
        status
      }
    }
  }
`;

export const GET_USER_BOOKINGS = gql`
  query GetUserBookings($userId: String) {
    getBookings(userId: $userId) {
      id
      checkInDate
      checkOutDate
      numberOfGuests
      totalAmount
      status
      specialRequests
      notes
      cancellationReason
      cancellationDate
      createdAt
      updatedAt
      room {
        id
        roomNumber
        type
        pricePerNight
        hotel {
          id
          name
          address
          city
        }
      }
      payment {
        id
        amount
        paymentMethod
        status
      }
    }
  }
`;

export const GET_BOOKING = gql`
  query GetBooking($id: String!) {
    getBooking(id: $id) {
      id
      checkInDate
      checkOutDate
      numberOfGuests
      totalAmount
      status
      specialRequests
      notes
      cancellationReason
      cancellationDate
      createdAt
      updatedAt
      user {
        id
        firstName
        lastName
        email
      }
      room {
        id
        roomNumber
        type
        pricePerNight
        hotel {
          id
          name
          address
          city
        }
      }
      payment {
        id
        amount
        paymentMethod
        status
      }
    }
  }
`;

// Mutations
export const CREATE_BOOKING = gql`
  mutation CreateBooking($createBookingInput: CreateBookingInput!) {
    createBooking(createBookingInput: $createBookingInput) {
      id
      checkInDate
      checkOutDate
      numberOfGuests
      totalAmount
      status
      specialRequests
      notes
      createdAt
      updatedAt
      room {
        id
        roomNumber
        type
        pricePerNight
        hotel {
          id
          name
        }
      }
    }
  }
`;

export const UPDATE_BOOKING = gql`
  mutation UpdateBooking($id: String!, $updateBookingInput: UpdateBookingInput!) {
    updateBooking(id: $id, updateBookingInput: $updateBookingInput) {
      id
      checkInDate
      checkOutDate
      numberOfGuests
      totalAmount
      status
      specialRequests
      notes
      cancellationReason
      cancellationDate
      updatedAt
    }
  }
`;

export const CANCEL_BOOKING = gql`
  mutation CancelBooking($id: String!, $cancelBookingInput: CancelBookingInput!) {
    cancelBooking(id: $id, cancelBookingInput: $cancelBookingInput) {
      id
      status
      cancellationReason
      cancellationDate
      updatedAt
    }
  }
`;

export const DELETE_BOOKING = gql`
  mutation DeleteBooking($id: String!) {
    deleteBooking(id: $id)
  }
`;