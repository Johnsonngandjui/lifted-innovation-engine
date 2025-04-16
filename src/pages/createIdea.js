// pages/CreateIdea.js - New Idea Creation Flow with MongoDB integration and AI Evaluation
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import axios from 'axios';
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
  Snackbar,
  FormControlLabel,
  Switch,
  LinearProgress,
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
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckIcon from '@mui/icons-material/Check';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import BuildIcon from '@mui/icons-material/Build';
import apiService from '../services/apiService';

const CreateIdea = () => {
  const { addIdea, departments } = useContext(AppContext);
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  const [formData, setFormData] = useState({
    ideaName: '',               // Using ideaName instead of title to match schema
    description: '',
    authorName: '',             // Using authorName instead of submittedBy to match schema
    authorId: 'n' + Math.floor(Math.random() * 10000000), // Generate a mock n-number ID
    authorDept: '',             // Using authorDept instead of department to match schema
    tags: [],
    problemStatement: '',
    audience: '',               // Using audience instead of targetAudience to match schema
    expectedImpact: '',
    resources: '',              // Using resources instead of resourcesNeeded to match schema
    public: true,               // Default to public
    status: 'Draft',            // Default status is Draft
    editors: [],                // Initialize empty editors array
    likes: 0                    // Initialize with 0 likes
  });
  
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState('');
  const [aiEnhancedData, setAiEnhancedData] = useState(null);
  const [evaluationResults, setEvaluationResults] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const steps = ['Basic Information', 'Problem & Impact', 'AI Enhancement', 'Review & Save'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Map form field names to schema field names if needed
    let fieldName = name;
    if (name === 'title') fieldName = 'ideaName';
    if (name === 'submittedBy') fieldName = 'authorName';
    if (name === 'department') fieldName = 'authorDept';
    if (name === 'targetAudience') fieldName = 'audience';
    if (name === 'resourcesNeeded') fieldName = 'resources';
    
    setFormData({ ...formData, [fieldName]: value });
    
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
      if (!formData.ideaName.trim()) newErrors.title = 'Title is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (!formData.authorName.trim()) newErrors.submittedBy = 'Your name is required';
      if (!formData.authorDept) newErrors.department = 'Department is required';
    } else if (activeStep === 1) {
      if (!formData.problemStatement.trim()) newErrors.problemStatement = 'Problem statement is required';
      if (!formData.expectedImpact.trim()) newErrors.expectedImpact = 'Expected impact is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
const handleAIEnhancement = async () => {
  setAiLoading(true);
  setAiError('');
  
  try {
    // Format all the idea information in a clear structure
    const ideaText = `
# Innovation Idea Details

## Basic Information
Title: ${formData.ideaName}
Created by: ${formData.authorName}

Tags: ${formData.tags.length > 0 ? formData.tags.join(', ') : 'None'}

## Description
${formData.description}

## Problem Statement
${formData.problemStatement}

## Target Audience
${formData.audience || 'Not specified'}

## Expected Impact
${formData.expectedImpact}

## Resources Needed
${formData.resources || 'Not specified'}

Please enhance this innovation idea to make it more compelling, impactful, and business-oriented. Maintain the core concept but improve clarity and presentation only use what is provided in the text for enhancement.
if you cannot enhance return nothing`;
    
    // Step 1: Get the enhanced description from the GPT endpoint
    const enhancementResponse = await axios.post('http://localhost:3001/gpt', {
      message: ideaText,
      type: 'idea_enhancement',
      context: {
        stage: 'enhancement',
        ideaMetadata: {
          department: formData.authorDept,
          tags: formData.tags
        }
      }
    });
    
    // Extract the enhanced description
    let enhancedData = { rewritten: formData.description, evaluation: '' };
    if (enhancementResponse.status === 200 && enhancementResponse.data && enhancementResponse.data.response) {
      enhancedData = enhancementResponse.data.response;
    }
    
    // Update state with enhancement results
    setAiEnhancedData(enhancedData);
    
    // Step 2: Get the evaluation scores and explanations using the dedicated endpoint
    const evaluationResponse = await apiService.evaluateIdea({
      ideaName: formData.ideaName,
      description: enhancedData.rewritten || formData.description, // Use enhanced description if available
      authorName: formData.authorName,
      authorDept: formData.authorDept,
      tags: formData.tags,
      problemStatement: formData.problemStatement,
      audience: formData.audience,
      expectedImpact: formData.expectedImpact,
      resources: formData.resources
    });
    
    // Update state with evaluation results
    setEvaluationResults(evaluationResponse);
    
    console.log('AI enhancement response:', enhancedData);
    console.log('AI evaluation results:', evaluationResponse);
    
  } catch (error) {
    console.error('AI enhancement error:', error);
    setAiError(`Failed to enhance your idea: ${error.message}. Please try again or proceed to the next step.`);
  } finally {
    setAiLoading(false);
  }
};

  const handleNext = () => {
    if (validateStep()) {
      // If moving from Problem & Impact to AI Enhancement, trigger AI processing
      if (activeStep === 1) {
        handleAIEnhancement();
      }
      setActiveStep((prevStep) => prevStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    window.scrollTo(0, 0);
  };

  // Function to save idea to MongoDB
  const saveIdeaToMongoDB = async (ideaData) => {
    try {
      // POST request to the API endpoint for creating ideas
      const response = await axios.post('http://localhost:3001/idea/create', ideaData);
      
      if (response.status === 200 || response.data === "success") {
        return { success: true, data: response.data };
      } else {
        throw new Error('Failed to save idea to database');
      }
    } catch (error) {
      console.error('Error saving idea to MongoDB:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Unknown error occurred'
      };
    }
  };

  const handleSaveDraft = async () => {
    // Validate at least the title
    if (!formData.ideaName.trim()) {
      setErrors({ ...errors, title: 'Title is required to save a draft' });
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare data for MongoDB
      const ideaData = {
        ...formData,
        status: 'Draft',
        // Don't set dates - let the server handle this
      };
      
      // Add evaluation data if available
      if (evaluationResults) {
        ideaData.innovationScore = evaluationResults.innovationScore;
        ideaData.impactScore = evaluationResults.impactScore;
        ideaData.alignmentScore = evaluationResults.alignmentScore;
        ideaData.feasabilityScore = evaluationResults.feasibilityScore; // Note: misspelled as in schema
        ideaData.innovationExplanation = evaluationResults.innovationExplanation;
        ideaData.impactExplanation = evaluationResults.impactExplanation;
        ideaData.alignmentExplanation = evaluationResults.alignmentExplanation;
        ideaData.feasabilityExplanation = evaluationResults.feasibilityExplanation; // Note: misspelled as in schema
      }
      
      // Save to MongoDB
      const result = await apiService.createIdea(ideaData);
      
      if (result && (result._id || result.id)) {
        // Show success message
        setSnackbarMessage('Idea saved as draft successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        
        // Also update local state using the AppContext function
        addIdea({
          ...formData,
          ...result, // Include all fields from the server response
          status: 'Draft'
        });
        
        // Redirect to the ideas list
        setTimeout(() => {
          navigate('/ideas');
        }, 1500);
      } else {
        throw new Error('Server did not return a valid idea ID');
      }
    } catch (error) {
      // Handle errors
      console.error('Error saving draft:', error);
      setSnackbarMessage('Error saving draft: ' + (error.message || 'Please try again'));
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveIdea = async () => {
    if (validateStep()) {
        setLoading(true);
        
        try {
            // Prepare data for MongoDB
            const ideaData = {
                ...formData,
                status: 'created',
            };
            
            // Add evaluation data if available
            if (evaluationResults) {
                ideaData.innovationScore = evaluationResults.innovationScore;
                ideaData.impactScore = evaluationResults.impactScore;
                ideaData.alignmentScore = evaluationResults.alignmentScore;
                ideaData.feasabilityScore = evaluationResults.feasibilityScore; // Note: misspelled as in schema
                ideaData.innovationExplanation = evaluationResults.innovationExplanation;
                ideaData.impactExplanation = evaluationResults.impactExplanation;
                ideaData.alignmentExplanation = evaluationResults.alignmentExplanation;
                ideaData.feasabilityExplanation = evaluationResults.feasibilityExplanation; // Note: misspelled as in schema
            }
            
            // Save to MongoDB
            const response = await axios.post('http://localhost:3001/idea/create', ideaData);
            
            if (response.data && response.data._id) {
                setSnackbarMessage('Idea created successfully');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                
                // Redirect to the idea detail page
                setTimeout(() => {
                    navigate(`/ideas/${response.data._id}`);
                }, 1500);
            } else {
                throw new Error('Server did not return a valid idea ID');
            }
        } catch (error) {
            console.error('Error creating idea:', error);
            setSnackbarMessage('Error creating idea: ' + (error.message || 'Please try again'));
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    }
};

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Helper function to get rating label based on score
  const getRatingLabel = (score) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Average';
    if (score >= 30) return 'Fair';
    return 'Poor';
  };
  
  // Helper function to get rating color based on score
  const getRatingColor = (score) => {
    if (score >= 85) return 'success';
    if (score >= 70) return 'primary';
    if (score >= 50) return 'info';
    if (score >= 30) return 'warning';
    return 'error';
  };

  const renderBasicInformationStep = () => {
    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
          Step 1: Basic Information
        </Typography>
        
        <Paper variant="outlined" sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
          <Typography variant="subtitle1" fontWeight="500" gutterBottom>
            Main Idea Details
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Idea Title"
                name="title"
                value={formData.ideaName}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title || "Give your idea a clear, descriptive title"}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TitleIcon color="primary" />
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
                      <DescriptionIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Paper>
        
        <Paper variant="outlined" sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
          <Typography variant="subtitle1" fontWeight="500" gutterBottom>
            Author Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Your Name"
                name="submittedBy"
                value={formData.authorName}
                onChange={handleChange}
                error={!!errors.submittedBy}
                helperText={errors.submittedBy || "Enter your full name"}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
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
                  value={formData.authorDept}
                  onChange={handleChange}
                  label="Department"
                  required
                  displayEmpty
                  sx={{ 
                    minWidth: '100%',
                    '& .MuiInputBase-input': { 
                      display: 'flex',
                      alignItems: 'center'
                    }
                  }}
                  startAdornment={
                    <InputAdornment position="start">
                      <BusinessIcon color="primary" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="" disabled>
                    <em>Select your department</em>
                  </MenuItem>
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
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.public}
                    onChange={(e) => setFormData({...formData, public: e.target.checked})}
                    color="primary"
                  />
                }
                label="Make this idea visible to everyone in the organization"
              />
            </Grid>
          </Grid>
        </Paper>
        
        <Paper variant="outlined" sx={{ p: 3, bgcolor: 'background.paper' }}>
          <Typography variant="subtitle1" fontWeight="500" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <LocalOfferIcon sx={{ mr: 1, color: 'primary.main' }} />
            Tags
            <Tooltip title="Add relevant keywords to categorize your idea (e.g., 'automation', 'customer experience', 'cost saving')">
              <IconButton size="small" sx={{ ml: 0.5 }}>
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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
          
          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, minHeight: 50, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
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
          </Box>
        </Paper>
      </Box>
    );
  };

  const renderDetailsStep = () => {
    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
          Step 2: Problem & Impact
        </Typography>
        
        <Paper variant="outlined" sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
          <Typography variant="subtitle1" fontWeight="500" gutterBottom>
            Problem Definition
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
                      <AssignmentIcon color="primary" />
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
                value={formData.audience}
                onChange={handleChange}
                placeholder="Who will benefit from this innovation?"
                helperText="Specify which teams, customers, or stakeholders would benefit"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <GroupIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Paper>
        
        <Paper variant="outlined" sx={{ p: 3, bgcolor: 'background.paper' }}>
          <Typography variant="subtitle1" fontWeight="500" gutterBottom>
            Impact & Resources
          </Typography>
          
          <Grid container spacing={3}>
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
                      <TrendingUpIcon color="primary" />
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
                value={formData.resources}
                onChange={handleChange}
                multiline
                rows={2}
                placeholder="What resources would be required to implement this idea?"
                helperText="Consider people, time, budget, technology needs, etc."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Box>
    );
  };

  const renderAIEnhancementStep = () => {
    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
          Step 3: AI Enhancement & Evaluation
        </Typography>
        
        <Alert 
          severity="info" 
          sx={{ mb: 3 }}
        >
          Our AI assistant will analyze your idea, suggest improvements, and evaluate it across four key criteria: innovation, impact, alignment with business goals, and feasibility.
        </Alert>
        
        {aiLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4 }}>
            <CircularProgress size={40} />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Enhancing and evaluating your idea...
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              This may take a few moments as we thoroughly analyze all aspects of your idea.
            </Typography>
          </Box>
        ) : aiError ? (
          <Box>
            <Alert 
              severity="error" 
              sx={{ mb: 3 }}
            >
              {aiError}
            </Alert>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button 
                variant="outlined" 
                onClick={handleAIEnhancement}
                startIcon={<RefreshIcon />}
              >
                Try Again
              </Button>
            </Box>
          </Box>
        ) : aiEnhancedData ? (
          <Box>
            {/* Original vs Enhanced comparison */}
            <Paper variant="outlined" sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
              <Typography variant="subtitle1" fontWeight="500" gutterBottom>
                Description Enhancement
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <Box sx={{ p: 2, bgcolor: 'grey.100' }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Original Description
                      </Typography>
                    </Box>
                    <Box sx={{ p: 2 }}>
                      <Typography variant="body1">
                        {formData.description}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: '100%', boxShadow: '0 0 5px rgba(0,0,0,0.1)' }}>
                    <Box sx={{ p: 2, bgcolor: 'primary.light', color: 'white' }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Enhanced Description
                      </Typography>
                    </Box>
                    <Box sx={{ p: 2 }}>
                      <Typography variant="body1" paragraph>
                        {aiEnhancedData.rewritten || 'No enhancements suggested.'}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
            
            {/* AI Evaluation & Feedback */}
            <Paper variant="outlined" sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
              <Typography variant="subtitle1" fontWeight="500" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <AssessmentIcon sx={{ mr: 1, color: 'primary.main' }} />
                AI Evaluation & Feedback
              </Typography>
              
              {evaluationResults && (
                <Box sx={{ mt: 2 }}>
                  {/* Overall Score Card */}
                  <Card 
                    sx={{ 
                      mb: 3, 
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      color: 'white'
                    }}
                    elevation={3}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ mr: 3, textAlign: 'center' }}>
                          <Box
                            sx={{
                              height: 100,
                              width: 100,
                              borderRadius: '50%',
                              border: '8px solid rgba(255,255,255,0.2)',
                              position: 'relative',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: -8,
                                left: -8,
                                right: -8,
                                bottom: -8,
                                borderRadius: '50%',
                                border: '8px solid transparent',
                                borderTopColor: 'white',
                                borderRightColor: 'white',
                                transform: `rotate(${(evaluationResults ? (evaluationResults.innovationScore + evaluationResults.impactScore + evaluationResults.alignmentScore + evaluationResults.feasibilityScore) / 4 : 0) / 100 * 360}deg)`,
                                transition: 'all 1s ease-out'
                              }
                            }}
                          >
                            <Typography variant="h3" fontWeight="bold">
                              {evaluationResults ? Math.round((evaluationResults.innovationScore + evaluationResults.impactScore + evaluationResults.alignmentScore + evaluationResults.feasibilityScore) / 4) : 0}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                            Overall Score
                          </Typography>
                        </Box>
                        
                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <AssessmentIcon sx={{ mr: 1 }} />
                            <Typography variant="h6" fontWeight="bold">
                              {evaluationResults ? getRatingLabel(Math.round((evaluationResults.innovationScore + evaluationResults.impactScore + evaluationResults.alignmentScore + evaluationResults.feasibilityScore) / 4)) : 'Pending'} Evaluation
                            </Typography>
                            <Box sx={{ flexGrow: 1 }} />
                            <Chip 
                              label={evaluationResults ? getRatingLabel(Math.round((evaluationResults.innovationScore + evaluationResults.impactScore + evaluationResults.alignmentScore + evaluationResults.feasibilityScore) / 4)) : 'Pending'} 
                              size="small"
                              sx={{ 
                                bgcolor: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                fontWeight: 'bold'
                              }}
                            />
                          </Box>
                          
                          <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                            {evaluationResults && Math.round((evaluationResults.innovationScore + evaluationResults.impactScore + evaluationResults.alignmentScore + evaluationResults.feasibilityScore) / 4) >= 85 ? 
                              'This idea shows exceptional potential across all evaluation criteria. Highly recommended for implementation.' : 
                             evaluationResults && Math.round((evaluationResults.innovationScore + evaluationResults.impactScore + evaluationResults.alignmentScore + evaluationResults.feasibilityScore) / 4) >= 70 ? 
                              'This idea demonstrates strong potential and aligns well with organizational goals. Recommended for implementation with minor refinements.' :
                             evaluationResults && Math.round((evaluationResults.innovationScore + evaluationResults.impactScore + evaluationResults.alignmentScore + evaluationResults.feasibilityScore) / 4) >= 50 ? 
                              'This idea has potential but requires further development in certain areas before implementation.' :
                             evaluationResults && Math.round((evaluationResults.innovationScore + evaluationResults.impactScore + evaluationResults.alignmentScore + evaluationResults.feasibilityScore) / 4) >= 30 ? 
                              'This idea needs significant improvements in multiple areas to meet organizational standards.' :
                              'This idea requires fundamental reconsideration across most evaluation criteria.'}
                          </Typography>
                          
                          <Box>
                            {evaluationResults && [
                              { name: 'Innovation', score: evaluationResults.innovationScore, color: theme.palette.warning.main },
                              { name: 'Impact', score: evaluationResults.impactScore, color: theme.palette.primary.main },
                              { name: 'Alignment', score: evaluationResults.alignmentScore, color: theme.palette.info.main },
                              { name: 'Feasibility', score: evaluationResults.feasibilityScore, color: theme.palette.success.main }
                            ].map((criterion) => (
                              <Box key={criterion.name} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <Typography variant="body2" sx={{ width: 80, fontWeight: 500 }}>
                                  {criterion.name}:
                                </Typography>
                                <Box sx={{ flexGrow: 1, mr: 1 }}>
                                  <LinearProgress
                                    variant="determinate"
                                    value={criterion.score}
                                    sx={{
                                      height: 6,
                                      borderRadius: 3,
                                      backgroundColor: 'rgba(255,255,255,0.2)',
                                      '& .MuiLinearProgress-bar': {
                                        backgroundColor: 'white'
                                      }
                                    }}
                                  />
                                </Box>
                                <Typography variant="body2" fontWeight="bold" sx={{ minWidth: 30 }}>
                                  {criterion.score}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                  
                  {/* Criteria Detail Cards */}
                  <Grid container spacing={2}>
                    {evaluationResults && [
                      { 
                        name: 'Innovation', 
                        score: evaluationResults.innovationScore, 
                        explanation: evaluationResults.innovationExplanation,
                        icon: <TipsAndUpdatesIcon />,
                        color: theme.palette.warning.main 
                      },
                      { 
                        name: 'Impact', 
                        score: evaluationResults.impactScore, 
                        explanation: evaluationResults.impactExplanation,
                        icon: <TrendingUpIcon />,
                        color: theme.palette.primary.main 
                      },
                      { 
                        name: 'Alignment', 
                        score: evaluationResults.alignmentScore, 
                        explanation: evaluationResults.alignmentExplanation,
                        icon: <AlignHorizontalLeftIcon />,
                        color: theme.palette.info.main 
                      },
                      { 
                        name: 'Feasibility', 
                        score: evaluationResults.feasibilityScore, 
                        explanation: evaluationResults.feasibilityExplanation,
                        icon: <BuildIcon />,
                        color: theme.palette.success.main 
                      }
                    ].map((criterion) => (
                      <Grid item xs={12} md={6} key={criterion.name}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Box sx={{ 
                                mr: 1.5,
                                color: criterion.color,
                                display: 'flex'
                              }}>
                                {criterion.icon}
                              </Box>
                              <Typography variant="h6">
                                {criterion.name}
                              </Typography>
                              <Box sx={{ flexGrow: 1 }} />
                              <Chip 
                                label={`${criterion.score}% - ${getRatingLabel(criterion.score)}`} 
                                size="small"
                                color={getRatingColor(criterion.score)}
                              />
                            </Box>
                            
                            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                              <Box sx={{ flexGrow: 1, mr: 2 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={criterion.score}
                                  sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: 'rgba(0,0,0,0.08)',
                                    '& .MuiLinearProgress-bar': {
                                      backgroundColor: criterion.color
                                    }
                                  }}
                                />
                              </Box>
                              <Typography variant="h6" fontWeight="bold" color={criterion.color}>
                                {criterion.score}%
                              </Typography>
                            </Box>
                            
                            <Divider sx={{ mb: 2 }} />
                            
                            <Typography variant="body2">
                              {criterion.explanation || `No detailed explanation available for the ${criterion.name.toLowerCase()} evaluation.`}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Paper>
            
            {/* Action buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button 
                variant="outlined" 
                onClick={handleAIEnhancement}
                startIcon={<RefreshIcon />}
                disabled={aiLoading}
              >
                Regenerate
              </Button>
              
              <Box>
                <Button 
                  variant="outlined"
                  color="inherit"
                  onClick={() => handleNext()}
                  sx={{ mr: 2 }}
                >
                  Keep Original
                </Button>
                
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => {
                    // Keep the enhanced version and evaluation results in the form data
                    setFormData(prev => ({
                      ...prev,
                      description: aiEnhancedData.rewritten || prev.description,
                      aiEnhanced: true,
                      // Add evaluation scores to the form data for saving later
                      innovationScore: evaluationResults?.innovationScore || 0,
                      impactScore: evaluationResults?.impactScore || 0,
                      alignmentScore: evaluationResults?.alignmentScore || 0,
                      feasabilityScore: evaluationResults?.feasibilityScore || 0, // Note: using the misspelled field as in original schema
                      innovationExplanation: evaluationResults?.innovationExplanation || '',
                      impactExplanation: evaluationResults?.impactExplanation || '',
                      alignmentExplanation: evaluationResults?.alignmentExplanation || '',
                      feasabilityExplanation: evaluationResults?.feasibilityExplanation || '' // Note: using the misspelled field as in original schema
                    }));
                    handleNext();
                  }}
                  endIcon={<CheckIcon />}
                >
                  Use Enhanced Version
                </Button>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4 }}>
            <Typography variant="body1" paragraph align="center">
              Ready to enhance your idea? Our AI can help make your innovation more impactful and provide a comprehensive evaluation.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleAIEnhancement}
              size="large"
              startIcon={<AutoFixHighIcon />}
              sx={{ py: 1, px: 3 }}
            >
              Enhance & Evaluate My Idea
            </Button>
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              You can also skip this step and proceed to review
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  const renderReviewStep = () => {
    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
          Step 4: Review & Save
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          Please review all information below before saving your innovation idea.
        </Typography>
        
        <Card variant="outlined" sx={{ mb: 4 }}>
          <Box sx={{ p: 2, bgcolor: 'primary.light', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
            <Typography variant="h6" color="white" fontWeight="600">
              {formData.ideaName || "Untitled Idea"}
            </Typography>
          </Box>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Created By
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formData.authorName} ({formData.authorDept})
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
                  {formData.audience || "Not specified"}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Resources Needed
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formData.resources || "Not specified"}
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
              
              {evaluationResults && (
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    AI Evaluation Scores
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={3}>
                        <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            Innovation
                          </Typography>
                          <Typography variant="h6" color="warning.main" fontWeight="bold">
                            {evaluationResults.innovationScore}%
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            Impact
                          </Typography>
                          <Typography variant="h6" color="primary.main" fontWeight="bold">
                            {evaluationResults.impactScore}%
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            Alignment
                          </Typography>
                          <Typography variant="h6" color="info.main" fontWeight="bold">
                            {evaluationResults.alignmentScore}%
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            Feasibility
                          </Typography>
                          <Typography variant="h6" color="success.main" fontWeight="bold">
                            {evaluationResults.feasibilityScore}%
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
        
        <Alert 
          severity="info" 
          icon={<HelpOutlineIcon fontSize="inherit" />}
          sx={{ mb: 3 }}
        >
          You can create your idea now and submit it for approval later. The evaluation scores and explanations will be saved with your idea.
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
          if (activeStep === 3) { // Now review is step 3
            handleSaveIdea();
          } else {
            handleNext();
          }
        }}>
          {activeStep === 0 && renderBasicInformationStep()}
          {activeStep === 1 && renderDetailsStep()}
          {activeStep === 2 && renderAIEnhancementStep()}
          {activeStep === 3 && renderReviewStep()}
          
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
                disabled={loading || !formData.ideaName.trim()}
                sx={{ mr: 2 }}
              >
                Save as Draft
              </Button>
              
              {activeStep < 3 ? (
                <Button
                  variant="contained"
                  type="submit"
                  endIcon={<ArrowForwardIcon />}
                  // Skip button should be disabled during AI loading
                  disabled={activeStep === 2 && aiLoading}
                >
                  {activeStep === 2 ? 'Skip Enhancement' : 'Continue'}
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
        severity={snackbarSeverity}
      />
    </Box>
  );
};

export default CreateIdea;