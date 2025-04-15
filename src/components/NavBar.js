// src/components/NavBar.js
import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
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

// Import theme and styles
import { useTheme } from '@mui/material/styles';
import { drawerWidth } from '../styles/theme';

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

const NavBar = ({ onNotificationsToggle }) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const closeMobileDrawer = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const routes = [
    { path: '/', text: 'Dashboard', icon: <DashboardRoundedIcon /> },
    { path: '/ideas', text: 'Ideas', icon: <LightbulbRoundedIcon /> },
    { path: '/create', text: 'Create Idea', icon: <AddCircleRoundedIcon /> },
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
            JN
          </Avatar>
          <Box sx={{ ml: 1.5 }}>
            <Typography variant="subtitle2" fontWeight={600} color="white">
              Johnson Ngandjui
            </Typography>
            <Typography variant="caption" color="rgba(255,255,255,0.8)">
              Software Engineer
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
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
              <IconButton onClick={onNotificationsToggle}>
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
    </>
  );
};

export default NavBar;