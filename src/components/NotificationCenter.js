// components/NotificationCenter.js - Modern notification panel
import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Button,
  Tabs,
  Tab,
  Badge,
  useTheme,
  Chip
} from '@mui/material';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UpdateIcon from '@mui/icons-material/Update';
import PersonIcon from '@mui/icons-material/Person';
import BoltIcon from '@mui/icons-material/Bolt';
import CommentIcon from '@mui/icons-material/Comment';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import FilterNoneIcon from '@mui/icons-material/FilterNone';

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: 'idea_evaluated',
    title: 'AI Evaluation Complete',
    message: 'Your idea "AI-Powered Customer Service Chatbot" has been evaluated with a score of 83%.',
    time: '10 minutes ago',
    read: false,
    actionable: true,
    icon: <AssessmentIcon />,
    color: 'primary.main',
    link: '/ideas'
  },
  {
    id: 2,
    type: 'comment',
    title: 'New Comment',
    message: 'Sarah Kim commented on your idea: "This could significantly reduce our response time."',
    time: '1 hour ago',
    read: false,
    actionable: false,
    icon: <CommentIcon />,
    color: 'info.main',
    link: '/ideas'
  },
  {
    id: 3,
    type: 'status_change',
    title: 'Status Updated',
    message: 'Your idea "Smart Resource Allocation System" has been moved to "In Progress".',
    time: '3 hours ago',
    read: true,
    actionable: false,
    icon: <UpdateIcon />,
    color: 'success.main',
    link: '/ideas'
  },
  {
    id: 4,
    type: 'mention',
    title: 'You were mentioned',
    message: 'Jordan Smith mentioned you in a comment on "Predictive Maintenance for Network Infrastructure".',
    time: '1 day ago',
    read: true,
    actionable: false,
    icon: <PersonIcon />,
    color: 'secondary.main',
    link: '/ideas'
  },
  {
    id: 5,
    type: 'system',
    title: 'System Update',
    message: 'The LIFTED Innovation Engine has been updated with new AI evaluation capabilities.',
    time: '2 days ago',
    read: true,
    actionable: false,
    icon: <BoltIcon />,
    color: 'warning.main',
    link: '/settings'
  }
];

const NotificationCenter = ({ open, onClose }) => {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(0);
  const [notifications, setNotifications] = useState(mockNotifications);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  
  // Mark all as read
  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({
        ...notification,
        read: true
      }))
    );
  };
  
  // Mark a single notification as read
  const handleMarkAsRead = (id) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  // Get filtered notifications based on current tab
  const getFilteredNotifications = () => {
    if (currentTab === 0) {
      return notifications;
    } else if (currentTab === 1) {
      return notifications.filter(notification => !notification.read);
    } else {
      return notifications.filter(notification => notification.actionable);
    }
  };
  
  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(notification => !notification.read).length;
  const actionableCount = notifications.filter(notification => notification.actionable).length;
  
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          maxWidth: '100%'
        }
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <NotificationsIcon sx={{ mr: 1.5, color: 'primary.main' }} />
          <Typography variant="h6">Notifications</Typography>
          {unreadCount > 0 && (
            <Badge
              badgeContent={unreadCount}
              color="primary"
              sx={{ ml: 1 }}
            />
          )}
        </Box>
        <IconButton onClick={onClose} size="small" edge="end">
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider />
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem'
            }
          }}
        >
          <Tab 
            label="All" 
            id="notification-tab-0"
            aria-controls="notification-tabpanel-0"
          />
          <Tab 
            label={
              <Badge badgeContent={unreadCount} color="primary">
                Unread
              </Badge>
            }
            id="notification-tab-1"
            aria-controls="notification-tabpanel-1"
            disabled={unreadCount === 0}
          />
          <Tab 
            label={
              <Badge badgeContent={actionableCount} color="primary">
                Action
              </Badge>
            }
            id="notification-tab-2"
            aria-controls="notification-tabpanel-2"
            disabled={actionableCount === 0}
          />
        </Tabs>
      </Box>
      
      <Box
        role="tabpanel"
        id={`notification-tabpanel-${currentTab}`}
        aria-labelledby={`notification-tab-${currentTab}`}
        sx={{ 
          flex: 1, 
          overflow: 'auto',
          bgcolor: theme.palette.grey[50]
        }}
      >
        {filteredNotifications.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              py: 8
            }}
          >
            <FilterNoneIcon 
              sx={{ 
                fontSize: 64, 
                color: theme.palette.grey[300],
                mb: 2
              }} 
            />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No notifications
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              {currentTab === 1 
                ? "You've read all notifications" 
                : currentTab === 2 
                ? "No actions needed at this time" 
                : "You don't have any notifications yet"}
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {filteredNotifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <ListItem 
                  alignItems="flex-start"
                  sx={{ 
                    py: 2, 
                    px: 3, 
                    backgroundColor: notification.read ? 'transparent' : 'rgba(0, 87, 184, 0.04)',
                    transition: 'background-color 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: notification.read ? 'rgba(0, 0, 0, 0.02)' : 'rgba(0, 87, 184, 0.06)'
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: notification[notification.color] || notification.color }}>
                      {notification.icon}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: notification.read ? 500 : 600,
                            mr: 1
                          }}
                        >
                          {notification.title}
                        </Typography>
                        {!notification.read && (
                          <Chip 
                            size="small" 
                            label="New" 
                            color="primary" 
                            sx={{ 
                              height: 20, 
                              fontSize: '0.625rem',
                              fontWeight: 600
                            }} 
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          variant="body2"
                          color="text.primary"
                          sx={{ 
                            display: 'block',
                            mb: 0.5,
                            fontWeight: notification.read ? 400 : 500
                          }}
                        >
                          {notification.message}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {notification.time}
                          </Typography>
                          {!notification.read && (
                            <Button 
                              variant="text" 
                              size="small" 
                              sx={{ minWidth: 'auto', p: 0.5 }}
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              Mark as read
                            </Button>
                          )}
                        </Box>
                      </>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
      
      <Divider />
      
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          startIcon={<MarkEmailReadIcon />}
          onClick={handleMarkAllAsRead}
          disabled={!notifications.some(n => !n.read)}
        >
          Mark all as read
        </Button>
        <Button
          variant="outlined"
          onClick={onClose}
        >
          Close
        </Button>
      </Box>
    </Drawer>
  );
};

export default NotificationCenter;