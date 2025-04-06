import React, { useContext, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Slider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const ProgressTracker = ({ ideaId }) => {
  const { ideas, updateIdea } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [statusValue, setStatusValue] = useState('');
  const [updateNotes, setUpdateNotes] = useState('');
  
  const idea = ideas.find(i => i.id === ideaId);
  
  if (!idea) return null;
  
  const handleOpen = () => {
    setOpen(true);
    setProgressValue(idea.progress);
    setStatusValue(idea.status);
    setUpdateNotes('');
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleProgressChange = (event, newValue) => {
    setProgressValue(newValue);
  };
  
  const handleStatusChange = (event) => {
    setStatusValue(event.target.value);
  };
  
  const handleNotesChange = (event) => {
    setUpdateNotes(event.target.value);
  };
  
  const handleUpdate = () => {
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 10);
    
    const newComment = {
      user: 'Current User',
      comment: updateNotes,
      date: formattedDate
    };
    
    updateIdea(idea.id, {
      progress: progressValue,
      status: statusValue,
      comments: [...idea.comments, newComment]
    });
    
    setOpen(false);
  };
  
  return (
    <Box>
      <Card variant="outlined">
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Implementation Progress
            </Typography>
            <Button
              startIcon={<EditIcon />}
              variant="outlined"
              size="small"
              onClick={handleOpen}
            >
              Update
            </Button>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">Status</Typography>
              <Chip 
                label={idea.status} 
                size="small"
                color={
                  idea.status === 'Completed' ? 'success' : 
                  idea.status === 'In Progress' ? 'primary' : 
                  idea.status === 'Approved' ? 'info' : 'default'
                }
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="body2">Progress</Typography>
              <Typography variant="body2">{idea.progress}%</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={idea.progress} 
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
          
          {idea.jiraTickets && idea.jiraTickets.length > 0 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Ticket Status
              </Typography>
              {idea.jiraTickets.map((ticket) => (
                <Box key={ticket.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{ticket.id}: {ticket.title}</Typography>
                  <Chip 
                    label={ticket.status} 
                    size="small"
                    color={
                      ticket.status === 'Completed' ? 'success' : 
                      ticket.status === 'In Progress' ? 'info' : 'default'
                    }
                  />
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Update Progress</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="status-update-label">Status</InputLabel>
              <Select
                labelId="status-update-label"
                value={statusValue}
                label="Status"
                onChange={handleStatusChange}
              >
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Testing">Testing</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="On Hold">On Hold</MenuItem>
              </Select>
            </FormControl>
            
            <Typography gutterBottom>Progress: {progressValue}%</Typography>
            <Slider
              value={progressValue}
              onChange={handleProgressChange}
              marks={[
                { value: 0, label: '0%' },
                { value: 25, label: '25%' },
                { value: 50, label: '50%' },
                { value: 75, label: '75%' },
                { value: 100, label: '100%' }
              ]}
              step={5}
              valueLabelDisplay="auto"
            />
            
            <TextField
              fullWidth
              label="Update Notes"
              multiline
              rows={3}
              value={updateNotes}
              onChange={handleNotesChange}
              margin="normal"
              placeholder="Provide details about the current progress and any challenges..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleUpdate} 
            variant="contained"
            disabled={!updateNotes.trim()}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProgressTracker;