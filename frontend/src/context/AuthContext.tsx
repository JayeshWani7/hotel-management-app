import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import type { ReactNode } from 'react';
import type { User, AuthContextType, RegisterForm } from '../types';
import { LOGIN_USER, REGISTER_USER } from '../graphql/mutation';
import { ME } from '../graphql/userQueries';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize both user and token from localStorage
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      try {
        return JSON.parse(storedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem('token');
    return storedToken && storedToken !== 'undefined' ? storedToken : null;
  });

  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = !!user && !!token;

  const [loginMutation] = useMutation(LOGIN_USER);
  const [registerMutation] = useMutation(REGISTER_USER);

  // Hydrate user from backend when token exists, to persist sessions accurately
  const { data: meData, loading: meLoading, refetch: refetchMe } = useQuery(ME, {
    skip: !localStorage.getItem('token'),
    fetchPolicy: 'cache-first',
  });
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data } = await loginMutation({
        variables: {
          loginUserInput: {
            email,
            password,
          },
        },
      });

      const { user: loggedInUser, accessToken } = (data as { login: { user: User; accessToken: string } }).login;

      setUser(loggedInUser);
      setToken(accessToken);
      // localStorage is handled by useEffect
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };


  const register = async (userData: RegisterForm) => {
    setIsLoading(true);
    try {
      const { data } = await registerMutation({
        variables: {
          registerUserInput: {
            ...userData,
            // Don't modify the role, use it as is since our enum values are lowercase
          }
        },
      });


      const { user: registeredUser, accessToken } = (data as { register: { user: User; accessToken: string } }).register;

      setUser(registeredUser);
      setToken(accessToken);
      // localStorage is handled by useEffect
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    // localStorage cleanup is handled by useEffect
  };

  // Sync localStorage with state when they change
  useEffect(() => {
    if (user && token) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    } else {
      // If either user or token is null, clear both from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [user, token]);

  // When ME query returns, set user if not already present or stale
  useEffect(() => {
    if (meData?.me) {
      setUser(meData.me);
    }
  }, [meData]);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};