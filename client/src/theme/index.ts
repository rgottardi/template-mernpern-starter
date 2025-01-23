import { createTheme } from '@mui/material/styles';

/**
 * @desc Enterprise QMS theme configuration
 */
export const theme = createTheme({
  palette: {
    primary: {
      main: '#2c4a52',
      light: '#4a9ea1',
      dark: '#1e353b',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#4a9ea1',
      light: '#6fc1c4',
      dark: '#3d8588',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c4a52',
      secondary: '#546e7a',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
      letterSpacing: '0.5px',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 500,
      letterSpacing: '0.5px',
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 500,
      letterSpacing: '0.3px',
    },
    h4: {
      fontWeight: 500,
      letterSpacing: '0.2px',
    },
    h5: {
      fontWeight: 500,
      letterSpacing: '0.1px',
    },
    h6: {
      fontWeight: 500,
      letterSpacing: '0.1px',
    },
    subtitle1: {
      fontWeight: 400,
      letterSpacing: '0.1px',
    },
    subtitle2: {
      fontWeight: 500,
      letterSpacing: '0.1px',
    },
    body1: {
      letterSpacing: '0.1px',
      lineHeight: 1.6,
    },
    body2: {
      letterSpacing: '0.1px',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      letterSpacing: '0.1px',
    },
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          fontSize: '0.95rem',
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        outlined: {
          borderWidth: '1px',
          '&:hover': {
            borderWidth: '1px',
          },
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid',
          borderColor: 'divider',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingTop: '2rem',
          paddingBottom: '2rem',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: 8,
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 64,
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 2px 4px rgba(0,0,0,0.05)',
    '0 4px 8px rgba(0,0,0,0.05)',
    '0 8px 16px rgba(0,0,0,0.05)',
    '0 12px 24px rgba(0,0,0,0.05)',
    '0 16px 32px rgba(0,0,0,0.05)',
    '0 20px 40px rgba(0,0,0,0.05)',
    '0 24px 48px rgba(0,0,0,0.05)',
    '0 28px 56px rgba(0,0,0,0.05)',
    '0 32px 64px rgba(0,0,0,0.05)',
    '0 36px 72px rgba(0,0,0,0.05)',
    '0 40px 80px rgba(0,0,0,0.05)',
    '0 44px 88px rgba(0,0,0,0.05)',
    '0 48px 96px rgba(0,0,0,0.05)',
    '0 52px 104px rgba(0,0,0,0.05)',
    '0 56px 112px rgba(0,0,0,0.05)',
    '0 60px 120px rgba(0,0,0,0.05)',
    '0 64px 128px rgba(0,0,0,0.05)',
    '0 68px 136px rgba(0,0,0,0.05)',
    '0 72px 144px rgba(0,0,0,0.05)',
    '0 76px 152px rgba(0,0,0,0.05)',
    '0 80px 160px rgba(0,0,0,0.05)',
    '0 84px 168px rgba(0,0,0,0.05)',
    '0 88px 176px rgba(0,0,0,0.05)',
    '0 92px 184px rgba(0,0,0,0.05)',
  ],
});