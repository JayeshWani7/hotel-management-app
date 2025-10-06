import { gql } from '@apollo/client';

export const ME = gql`
  query Me {
    me {
      id
      firstName
      lastName
      email
      phone
      role
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_USERS = gql`
  query Users {
    users {
      id
      firstName
      lastName
      email
      role
      createdAt
    }
  }
`;



