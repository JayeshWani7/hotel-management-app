import { gql } from '@apollo/client';

export const INITIATE_PAYMENT = gql`
  mutation InitiatePayment($bookingId: String!) {
    initiatePayment(bookingId: $bookingId) {
      orderId
      orderToken
      paymentSessionId
    }
  }
`;

export const VERIFY_PAYMENT = gql`
  mutation VerifyPayment($orderId: String!) {
    verifyPayment(orderId: $orderId)
  }
`;

export const GET_PAYMENTS = gql`
  query GetPayments {
    getPayments {
      id
      amount
      status
      method
      transactionId
      createdAt
    }
  }
`;

export const GET_PAYMENT_BY_BOOKING = gql`
  query GetPaymentByBooking($bookingId: String!) {
    getPaymentByBooking(bookingId: $bookingId) {
      id
      amount
      status
      method
      transactionId
      createdAt
    }
  }
`;



