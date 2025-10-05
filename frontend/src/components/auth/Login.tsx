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
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import type { LoginForm } from '../../types';

const Login: React.FC = () => {
    const { login, isLoading } = useAuth();
    const [error, setError] = useState<string>('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>();

    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

    const onSubmit = async (data: LoginForm) => {
        try {
            setError('');
            await login(data.email, data.password);
        } catch (err) {
            setError('Invalid email or password');
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
            py={isSmall ? 1 : 2}
        >
            <Card
                sx={{
                    width: '100%',
                    maxWidth: { xs: '100%', sm: 420, md: 480, lg: 500 },
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
                        Sign In
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
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

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, py: 1.3 }}
                            disabled={isLoading}
                        >
                            {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
                        </Button>

                        <Box textAlign="center">
                            <Typography variant="body2">
                                Don&apos;t have an account?{' '}
                                <Link
                                    component={RouterLink}
                                    to="/register"
                                    variant="body2"
                                    sx={{ cursor: 'pointer', fontWeight: 500, textDecoration: 'none' }}
                                >
                                    Sign Up
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Login;
