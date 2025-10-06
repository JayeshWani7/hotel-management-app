import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, from } from '@apollo/client';

// HTTP connection to your backend
const httpLink = new HttpLink({
  uri: 'http://localhost:3000/graphql',
});

// Auth middleware
const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('token');
  if (token) {
    operation.setContext({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return forward(operation);
});

// Create Apollo Client
export const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});
