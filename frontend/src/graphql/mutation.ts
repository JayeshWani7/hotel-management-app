import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation LoginUserInput($loginUserInput: LoginUserInput!) {
    login(loginUserInput: $loginUserInput) {
      accessToken
      user {
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
  }
`;

export const REGISTER_USER = gql`
 mutation Register($registerUserInput: RegisterUserInput!) {
    register(registerUserInput: $registerUserInput) {
      accessToken
      user {
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
  }
`;