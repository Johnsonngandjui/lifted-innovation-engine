// App.js - Simplified Layout with Modern React Patterns
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Toolbar } from '@mui/material';

// Import Components
import NavBar from './components/NavBar';
import Dashboard from './pages/Dashboard';
import IdeaList from './pages/IdeaList';
import IdeaForm from './pages/IdeaForm';
import AIEvaluation from './components/AIEvaluation';
import Settings from './pages/Settings';
import IdeaDetail from './pages/IdeaDetail';
import CreateIdea from './pages/createIdea';
import NotificationCenter from './components/NotificationCenter';
import { AppProvider } from './contexts/AppContext';

// Import theme
import theme, { drawerWidth } from './styles/theme';

function App() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleNotificationsToggle = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  return (
    <AppProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ display: 'flex' }}>
            <NavBar onNotificationsToggle={handleNotificationsToggle} />
            
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
                <Route path="/ideas/:id" element={<IdeaDetail />} />
                <Route path="/create" element={<CreateIdea />} />
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
        </Router>
      </ThemeProvider>
    </AppProvider>
  );
}

export default App;