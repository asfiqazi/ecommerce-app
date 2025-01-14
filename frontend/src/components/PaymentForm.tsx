import React, { useState } from 'react';
import { 
  CardElement, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';
import { 
  Button, 
  Typography, 
  Grid 
} from '@mui/material';
import { useSnackbar } from 'notistack';
import api from '../utils/api';

interface PaymentFormProps {
  orderId: string;
  amount: number;
  onSuccess: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  orderId, 
  amount, 
  onSuccess 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { enqueueSnackbar } = useSnackbar();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // Get payment intent from backend
      const { data } = await api.post('/payments/create-intent', { orderId });
      
      // Confirm card payment
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        }
      });

      if (result.error) {
        enqueueSnackbar(result.error.message || 'Payment failed', { variant: 'error' });
      } else {
        onSuccess();
      }
    } catch (error) {
      enqueueSnackbar('Payment processing failed', { variant: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">
            Payment Details
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            Total Amount: ${amount.toFixed(2)}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={!stripe || isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default PaymentForm;
