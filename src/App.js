import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link } from 'react-router-dom';

import Dashboard from './components/Dashboard';
import IdeaForm from './components/IdeaForm';
import IdeaList from './components/IdeaList';
import AIEvaluation from './components/AIEvaluation';
import { AppProvider } from './contexts/AppContext';

const drawerWidth = 240;

const theme = createTheme({
  palette: {
    primary: {
      main: '#00539b', // Liberty Mutual blue
      light: '#2179cf',
      dark: '#003b6f',
    },
    secondary: {
      main: '#ffd200', // Liberty Mutual yellow
      light: '#ffdb4d',
      dark: '#d9b300',
    },
    background: {
      default: '#f7f7f7',
      paper: '#ffffff',
    },
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#ed6c02',
    },
    info: {
      main: '#0288d1',
    },
    success: {
      main: '#2e7d32',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <AppProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
              <Toolbar>
                <LightbulbIcon sx={{ mr: 2 }} />
                <Typography variant="h6" noWrap component="div">
                  LIFTED Innovation Engine
                </Typography>
              </Toolbar>
            </AppBar>
            <Drawer
              variant="permanent"
              sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
              }}
            >
              <Toolbar />
              <Box sx={{ overflow: 'auto' }}>
                <List>
                  <ListItem button component={Link} to="/">
                    <ListItemIcon>
                      <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                  </ListItem>
                  <ListItem button component={Link} to="/ideas">
                    <ListItemIcon>
                      <LightbulbIcon />
                    </ListItemIcon>
                    <ListItemText primary="Ideas" />
                  </ListItem>
                  <ListItem button component={Link} to="/submit">
                    <ListItemIcon>
                      <LightbulbIcon color="action" />
                    </ListItemIcon>
                    <ListItemText primary="Submit Idea" />
                  </ListItem>
                  <ListItem button component={Link} to="/evaluation">
                    <ListItemIcon>
                      <AssessmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="AI Evaluation" />
                  </ListItem>
                  <ListItem button component={Link} to="/settings">
                    <ListItemIcon>
                      <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                  </ListItem>
                </List>
              </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
              <Toolbar />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/ideas" element={<IdeaList />} />
                <Route path="/submit" element={<IdeaForm />} />
                <Route path="/evaluation" element={<AIEvaluation />} />
                <Route path="/settings" element={<p>Settings page (coming soon)</p>} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </ThemeProvider>
    </AppProvider>
  );
}

export default App;