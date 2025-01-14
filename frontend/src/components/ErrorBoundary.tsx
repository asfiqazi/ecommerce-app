import React, { Component, ErrorInfo, ReactNode } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box 
} from '@mui/material';
import { logger } from '../utils/logger';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false 
    };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { 
      hasError: true,
      error 
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to an error reporting service
    logger.error('Uncaught error:', error, errorInfo);
  }

  handleReload = () => {
    // Attempt to reload the page
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom error fallback UI
      return (
        <Container maxWidth="sm">
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              minHeight: '100vh',
              textAlign: 'center' 
            }}
          >
            <Typography variant="h4" color="error" gutterBottom>
              Something went wrong
            </Typography>
            
            <Typography variant="body1" paragraph>
              We're sorry, but an unexpected error occurred.
            </Typography>

            {this.state.error && (
              <Box 
                sx={{ 
                  bgcolor: 'error.light', 
                  color: 'error.contrastText',
                  p: 2,
                  borderRadius: 2,
                  mb: 2,
                  maxWidth: '100%',
                  overflow: 'auto'
                }}
              >
                <Typography variant="body2">
                  {this.state.error.message}
                </Typography>
              </Box>
            )}

            <Button 
              variant="contained" 
              color="primary" 
              onClick={this.handleReload}
            >
              Reload Page
            </Button>
          </Box>
        </Container>
      );
    }

    // Render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
