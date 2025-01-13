import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Define custom color palette
const PRIMARY_COLOR = '#1976d2';  // Deep Blue
const SECONDARY_COLOR = '#dc004e';  // Vibrant Red
const BACKGROUND_COLOR = '#f4f4f4';  // Light Gray

const theme = createTheme({
  palette: {
    primary: {
      main: PRIMARY_COLOR,
      light: '#4791db',
      dark: '#115293',
    },
    secondary: {
      main: SECONDARY_COLOR,
      light: '#e33371',
      dark: '#9a0036',
    },
    background: {
      default: BACKGROUND_COLOR,
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 500,
      fontSize: '2rem',
    },
    body1: {
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          padding: '10px 20px',
        },
        containedPrimary: {
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 6px 8px rgba(0,0,0,0.15)',
          }
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
          }
        }
      }
    },
  },
});

// Make typography responsive
const responsiveTheme = responsiveFontSizes(theme);

export default responsiveTheme;
