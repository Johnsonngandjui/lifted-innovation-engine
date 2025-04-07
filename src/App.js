// App.js - Simplified Layout with Modern React Patterns
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  useMediaQuery,
  Divider,
  Tooltip,
  Badge
} from '@mui/material';

// Import Icons
import MenuIcon from '@mui/icons-material/Menu';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import LightbulbRoundedIcon from '@mui/icons-material/LightbulbRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';

// Import Components
import Dashboard from './pages/Dashboard';
import IdeaList from './pages/IdeaList';
import IdeaForm from './pages/IdeaForm';
import AIEvaluation from './components/AIEvaluation';
import Settings from './pages/Settings';
import NotificationCenter from './components/NotificationCenter';
import { AppProvider } from './contexts/AppContext';

// Modernized color palette with Liberty Mutual branding but more vibrant
const theme = createTheme({
  palette: {
    primary: {
      main: '#0057b8', // Enhanced Liberty Mutual blue
      light: '#4084eb',
      dark: '#003a88',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffc107', // Vibrant yellow
      light: '#fff350',
      dark: '#c79100',
      contrastText: '#000000',
    },
    background: {
      default: '#f8f9fb',
      paper: '#ffffff',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#03a9f4',
    },
    success: {
      main: '#4caf50',
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 4,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

const drawerWidth = 260;

function NavItem({ to, icon, text, selected, onClick, badge }) {
  return (
    <ListItem 
      button 
      component={Link} 
      to={to} 
      selected={selected}
      onClick={onClick}
      sx={{ 
        py: 1.5, 
        my: 0.5, 
        borderRadius: 2,
        color: selected ? 'primary.main' : 'grey.700',
        bgcolor: selected ? 'primary.light' : 'transparent',
        '&.Mui-selected': { 
          bgcolor: 'rgba(0, 87, 184, 0.1)',
          '&:hover': {
            bgcolor: 'rgba(0, 87, 184, 0.15)',
          }
        },
        '&:hover': {
          bgcolor: selected ? 'rgba(0, 87, 184, 0.15)' : 'rgba(0, 0, 0, 0.04)',
        }
      }}
    >
      <ListItemIcon sx={{ 
        color: selected ? 'primary.main' : 'grey.600',
        minWidth: 40,
      }}>
        {badge ? (
          <Badge badgeContent={badge} color="error">
            {icon}
          </Badge>
        ) : icon}
      </ListItemIcon>
      <ListItemText 
        primary={text} 
        primaryTypographyProps={{ 
          fontWeight: selected ? 600 : 500,
          fontSize: '0.95rem'
        }} 
      />
    </ListItem>
  );
}

function AppLayout() {
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNotificationsToggle = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  const closeMobileDrawer = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const routes = [
    { path: '/', text: 'Dashboard', icon: <DashboardRoundedIcon /> },
    { path: '/ideas', text: 'Ideas', icon: <LightbulbRoundedIcon /> },
    { path: '/submit', text: 'Submit Idea', icon: <AddCircleRoundedIcon /> },
    { path: '/evaluation', text: 'Evaluation', icon: <AssessmentRoundedIcon /> },
    { path: '/settings', text: 'Settings', icon: <SettingsRoundedIcon /> },
  ];

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: isMobile ? 'space-between' : 'center' 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LightbulbRoundedIcon 
            sx={{ 
              color: 'primary.main', 
              mr: 1, 
              fontSize: 28 
            }} 
          />
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700,
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            LIFTED
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} size="small">
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      
      <Divider sx={{ mx: 2 }} />
      
      <Box sx={{ px: 2, py: 3, flexGrow: 1 }}>
        <Typography 
          variant="body2" 
          color="grey.600" 
          sx={{ 
            ml: 2, 
            mb: 1, 
            textTransform: 'uppercase', 
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.5px'
          }}
        >
          Main Menu
        </Typography>
        
        <List component="nav" disablePadding>
          {routes.map((route) => (
            <NavItem
              key={route.path}
              to={route.path}
              icon={route.icon}
              text={route.text}
              selected={location.pathname === route.path}
              onClick={closeMobileDrawer}
              badge={route.path === '/ideas' ? 3 : null}
            />
          ))}
        </List>
      </Box>
      
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: 'primary.light',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Avatar
            sx={{ 
              width: 40, 
              height: 40,
              bgcolor: 'primary.main',
              color: 'white'
            }}
          >
            AJ
          </Avatar>
          <Box sx={{ ml: 1.5 }}>
            <Typography variant="subtitle2" fontWeight={600} color="white">
              Alex Johnson
            </Typography>
            <Typography variant="caption" color="rgba(255,255,255,0.8)">
              Product Manager
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar 
        position="fixed" 
        color="inherit"
        sx={{ 
          width: { md: `calc(100% - ${drawerWidth}px)` }, 
          ml: { md: `${drawerWidth}px` },
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          bgcolor: 'background.paper'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 500, color: 'text.primary' }}>
            {routes.find(route => route.path === location.pathname)?.text || 'Dashboard'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Notifications">
              <IconButton onClick={handleNotificationsToggle}>
                <Badge badgeContent={4} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: 'none',
              boxShadow: '4px 0 10px rgba(0,0,0,0.05)'
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'grey.100'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
          overflow: 'hidden'
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ideas" element={<IdeaList />} />
          <Route path="/submit" element={<IdeaForm />} />
          <Route path="/evaluation" element={<AIEvaluation />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Box>

      {/* Notifications panel */}
      <NotificationCenter 
        open={notificationsOpen} 
        onClose={() => setNotificationsOpen(false)} 
      />
    </Box>
  );
}

function App() {
  return (
    <AppProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppLayout />
        </Router>
      </ThemeProvider>
    </AppProvider>
  );
}

export default App;