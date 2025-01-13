import React from 'react';
import { 
  Typography, 
  Grid, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  IconButton, 
  Divider 
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../stores/cartStore';

const CartPage: React.FC = () => {
  const { items, removeFromCart, getTotalPrice } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <Grid 
        container 
        spacing={2} 
        direction="column" 
        alignItems="center" 
        justifyContent="center"
        style={{ minHeight: '50vh' }}
      >
        <Grid item>
          <Typography variant="h5">
            Your cart is empty
          </Typography>
        </Grid>
        <Grid item>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </Button>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Your Cart
        </Typography>
      </Grid>

      <Grid item xs={12} md={8}>
        {items.map((product) => (
          <Card 
            key={product.id} 
            sx={{ 
              display: 'flex', 
              mb: 2, 
              alignItems: 'center' 
            }}
          >
            <CardMedia
              component="img"
              sx={{ 
                width: 151, 
                height: 151, 
                objectFit: 'cover' 
              }}
              image={product.imageUrl || '/placeholder-image.jpg'}
              alt={product.name}
            />
            <CardContent 
              sx={{ 
                flex: '1 0 auto', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                width: '100%' 
              }}
            >
              <div>
                <Typography component="h5" variant="h5">
                  {product.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  ${product.price.toFixed(2)}
                </Typography>
              </div>
              <IconButton 
                color="error" 
                onClick={() => removeFromCart(product.id)}
              >
                <DeleteIcon />
              </IconButton>
            </CardContent>
          </Card>
        ))}
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container justifyContent="space-between">
              <Grid item>
                <Typography variant="body1">
                  Total Items
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body1">
                  {items.length}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>
              <Grid item>
                <Typography variant="h6">
                  Total Price
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" color="primary">
                  ${getTotalPrice().toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              sx={{ mt: 3 }}
              onClick={handleCheckout}
              disabled={items.length === 0}
            >
              Proceed to Checkout
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default CartPage;
