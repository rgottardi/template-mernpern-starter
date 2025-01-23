import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Assessment as AssessmentIcon,
  Security as SecurityIcon,
  Architecture as ArchitectureIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';

/**
 * @desc Enterprise QMS styled landing page component
 */
function App() {
  const features = [
    {
      title: 'Quality Management',
      description: 'Comprehensive multi-tenant architecture with role-based access control',
      icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Enterprise Security',
      description: 'Advanced authentication, audit trails, and data protection',
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Service Architecture',
      description: 'Microservices-inspired design with robust service management',
      icon: <ArchitectureIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Data Management',
      description: 'Multi-database support with MongoDB and PostgreSQL',
      icon: <StorageIcon sx={{ fontSize: 40 }} />,
    },
  ];

  return (
    <Box>
      {/* Navigation Bar */}
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Enterprise QMS Template
          </Typography>
          <Button color="inherit">Documentation</Button>
          <Button color="inherit">GitHub</Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', py: 10 }}>
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }}
          >
            Quality Management System
          </Typography>
          <Typography 
            variant="h5" 
            paragraph 
            sx={{ 
              mb: 4,
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            A comprehensive enterprise-grade template for building secure, scalable, and compliant applications
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              size="large"
              color="secondary"
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ 
                color: 'common.white', 
                borderColor: 'rgba(255, 255, 255, 0.5)',
                '&:hover': {
                  borderColor: 'common.white',
                }
              }}
            >
              Learn More
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ mb: 2, color: 'secondary.main' }}>{feature.icon}</Box>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="h2"
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 4,
          px: 2,
          mt: 'auto',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="sm">
          <Typography 
            variant="body2" 
            color="text.secondary" 
            align="center"
          >
            {'© '}
            {new Date().getFullYear()}
            {' Enterprise QMS Template. All rights reserved.'}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default App;