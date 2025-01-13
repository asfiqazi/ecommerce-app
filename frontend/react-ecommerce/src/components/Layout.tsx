import React, { ReactNode } from 'react';
import { Container, Box } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh' 
      }}
    >
      <Navbar />
      <Container 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          mt: 4, 
          mb: 4 
        }}
      >
        {children}
      </Container>
      <Footer />
    </Box>
  );
};

export default Layout;
