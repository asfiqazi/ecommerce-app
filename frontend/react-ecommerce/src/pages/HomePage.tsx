import React from 'react';
import { 
  Typography, 
  Grid, 
  Button, 
  Container, 
  Box 
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box 
        sx={{ 
          textAlign: 'center', 
          py: 8 
        }}
      >
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
        >
          Welcome to Our E-Commerce Store
        </Typography>
        
        <Typography 
          variant="h5" 
          color="text.secondary" 
          paragraph
        >
          Discover amazing products at great prices
        </Typography>

        <Grid 
          container 
          spacing={2} 
          justifyContent="center"
        >
          <Grid item>
            <Button 
              variant="contained" 
              color="primary" 
              component={RouterLink} 
              to="/products"
              size="large"
            >
              Shop Now
            </Button>
          </Grid>
          <Grid item>
            <Button 
              variant="outlined" 
              color="primary" 
              component={RouterLink} 
              to="/products"
              size="large"
            >
              Browse Categories
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;
