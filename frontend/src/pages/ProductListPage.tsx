import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions, 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import useCartStore from '../stores/cartStore';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
}

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [category, searchTerm]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products', {
        params: { 
          category: category || undefined, 
          search: searchTerm || undefined 
        }
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleProductDetail = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Our Products
        </Typography>
      </Grid>

      <Grid item xs={12} container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Search Products"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              <MenuItem value="electronics">Electronics</MenuItem>
              <MenuItem value="clothing">Clothing</MenuItem>
              <MenuItem value="books">Books</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.imageUrl || '/placeholder-image.jpg'}
                  alt={product.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.description}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ${product.price.toFixed(2)}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    color="primary"
                    onClick={() => handleProductDetail(product.id)}
                  >
                    View Details
                  </Button>
                  <Button 
                    size="small" 
                    color="secondary"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProductListPage;
