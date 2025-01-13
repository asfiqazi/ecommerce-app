import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Typography, 
  Button, 
  Paper, 
  Divider 
} from '@mui/material';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import useCartStore from '../stores/cartStore';
import { useSnackbar } from 'notistack';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  imageUrl?: string;
}

const ProductDetailPage: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCartStore();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch product details', error);
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      enqueueSnackbar(`${product.name} added to cart`, { variant: 'success' });
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!product) {
    return <Typography>Product not found</Typography>;
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Paper elevation={3}>
          <img 
            src={product.imageUrl || '/placeholder-image.jpg'} 
            alt={product.name} 
            style={{ 
              width: '100%', 
              maxHeight: '500px', 
              objectFit: 'cover' 
            }} 
          />
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Typography variant="h4" gutterBottom>
          {product.name}
        </Typography>

        <Typography variant="h6" color="primary" gutterBottom>
          ${product.price.toFixed(2)}
        </Typography>

        <Typography variant="body1" paragraph>
          {product.description}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1">
              Category: {product.category}
            </Typography>
            <Typography variant="subtitle1">
              Stock: {product.stockQuantity} available
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              disabled={product.stockQuantity === 0}
              onClick={handleAddToCart}
            >
              {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProductDetailPage;
