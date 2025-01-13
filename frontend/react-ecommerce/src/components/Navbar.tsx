import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Badge 
} from '@mui/material';
import { 
  ShoppingCart as CartIcon, 
  AccountCircle as ProfileIcon 
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import useCartStore from '../stores/cartStore';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const { items } = useCartStore();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography 
          variant="h6" 
          component={RouterLink} 
          to="/" 
          sx={{ 
            flexGrow: 1, 
            color: 'inherit', 
            textDecoration: 'none' 
          }}
        >
          E-Commerce Store
        </Typography>

        <Button 
          color="inherit" 
          component={RouterLink} 
          to="/products"
        >
          Products
        </Button>

        <IconButton 
          color="inherit" 
          component={RouterLink} 
          to="/cart"
        >
          <Badge badgeContent={items.length} color="secondary">
            <CartIcon />
          </Badge>
        </IconButton>

        {isAuthenticated ? (
          <>
            <IconButton 
              color="inherit" 
              component={RouterLink} 
              to="/profile"
            >
              <ProfileIcon />
            </IconButton>
            <Button 
              color="inherit" 
              onClick={logout}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/login"
            >
              Login
            </Button>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/register"
            >
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
