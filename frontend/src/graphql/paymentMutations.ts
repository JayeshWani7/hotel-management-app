import { gql } from '@apollo/client';

export const INITIATE_PAYMENT = gql`
  mutation InitiatePayment($bookingId: String!) {
    initiatePayment(bookingId: $bookingId) {
      paymentLink
    }
  }
`;

export const VERIFY_PAYMENT = gql`
  mutation VerifyPayment($link_id: String!) {
    verifyPayment(orderId: $link_id)
  }
`;
