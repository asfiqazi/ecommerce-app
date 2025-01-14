import React, { useState } from 'react';
import { 
  Typography, 
  Grid, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Stepper, 
  Step, 
  StepLabel 
} from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import useCartStore from '../stores/cartStore';
import api from '../utils/api';
import PaymentForm from '../components/PaymentForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface ShippingFormInputs {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

const CheckoutPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState<ShippingFormInputs | null>(null);
  const { items, getTotalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { control, handleSubmit, formState: { errors } } = useForm<ShippingFormInputs>();

  const steps = ['Shipping Details', 'Payment'];

  const onShippingSubmit = async (data: ShippingFormInputs) => {
    try {
      // Create order
      const orderResponse = await api.post('/orders', {
        productIds: items.map(item => item.id),
        shippingAddress: `${data.address}, ${data.city}, ${data.state} ${data.zipCode}`
      });

      setShippingData(data);
      setActiveStep(1);
      setShippingData({
        ...data,
        orderId: orderResponse.data.id
      });
    } catch (error) {
      enqueueSnackbar('Failed to create order', { variant: 'error' });
    }
  };

  const handlePaymentSuccess = async () => {
    enqueueSnackbar('Payment successful!', { variant: 'success' });
    clearCart();
    navigate('/orders');
  };

  if (items.length === 0) {
    return (
      <Typography variant="h5" align="center">
        Your cart is empty
      </Typography>
    );
  }

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {activeStep === 0 && (
              <form onSubmit={handleSubmit(onShippingSubmit)}>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="firstName"
                      control={control}
                      defaultValue=""
                      rules={{ required: 'First name is required' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="First Name"
                          error={!!errors.firstName}
                          helperText={errors.firstName?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="lastName"
                      control={control}
                      defaultValue=""
                      rules={{ required: 'Last name is required' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Last Name"
                          error={!!errors.lastName}
                          helperText={errors.lastName?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="address"
                      control={control}
                      defaultValue=""
                      rules={{ required: 'Address is required' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Address"
                          error={!!errors.address}
                          helperText={errors.address?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="city"
                      control={control}
                      defaultValue=""
                      rules={{ required: 'City is required' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="City"
                          error={!!errors.city}
                          helperText={errors.city?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="state"
                      control={control}
                      defaultValue=""
                      rules={{ required: 'State is required' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="State"
                          error={!!errors.state}
                          helperText={errors.state?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="zipCode"
                      control={control}
                      defaultValue=""
                      rules={{ 
                        required: 'Zip code is required',
                        pattern: {
                          value: /^\d{5}(-\d{4})?$/,
                          message: 'Invalid zip code'
                        }
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Zip Code"
                          error={!!errors.zipCode}
                          helperText={errors.zipCode?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      color="primary" 
                      fullWidth
                    >
                      Continue to Payment
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}

            {activeStep === 1 && shippingData && (
              <Elements stripe={stripePromise}>
                <PaymentForm 
                  orderId={shippingData.orderId!} 
                  amount={getTotalPrice()} 
                  onSuccess={handlePaymentSuccess}
                />
              </Elements>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default CheckoutPage;
