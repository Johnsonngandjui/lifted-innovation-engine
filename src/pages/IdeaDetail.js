// pages/IdeaDetail.js - Detailed view of an idea with options to submit or enhance
import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
  Avatar,
  Paper,
  Tab,
  Tabs,
  IconButton,
  Alert,
  useTheme,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Badge,
  Snackbar
} from '@mui/material';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import CommentIcon from '@mui/icons-material/Comment';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import BusinessIcon from '@mui/icons-material/Business';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Import components
import ProgressTracker from '../components/ProgressTracker';
import JiraTicketCreator from '../components/JiraTicketCreator';

const IdeaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { ideas, updateIdea, evaluateIdea } = useContext(AppContext);
  const theme = useTheme();
  
  const idea = ideas.find((i) => i.id === parseInt(id));
  
  const [currentTab, setCurrentTab] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [enhanceDialogOpen, setEnhanceDialogOpen] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  if (!idea) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" gutterBottom>
          Idea not found
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/ideas')}
          sx={{ mt: 2 }}
        >
          Back to Ideas
        </Button>
      </Box>
    );
  }
  
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  
  const handleCommentChange = (event) => {
    setCommentText(event.target.value);
  };
  
  const handleAddComment = () => {
    if (commentText.trim()) {
      const now = new Date();
      const formattedDate = now.toISOString().slice(0, 10);
      
      const newComment = {
        user: 'Current User',
        comment: commentText,
        date: formattedDate
      };
      
      updateIdea(idea.id, {
        comments: [...idea.comments, newComment]
      });
      
      setCommentText('');
    }
  };
  
  const handleOpenSubmitDialog = () => {
    setSubmitDialogOpen(true);
  };
  
  const handleCloseSubmitDialog = () => {
    setSubmitDialogOpen(false);
  };
  
  const handleSubmitIdea = async () => {
    setSubmitting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    updateIdea(idea.id, {
      status: 'Submitted',
      dateSubmitted: new Date().toISOString().slice(0, 10)
    });
    
    setSubmitting(false);
    setSubmitDialogOpen(false);
    
    // Show success message
    setSnackbarMessage('Idea submitted successfully');
    setSnackbarOpen(true);
  };
  
  const handleOpenEnhanceDialog = () => {
    setEnhanceDialogOpen(true);
  };
  
  const handleCloseEnhanceDialog = () => {
    setEnhanceDialogOpen(false);
  };
  
  const handleEnhanceIdea = async () => {
    setEnhancing(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Use the existing evaluate idea function
    evaluateIdea(idea.id);
    
    setEnhancing(false);
    setEnhanceDialogOpen(false);
    
    // Show success message
    setSnackbarMessage('Idea enhanced successfully');
    setSnackbarOpen(true);
  };
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'primary';
      case 'Approved': return 'info';
      case 'Evaluation': return 'warning';
      case 'Submitted': return 'secondary';
      case 'Draft': return 'default';
      case 'Created': return 'info';
      default: return 'default';
    }
  };
  
  // Check if idea can be submitted
  const canSubmit = idea.status === 'Draft' || idea.status === 'Created';
  
  // Check if idea can be enhanced
  const canEnhance = idea.status !== 'Completed' && idea.status !== 'Rejected';
  
  // Render tabs content
  const renderTabContent = () => {
    switch (currentTab) {
      case 0: // Overview
        return (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Description
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {idea.description}
                    </Typography>
                    
                    <Typography variant="h6" gutterBottom>
                      Problem Statement
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {idea.problemStatement}
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="h6" gutterBottom>
                          Target Audience
                        </Typography>
                        <Typography variant="body1" paragraph>
                          {idea.targetAudience || "Not specified"}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Typography variant="h6" gutterBottom>
                          Expected Impact
                        </Typography>
                        <Typography variant="body1" paragraph>
                          {idea.expectedImpact}
                        </Typography>
                      </Grid>
                    </Grid>
                    
                    <Typography variant="h6" gutterBottom>
                      Resources Needed
                    </Typography>
                    <Typography variant="body1">
                      {idea.resourcesNeeded || "Not specified"}
                    </Typography>
                  </CardContent>
                </Card>
                
                {idea.aiScore && idea.aiScore.overall > 0 && (
                  <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <AssessmentIcon sx={{ color: theme.palette.primary.main, mr: 1.5 }} />
                        <Typography variant="h6">
                          AI Evaluation Scores
                        </Typography>
                      </Box>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Feasibility
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
                                <CircularProgress
                                  variant="determinate"
                                  value={idea.aiScore.feasibility}
                                  size={40}
                                  thickness={4}
                                  sx={{ color: theme.palette.primary.main }}
                                />
                                <Box
                                  sx={{
                                    top: 0,
                                    left: 0,
                                    bottom: 0,
                                    right: 0,
                                    position: 'absolute',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <Typography variant="body2" fontWeight="bold">
                                    {idea.aiScore.feasibility}%
                                  </Typography>
                                </Box>
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                Implementation difficulty
                              </Typography>
                            </Box>
                          </Paper>
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={4}>
                          <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Impact
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
                                <CircularProgress
                                  variant="determinate"
                                  value={idea.aiScore.impact}
                                  size={40}
                                  thickness={4}
                                  sx={{ color: theme.palette.secondary.main }}
                                />
                                <Box
                                  sx={{
                                    top: 0,
                                    left: 0,
                                    bottom: 0,
                                    right: 0,
                                    position: 'absolute',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <Typography variant="body2" fontWeight="bold">
                                    {idea.aiScore.impact}%
                                  </Typography>
                                </Box>
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                Business value
                              </Typography>
                            </Box>
                          </Paper>
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={4}>
                          <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Alignment
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
                                <CircularProgress
                                  variant="determinate"
                                  value={idea.aiScore.alignment}
                                  size={40}
                                  thickness={4}
                                  sx={{ color: theme.palette.success.main }}
                                />
                                <Box
                                  sx={{
                                    top: 0,
                                    left: 0,
                                    bottom: 0,
                                    right: 0,
                                    position: 'absolute',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <Typography variant="body2" fontWeight="bold">
                                    {idea.aiScore.alignment}%
                                  </Typography>
                                </Box>
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                Strategic fit
                              </Typography>
                            </Box>
                          </Paper>
                        </Grid>
                      
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                            <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
                              <CircularProgress
                                variant="determinate"
                                value={idea.aiScore.overall}
                                size={80}
                                thickness={6}
                                sx={{ 
                                  color: 
                                    idea.aiScore.overall >= 85 ? theme.palette.success.main :
                                    idea.aiScore.overall >= 70 ? theme.palette.primary.main :
                                    theme.palette.warning.main
                                }}
                              />
                              <Box
                                sx={{
                                  top: 0,
                                  left: 0,
                                  bottom: 0,
                                  right: 0,
                                  position: 'absolute',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexDirection: 'column'
                                }}
                              >
                                <Typography variant="h5" fontWeight="bold">
                                  {idea.aiScore.overall}%
                                </Typography>
                                <Typography variant="caption" sx={{ marginTop: -0.5 }}>
                                  Overall
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                              <Typography variant="body1" fontWeight="bold">
                                {idea.aiScore.overall >= 85 ? 'Excellent Idea' :
                                 idea.aiScore.overall >= 75 ? 'Strong Idea' :
                                 idea.aiScore.overall >= 65 ? 'Good Idea' :
                                 'Average Idea'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {idea.aiScore.overall >= 85 ? 'Highly recommended for implementation' :
                                 idea.aiScore.overall >= 75 ? 'Recommended for implementation' :
                                 idea.aiScore.overall >= 65 ? 'Consider implementation with refinements' :
                                 'Needs significant refinement'}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      
                        {canEnhance && (
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<AutoAwesomeIcon />}
                                onClick={handleOpenEnhanceDialog}
                              >
                                Enhance with AI Again
                              </Button>
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                )}
                
                {/* Implementation Progress */}
                {(idea.status === 'Approved' || idea.status === 'In Progress' || idea.status === 'Completed') && (
                  <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                      <ProgressTracker ideaId={idea.id} />
                    </CardContent>
                  </Card>
                )}
                
                {/* Jira Tickets */}
                {idea.status === 'Approved' && (
                  <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <AssignmentIcon sx={{ color: theme.palette.primary.main, mr: 1.5 }} />
                        <Typography variant="h6">
                          Implementation Tasks
                        </Typography>
                      </Box>
                      
                      {idea.jiraTickets && idea.jiraTickets.length > 0 ? (
                        <List>
                          {idea.jiraTickets.map((ticket) => (
                            <ListItem key={ticket.id}>
                              <ListItemIcon>
                                <AssignmentIcon color="primary" />
                              </ListItemIcon>
                              <ListItemText 
                                primary={`${ticket.id}: ${ticket.title}`}
                                secondary={`Status: ${ticket.status} | Assigned to: ${ticket.assignee}`}
                              />
                              <Chip 
                                label={ticket.status} 
                                size="small" 
                                color={
                                  ticket.status === 'Completed' ? 'success' : 
                                  ticket.status === 'In Progress' ? 'info' : 'default'
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                          <JiraTicketCreator ideaId={idea.id} />
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                )}
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Idea Details
                    </Typography>
                    
                    <List dense disablePadding>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <PersonIcon color="action" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Created by"
                          secondary={idea.submittedBy}
                          primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                          secondaryTypographyProps={{ variant: 'body1' }}
                        />
                      </ListItem>
                      
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <BusinessIcon color="action" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Department"
                          secondary={idea.department}
                          primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                          secondaryTypographyProps={{ variant: 'body1' }}
                        />
                      </ListItem>
                      
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CalendarTodayIcon color="action" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Date created"
                          secondary={idea.dateSubmitted}
                          primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                          secondaryTypographyProps={{ variant: 'body1' }}
                        />
                      </ListItem>
                      
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <AssignmentIcon color="action" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Status"
                          secondary={
                            <Chip
                              label={idea.status}
                              size="small"
                              color={getStatusColor(idea.status)}
                            />
                          }
                          primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                        />
                      </ListItem>
                    </List>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="subtitle1" gutterBottom>
                      Tags
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {idea.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                    
                    {/* Action buttons */}
                    <Box sx={{ mt: 3 }}>
                      {canSubmit && (
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          startIcon={<SendIcon />}
                          onClick={handleOpenSubmitDialog}
                          sx={{ mb: 2 }}
                        >
                          Submit for Approval
                        </Button>
                      )}
                      
                      {!idea.aiScore?.overall && canEnhance && (
                        <Button
                          variant="outlined"
                          color="secondary"
                          fullWidth
                          startIcon={<AutoAwesomeIcon />}
                          onClick={handleOpenEnhanceDialog}
                          sx={{ mb: 2 }}
                        >
                          Enhance with AI
                        </Button>
                      )}
                      
                      <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        fullWidth
                        sx={{ mb: 2 }}
                      >
                        Edit Idea
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );
      
      case 1: // Comments
        return (
          <Box>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Discussion
                </Typography>
                
                {idea.comments && idea.comments.length > 0 ? (
                  <List>
                    {idea.comments.map((comment, index) => (
                      <React.Fragment key={index}>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: theme.palette.primary.light }}>
                              {comment.user.charAt(0)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="subtitle2">
                                  {comment.user}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {comment.date}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Typography
                                variant="body2"
                                color="text.primary"
                                sx={{ mt: 1 }}
                              >
                                {comment.comment}
                              </Typography>
                            }
                          />
                        </ListItem>
                        {index < idea.comments.length - 1 && <Divider variant="inset" component="li" />}
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ py: 3, textAlign: 'center' }}>
                    <CommentIcon sx={{ fontSize: 40, color: theme.palette.grey[300], mb: 1 }} />
                    <Typography variant="body1" color="text.secondary">
                      No comments yet
                    </Typography>
                  </Box>
                )}
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Add Comment
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={commentText}
                    onChange={handleCommentChange}
                    placeholder="Share your thoughts or ask a question..."
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={!commentText.trim()}
                      onClick={handleAddComment}
                    >
                      Post Comment
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        );
      
      default:
        return null;
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Button
              variant="text"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/ideas')}
              sx={{ ml: -1, mr: 1 }}
            >
              Back to Ideas
            </Button>
            <Chip
              label={idea.status}
              color={getStatusColor(idea.status)}
              size="small"
            />
          </Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {idea.title}
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.95rem',
              minWidth: 120,
            },
          }}
        >
          <Tab label="Overview" />
          <Tab 
            label={
              <Badge 
                badgeContent={idea.comments ? idea.comments.length : 0} 
                color="primary"
                showZero={false}
              >
                Comments
              </Badge>
            } 
          />
        </Tabs>
      </Box>
      
      {renderTabContent()}
      
      {/* Submit Dialog */}
      <Dialog
        open={submitDialogOpen}
        onClose={handleCloseSubmitDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Submit Idea for Approval</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Are you sure you want to submit this idea for approval? Once submitted,
            your idea will be reviewed by the innovation team.
          </Typography>
          
          <Alert severity="info" sx={{ mb: 2 }}>
            Before submitting, ensure your idea description is clear and comprehensive.
            This will help reviewers understand and evaluate your concept.
          </Alert>
          
          {!idea.aiScore?.overall && (
            <Alert severity="warning">
              Your idea has not been evaluated by AI yet. It's recommended to enhance
              your idea with AI before submitting to improve evaluation scores.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSubmitDialog}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitIdea}
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={16} /> : <SendIcon />}
          >
            {submitting ? 'Submitting...' : 'Submit Idea'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Enhance with AI Dialog */}
      <Dialog
        open={enhanceDialogOpen}
        onClose={handleCloseEnhanceDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AutoAwesomeIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
            Enhance Idea with AI
          </Box>
        </DialogTitle>
        <DialogContent>
          {enhancing ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress size={60} sx={{ mb: 3 }} />
              <Typography variant="h6" gutterBottom>
                AI Enhancement in Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our AI is analyzing your idea to provide suggestions for improvement...
              </Typography>
            </Box>
          ) : (
            <>
              <Typography variant="body1" paragraph>
                The AI will evaluate your idea based on:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Feasibility" 
                    secondary="How realistic is implementation given current resources" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Impact" 
                    secondary="Potential positive effects on business metrics" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Alignment" 
                    secondary="How well the idea aligns with company goals" 
                  />
                </ListItem>
              </List>
              
              <Typography variant="body1" paragraph>
                You'll receive scores and recommendations to improve your idea.
              </Typography>
              
              <Alert severity="info">
                The AI enhancement process uses machine learning to evaluate your idea.
                Results are for guidance only and don't guarantee approval.
              </Alert>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEnhanceDialog} disabled={enhancing}>
            Cancel
          </Button>
          {!enhancing && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleEnhanceIdea}
              startIcon={<AutoAwesomeIcon />}
            >
              Enhance with AI
            </Button>
          )}
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default IdeaDetail;