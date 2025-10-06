import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMutation } from '@apollo/client/react';
import type { ReactNode } from 'react';
import type { User, AuthContextType, RegisterForm } from '../types';
import { LOGIN_USER, REGISTER_USER } from '../graphql/mutation';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = !!user && !!token;

  const [loginMutation] = useMutation(LOGIN_USER);
  const [registerMutation] = useMutation(REGISTER_USER);
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

    const { user: loggedInUser, token: jwtToken } = data.login;

    setUser(loggedInUser);
    setToken(jwtToken);

    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
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
    registerUserInput: {...userData,
      role: userData.role?.toUpperCase(),}
  },
      });
      

      const { user: registeredUser, token: jwtToken } = data.register;

      setUser(registeredUser);
      setToken(jwtToken);

      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(registeredUser));
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        logout();
      }
    }
  }, [token]);

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