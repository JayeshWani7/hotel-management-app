import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import type { RegisterForm } from '../../types';

const Register: React.FC = () => {
  const { register: registerUser, isLoading } = useAuth();
  const [error, setError] = useState<string>('');
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();

  const watchPassword = watch('password');
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError('');
      if (data.password !== data.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      const { confirmPassword, ...safeData } = data;
      await registerUser(safeData);
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor={isSmall ? 'grey.50' : 'grey.100'}
      px={2}
      py={isMobile ? 1 : 2}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', sm: 500, md: 580, lg: 600 },
          boxShadow: 3,
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
          <Typography
            variant={isSmall ? 'h5' : 'h4'}
            component="h1"
            textAlign="center"
            mb={3}
            fontWeight="bold"
          >
            Sign Up
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Box 
              display="flex" 
              flexDirection={{ xs: 'column', sm: 'row' }} 
              gap={isMobile ? 0 : 2}
            >
              <TextField
                fullWidth
                label="First Name"
                margin="normal"
                {...register('firstName', {
                  required: 'First name is required',
                })}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />

              <TextField
                fullWidth
                label="Last Name"
                margin="normal"
                {...register('lastName', {
                  required: 'Last name is required',
                })}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </Box>

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              margin="normal"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              fullWidth
              label="Phone Number (Optional)"
              margin="normal"
              {...register('phone')}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Controller
                name="role"
                control={control}
                defaultValue={UserRole.USER}
                render={({ field }) => (
                  <Select {...field} label="Role">
                    <MenuItem value={UserRole.USER}>Customer</MenuItem>
                    <MenuItem value={UserRole.HOTEL_MANAGER}>Hotel Manager</MenuItem>
                    <MenuItem value={UserRole.ADMIN}>Admin</MenuItem>

                  </Select>
                )}
              />
            </FormControl>

            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              margin="normal"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === watchPassword || 'Passwords do not match',
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.3 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
            </Button>

            <Box textAlign="center">
              <Typography variant="body2">
                Already have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/login"
                  variant="body2"
                  sx={{ cursor: 'pointer', fontWeight: 500, textDecoration: 'none' }}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;