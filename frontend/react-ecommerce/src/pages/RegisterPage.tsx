import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Link, 
  Paper 
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import useAuthStore from '../stores/authStore';

interface RegisterFormInputs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const { control, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormInputs>();
  const { register } = useAuthStore();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);

  const password = watch('password');

  const onSubmit = async (data: RegisterFormInputs) => {
    setIsLoading(true);
    try {
      await register(
        data.email, 
        data.password, 
        data.firstName, 
        data.lastName
      );
      enqueueSnackbar('Registration successful', { variant: 'success' });
      navigate('/');
    } catch (error) {
      enqueueSnackbar('Registration failed. Please try again.', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper 
        elevation={3} 
        sx={{ 
          marginTop: 8, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          p: 4 
        }}
      >
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Box 
          component="form" 
          onSubmit={handleSubmit(onSubmit)} 
          sx={{ mt: 1, width: '100%' }}
        >
          <Controller
            name="firstName"
            control={control}
            defaultValue=""
            rules={{ 
              required: 'First name is required',
              minLength: {
                value: 2,
                message: "First name must be at least 2 characters"
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                fullWidth
                label="First Name"
                autoFocus
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
            )}
          />
          <Controller
            name="lastName"
            control={control}
            defaultValue=""
            rules={{ 
              required: 'Last name is required',
              minLength: {
                value: 2,
                message: "Last name must be at least 2 characters"
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                fullWidth
                label="Last Name"
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{ 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                fullWidth
                label="Email Address"
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{ 
              required: 'Password is required',
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters"
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                fullWidth
                label="Password"
                type="password"
                autoComplete="new-password"
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />
          <Controller
            name="confirmPassword"
            control={control}
            defaultValue=""
            rules={{ 
              required: 'Please confirm your password',
              validate: (value) => 
                value === password || "Passwords do not match"
            }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                fullWidth
                label="Confirm Password"
                type="password"
                autoComplete="new-password"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
            )}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link 
              component={RouterLink} 
              to="/login" 
              variant="body2"
            >
              {"Already have an account? Sign In"}
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
