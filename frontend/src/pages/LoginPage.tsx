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

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      enqueueSnackbar('Login successful', { variant: 'success' });
      navigate('/');
    } catch (error) {
      enqueueSnackbar('Login failed. Please check your credentials.', { variant: 'error' });
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
          Sign in
        </Typography>
        <Box 
          component="form" 
          onSubmit={handleSubmit(onSubmit)} 
          sx={{ mt: 1, width: '100%' }}
        >
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
                autoFocus
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
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password?.message}
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
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link 
              component={RouterLink} 
              to="/register" 
              variant="body2"
            >
              {"Don't have an account? Sign Up"}
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
