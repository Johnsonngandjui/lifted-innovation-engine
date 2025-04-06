import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Grid,
  TextField,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const JiraTicketCreator = ({ ideaId }) => {
  const { ideas, createJiraTickets } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [ticketsCreated, setTicketsCreated] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState('');
  
  const idea = ideas.find(i => i.id === ideaId);
  
  const handleOpen = () => {
    setOpen(true);
    setTicketsCreated(false);
    setAdditionalInfo('');
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleInfoChange = (e) => {
    setAdditionalInfo(e.target.value);
  };
  
  const handleCreateTickets = async () => {
    setGenerating(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    createJiraTickets(ideaId);
    setGenerating(false);
    setTicketsCreated(true);
  };
  
  return (
    <>
      <Button 
        variant="contained"
        color="secondary"
        onClick={handleOpen}
      >
        Create Jira Tickets
      </Button>
      
      <Dialog 
        open={open} 
        onClose={handleClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Create Jira Tickets for {idea?.title}
        </DialogTitle>
        <DialogContent dividers>
          {ticketsCreated ? (
            <Box>
              <Alert severity="success" sx={{ mb: 3 }}>
                Jira tickets successfully created!
              </Alert>
              
              <Typography variant="subtitle1" gutterBottom>
                Generated Tickets
              </Typography>
              
              <List>
                {idea?.jiraTickets.map((ticket) => (
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
              
              <Box sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                <Typography>
                  Idea status updated to "Approved"
                </Typography>
              </Box>
            </Box>
          ) : generating ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>
                Generating Jira tickets...
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant="body1" paragraph>
                The AI will generate Jira tickets based on the idea details and AI evaluation. These tickets will help break down the implementation into manageable tasks.
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Idea Overview
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {idea?.description}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      AI Evaluation Score
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Chip label={`Feasibility: ${idea?.aiScore.feasibility}%`} />
                      <Chip label={`Impact: ${idea?.aiScore.impact}%`} />
                      <Chip label={`Alignment: ${idea?.aiScore.alignment}%`} />
                    </Box>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Assigned Team
                    </Typography>
                    <Typography variant="body2">
                      {idea?.assignedTeam}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Additional Implementation Details
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Add any additional details that might help with ticket creation..."
                    value={additionalInfo}
                    onChange={handleInfoChange}
                  />
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      The AI will generate:
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Task breakdown based on implementation needs" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Appropriate ticket types (Epic, Story, Task)" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Initial assignments to relevant teams" />
                      </ListItem>
                    </List>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {ticketsCreated ? (
            <Button onClick={handleClose} variant="contained">
              Close
            </Button>
          ) : (
            <>
              <Button onClick={handleClose}>
                Cancel
              </Button>
              {!generating && (
                <Button 
                  variant="contained"
                  color="primary"
                  onClick={handleCreateTickets}
                  disabled={generating}
                >
                  Generate Tickets
                </Button>
              )}
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default JiraTicketCreator;