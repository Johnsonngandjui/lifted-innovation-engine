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
  Divider,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import AssessmentIcon from '@mui/icons-material/Assessment';
import RateReviewIcon from '@mui/icons-material/RateReview';
import JiraTicketCreator from './JiraTicketCreator';

const IdeaList = () => {
  const { ideas, loading, statusOptions, departments, evaluateIdea } = useContext(AppContext);
  
  const [filters, setFilters] = useState({
    status: '',
    department: '',
    search: '',
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIdeaForEval, setSelectedIdeaForEval] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationComplete, setEvaluationComplete] = useState(false);
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };
  
  // Filter ideas based on current filters
  const filteredIdeas = ideas.filter(idea => {
    const matchesStatus = !filters.status || idea.status === filters.status;
    const matchesDepartment = !filters.department || idea.department === filters.department;
    const matchesSearch = !filters.search || 
      idea.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      idea.description.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesStatus && matchesDepartment && matchesSearch;
  });

  // Handle AI evaluation
  const handleStartEvaluation = (idea) => {
    setSelectedIdeaForEval(idea);
    setEvaluating(false);
    setEvaluationComplete(false);
  };
  
  const handleEvaluate = async () => {
    setEvaluating(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    evaluateIdea(selectedIdeaForEval.id);
    setEvaluating(false);
    setEvaluationComplete(true);
  };
  
  const handleCloseEvalDialog = () => {
    setSelectedIdeaForEval(null);
    setEvaluationComplete(false);
  };

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Innovation Ideas
      </Typography>
      
      {/* Search and filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Search ideas..."
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
              }}
              size="small"
              sx={{ mr: 2 }}
            />
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
          </Box>
          
          {showFilters && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel id="status-filter-label">Status</InputLabel>
                  <Select
                    labelId="status-filter-label"
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    label="Status"
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel id="department-filter-label">Department</InputLabel>
                  <Select
                    labelId="department-filter-label"
                    name="department"
                    value={filters.department}
                    onChange={handleFilterChange}
                    label="Department"
                  >
                    <MenuItem value="">All Departments</MenuItem>
                    {departments.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
      
      {/* Ideas list */}
      {filteredIdeas.length === 0 ? (
        <Alert severity="info">No ideas match your current filters.</Alert>
      ) : (
        filteredIdeas.map((idea) => (
          <Accordion key={idea.id} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6">{idea.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Submitted by {idea.submittedBy} ({idea.department}) • {idea.dateSubmitted}
                  </Typography>
                </Box>
                <Chip 
                  label={idea.status} 
                  color={
                    idea.status === 'Completed' ? 'success' : 
                    idea.status === 'Rejected' ? 'error' :
                    idea.status === 'In Progress' ? 'primary' : 'default'
                  }
                  size="small"
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="body1">{idea.description}</Typography>
                  <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {idea.tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" />
                    ))}
                  </Box>
                </Grid>
                
                {idea.status !== 'Submitted' && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle1">AI Evaluation</Typography>
                    {idea.aiScore.overall > 0 ? (
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2">Feasibility</Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={idea.aiScore.feasibility} 
                            sx={{ height: 8, borderRadius: 2 }}
                          />
                          <Typography variant="body2" align="right">{idea.aiScore.feasibility}%</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2">Impact</Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={idea.aiScore.impact} 
                            color="secondary"
                            sx={{ height: 8, borderRadius: 2 }}
                          />
                          <Typography variant="body2" align="right">{idea.aiScore.impact}%</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2">Alignment</Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={idea.aiScore.alignment} 
                            color="success"
                            sx={{ height: 8, borderRadius: 2 }}
                          />
                          <Typography variant="body2" align="right">{idea.aiScore.alignment}%</Typography>
                        </Grid>
                      </Grid>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Not evaluated yet
                      </Typography>
                    )}
                  </Grid>
                )}
                
                {idea.assignedTeam && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">Assigned Team</Typography>
                    <Typography variant="body2">{idea.assignedTeam}</Typography>
                  </Grid>
                )}
                
                {idea.progress > 0 && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">Progress</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={idea.progress} 
                      sx={{ height: 10, borderRadius: 2, mt: 1 }}
                    />
                    <Typography variant="body2" align="right">{idea.progress}% Complete</Typography>
                  </Grid>
                )}
                
                {idea.estimatedCost && idea.estimatedCost.total > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Estimated Cost</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                      <Typography variant="body2">
                        Development: ${idea.estimatedCost.development.toLocaleString()}
                      </Typography>
                      <Typography variant="body2">
                        Implementation: ${idea.estimatedCost.implementation.toLocaleString()}
                      </Typography>
                      <Typography variant="body2">
                        Maintenance: ${idea.estimatedCost.maintenance.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        Total: ${idea.estimatedCost.total.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                )}
                
                {idea.jiraTickets && idea.jiraTickets.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Jira Tickets</Typography>
                    <Box sx={{ mt: 1 }}>
                      {idea.jiraTickets.map((ticket) => (
                        <Box key={ticket.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Chip 
                            label={ticket.id} 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                            sx={{ mr: 1 }}
                          />
                          <Typography variant="body2">{ticket.title}</Typography>
                          <Box sx={{ flexGrow: 1 }} />
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
                  </Grid>
                )}
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    {idea.status === 'Submitted' && (
                      <Button 
                        startIcon={<AssessmentIcon />}
                        variant="contained"
                        color="primary"
                        onClick={() => handleStartEvaluation(idea)}
                      >
                        AI Evaluate
                      </Button>
                    )}
                    
                    {idea.status === 'Evaluation' && idea.aiScore.overall > 0 && (
                      <JiraTicketCreator ideaId={idea.id} />
                    )}
                    
                    <Button 
                      startIcon={<RateReviewIcon />}
                      variant="outlined"
                    >
                      Add Comment
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))
      )}
      
      {/* AI Evaluation Dialog */}
      <Dialog 
        open={selectedIdeaForEval !== null} 
        onClose={handleCloseEvalDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          AI Evaluation
        </DialogTitle>
        <DialogContent dividers>
          {selectedIdeaForEval && (
            <>
              <Typography variant="h6">{selectedIdeaForEval.title}</Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Submitted by {selectedIdeaForEval.submittedBy} from {selectedIdeaForEval.department}
              </Typography>
              
              <Typography variant="body1" paragraph>
                {selectedIdeaForEval.description}
              </Typography>
              
              {evaluating ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CircularProgress />
                  <Typography sx={{ mt: 2 }}>
                    AI is evaluating this idea...
                  </Typography>
                </Box>
              ) : evaluationComplete ? (
                <Box>
                  <Alert severity="success" sx={{ mb: 3 }}>
                    AI evaluation complete!
                  </Alert>
                  
                  <Typography variant="subtitle1" gutterBottom>
                    Evaluation Results
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2">Feasibility</Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={85} 
                        sx={{ height: 8, borderRadius: 2 }}
                      />
                      <Typography variant="body2" align="right">85%</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2">Impact</Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={92} 
                        color="secondary"
                        sx={{ height: 8, borderRadius: 2 }}
                      />
                      <Typography variant="body2" align="right">92%</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2">Alignment</Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={78} 
                        color="success"
                        sx={{ height: 8, borderRadius: 2 }}
                      />
                      <Typography variant="body2" align="right">78%</Typography>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      AI Recommendations
                    </Typography>
                    <Typography variant="body1" paragraph>
                      This idea shows strong potential with high impact and good feasibility. The alignment with company goals is solid but could be improved. Recommended next steps include:
                    </Typography>
                    <Typography component="ul" sx={{ pl: 2 }}>
                      <li>Create detailed implementation plan</li>
                      <li>Consult with the IT Infrastructure team for technical requirements</li>
                      <li>Consider a small pilot project to demonstrate value</li>
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Typography variant="body1" paragraph>
                    Our AI will evaluate this idea based on:
                  </Typography>
                  <Typography component="ul">
                    <li>Feasibility - How realistic is implementation given current resources</li>
                    <li>Impact - Potential positive effects on business metrics</li>
                    <li>Alignment - How well the idea aligns with company goals</li>
                  </Typography>
                  <Typography variant="body1" paragraph>
                    The AI will also provide recommendations and resource estimates.
                  </Typography>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          {!evaluationComplete ? (
            <>
              <Button onClick={handleCloseEvalDialog}>
                Cancel
              </Button>
              {!evaluating && (
                <Button 
                  variant="contained"
                  onClick={handleEvaluate}
                  disabled={evaluating}
                >
                  Start Evaluation
                </Button>
              )}
            </>
          ) : (
            <Button 
              variant="contained"
              onClick={handleCloseEvalDialog}
            >
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IdeaList;