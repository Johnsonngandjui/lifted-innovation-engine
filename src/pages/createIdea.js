// pages/CreateIdea.js - New Idea Creation Flow with Draft/Save functionality
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Tooltip,
  Paper,
  Divider,
  useTheme,
  CardContent,
  Snackbar
} from '@mui/material';

// Icons
import AddIcon from '@mui/icons-material/Add';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import TitleIcon from '@mui/icons-material/Title';
import DescriptionIcon from '@mui/icons-material/Description';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupIcon from '@mui/icons-material/Group';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const CreateIdea = () => {
  const { addIdea, departments } = useContext(AppContext);
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    submittedBy: '',
    department: '',
    tags: [],
    problemStatement: '',
    targetAudience: '',
    expectedImpact: '',
    resourcesNeeded: '',
    status: 'Draft' // Default status is Draft
  });
  
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState('');

  const steps = ['Basic Information', 'Problem & Impact', 'Review & Save'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for the field being updated
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    if (tagInput.trim()) {
      // Don't add duplicate tags
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, tagInput.trim()]
        });
      }
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToDelete)
    });
  };

  const validateStep = () => {
    const newErrors = {};
    
    if (activeStep === 0) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (!formData.submittedBy.trim()) newErrors.submittedBy = 'Your name is required';
      if (!formData.department) newErrors.department = 'Department is required';
    } else if (activeStep === 1) {
      if (!formData.problemStatement.trim()) newErrors.problemStatement = 'Problem statement is required';
      if (!formData.expectedImpact.trim()) newErrors.expectedImpact = 'Expected impact is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prevStep) => prevStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    window.scrollTo(0, 0);
  };

  const handleSaveDraft = async () => {
    // Validate at least the title
    if (!formData.title.trim()) {
      setErrors({ ...errors, title: 'Title is required to save a draft' });
      return;
    }
    
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add the idea as a draft
    const newIdea = addIdea({
      ...formData,
      status: 'Draft'
    });
    
    setLoading(false);
    
    // Show success message
    setSnackbarMessage('Idea saved as draft successfully');
    setSnackbarOpen(true);
    
    // Redirect to the ideas list
    setTimeout(() => {
      navigate('/ideas');
    }, 1500);
  };

  const handleSaveIdea = async () => {
    if (validateStep()) {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add the idea
      const newIdea = addIdea({
        ...formData,
        status: 'Created' // Status is "Created" but not yet submitted
      });
      
      setLoading(false);
      
      // Show success message
      setSnackbarMessage('Idea created successfully');
      setSnackbarOpen(true);
      
      // Redirect to the idea detail page
      setTimeout(() => {
        navigate(`/ideas/${newIdea.id}`);
      }, 1500);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const renderBasicInformationStep = () => {
    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Let's start with the basics
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Idea Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title || "Give your idea a clear, descriptive title"}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TitleIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              error={!!errors.description}
              helperText={errors.description || "Describe your idea in a few sentences. What would you like to implement?"}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DescriptionIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Your Name"
              name="submittedBy"
              value={formData.submittedBy}
              onChange={handleChange}
              error={!!errors.submittedBy}
              helperText={errors.submittedBy}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.department}>
              <InputLabel id="department-label">Department</InputLabel>
              <Select
                labelId="department-label"
                name="department"
                value={formData.department}
                onChange={handleChange}
                label="Department"
                required
                startAdornment={
                  <InputAdornment position="start">
                    <BusinessIcon color="action" />
                  </InputAdornment>
                }
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
              {errors.department && (
                <Typography variant="caption" color="error">
                  {errors.department}
                </Typography>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <LocalOfferIcon sx={{ mr: 1, fontSize: '1.2rem', color: 'action.active' }} />
                Tags
                <Tooltip title="Add relevant keywords to categorize your idea (e.g., 'automation', 'customer experience', 'cost saving')">
                  <IconButton size="small" sx={{ ml: 0.5 }}>
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TextField
                fullWidth
                label="Add Tag"
                placeholder="Type and press Enter"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagKeyDown}
                size="small"
                sx={{ mr: 1 }}
              />
              <Button 
                variant="outlined" 
                onClick={addTag}
                startIcon={<AddIcon />}
              >
                Add
              </Button>
            </Box>
            
            <Paper variant="outlined" sx={{ p: 1, minHeight: 50, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {formData.tags.length > 0 ? (
                formData.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleDeleteTag(tag)}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
                  No tags added yet
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderDetailsStep = () => {
    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Tell us more about the impact
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Problem Statement"
              name="problemStatement"
              value={formData.problemStatement}
              onChange={handleChange}
              multiline
              rows={3}
              placeholder="What specific problem does this idea solve?"
              error={!!errors.problemStatement}
              helperText={errors.problemStatement || "Clearly define the problem your idea addresses"}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AssignmentIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Target Audience"
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleChange}
              placeholder="Who will benefit from this innovation?"
              helperText="Specify which teams, customers, or stakeholders would benefit"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <GroupIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Expected Impact"
              name="expectedImpact"
              value={formData.expectedImpact}
              onChange={handleChange}
              multiline
              rows={3}
              placeholder="How will this idea benefit the company? Include metrics if possible."
              error={!!errors.expectedImpact}
              helperText={errors.expectedImpact || "Describe the expected benefits, ROI, or improvements"}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TrendingUpIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Resources Needed"
              name="resourcesNeeded"
              value={formData.resourcesNeeded}
              onChange={handleChange}
              multiline
              rows={2}
              placeholder="What resources would be required to implement this idea?"
              helperText="Consider people, time, budget, technology needs, etc."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoneyIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderReviewStep = () => {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Review Your Idea
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Please review all information below before saving your innovation idea.
        </Typography>
        
        <Card variant="outlined" sx={{ mb: 4 }}>
          <Box sx={{ p: 2, bgcolor: 'primary.light', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
            <Typography variant="h6" color="white" fontWeight="600">
              {formData.title || "Untitled Idea"}
            </Typography>
          </Box>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Created By
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formData.submittedBy} ({formData.department})
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Tags
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {formData.tags.length > 0 ? (
                    formData.tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No tags added
                    </Typography>
                  )}
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formData.description}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Problem Statement
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formData.problemStatement}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Target Audience
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formData.targetAudience || "Not specified"}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Resources Needed
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formData.resourcesNeeded || "Not specified"}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Expected Impact
                </Typography>
                <Typography variant="body1">
                  {formData.expectedImpact}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        
        <Alert 
          severity="info" 
          icon={<HelpOutlineIcon fontSize="inherit" />}
          sx={{ mb: 3 }}
        >
          You can create your idea now and submit it for approval later. You'll also have the option to
          request AI enhancement to improve your idea's feasibility, impact, and alignment scores.
        </Alert>
      </Box>
    );
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Create New Idea
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Draft your innovative ideas and save them before submitting for approval
        </Typography>
      </Box>
      
      <Stepper 
        activeStep={activeStep} 
        sx={{ 
          mb: 4, 
          '& .MuiStepLabel-iconContainer .Mui-active': { color: 'primary.main' },
          '& .MuiStepLabel-iconContainer .Mui-completed': { color: 'success.main' },
        }}
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Card sx={{ p: 3, mb: 4 }}>
        <form onSubmit={(e) => {
          e.preventDefault();
          if (activeStep === 2) {
            handleSaveIdea();
          } else {
            handleNext();
          }
        }}>
          {activeStep === 0 && renderBasicInformationStep()}
          {activeStep === 1 && renderDetailsStep()}
          {activeStep === 2 && renderReviewStep()}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Box>
              {activeStep > 0 && (
                <Button
                  onClick={handleBack}
                  startIcon={<ArrowBackIcon />}
                >
                  Back
                </Button>
              )}
            </Box>
            
            <Box>
              {/* Save as Draft button always available */}
              <Button
                variant="outlined"
                onClick={handleSaveDraft}
                startIcon={<SaveIcon />}
                disabled={loading || !formData.title.trim()}
                sx={{ mr: 2 }}
              >
                Save as Draft
              </Button>
              
              {activeStep < 2 ? (
                <Button
                  variant="contained"
                  type="submit"
                  endIcon={<ArrowForwardIcon />}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
                >
                  {loading ? 'Saving...' : 'Create Idea'}
                </Button>
              )}
            </Box>
          </Box>
        </form>
      </Card>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default CreateIdea;