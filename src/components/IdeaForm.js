import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  OutlinedInput,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const IdeaForm = () => {
  const { addIdea, departments } = useContext(AppContext);
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    submittedBy: '',
    department: '',
    tags: [],
    problemStatement: '',
    targetAudience: '',
    expectedImpact: '',
    resourcesNeeded: ''
  });
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState('');

  const steps = ['Basic Information', 'Details', 'Review'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
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
      if (!formData.submittedBy.trim()) newErrors.submittedBy = 'Name is required';
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
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep()) {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newIdea = addIdea(formData);
      setLoading(false);
      setSuccess(true);
      
      // Redirect after showing success message
      setTimeout(() => {
        navigate('/ideas');
      }, 2000);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Submit New Innovation Idea
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4, mt: 2 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {success ? (
          <Alert severity="success" sx={{ mt: 2 }}>
            Your idea was submitted successfully! Redirecting to ideas list...
          </Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            {activeStep === 0 && (
              <Box>
                <TextField
                  fullWidth
                  label="Idea Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  margin="normal"
                  error={!!errors.title}
                  helperText={errors.title}
                  required
                />
                
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  margin="normal"
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description}
                  required
                />
                
                <TextField
                  fullWidth
                  label="Your Name"
                  name="submittedBy"
                  value={formData.submittedBy}
                  onChange={handleChange}
                  margin="normal"
                  error={!!errors.submittedBy}
                  helperText={errors.submittedBy}
                  required
                />
                
                <FormControl fullWidth margin="normal" error={!!errors.department}>
                  <InputLabel id="department-label">Department</InputLabel>
                  <Select
                    labelId="department-label"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    label="Department"
                    required
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
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Tags
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TextField
                      label="Add Tag"
                      value={tagInput}
                      onChange={handleTagInputChange}
                      onKeyDown={handleTagKeyDown}
                      size="small"
                      sx={{ flexGrow: 1, mr: 1 }}
                    />
                    <Button variant="outlined" onClick={handleAddTag}>
                      Add
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {formData.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => handleDeleteTag(tag)}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            )}
            
            {activeStep === 1 && (
              <Box>
                <TextField
                  fullWidth
                  label="Problem Statement"
                  name="problemStatement"
                  value={formData.problemStatement}
                  onChange={handleChange}
                  margin="normal"
                  multiline
                  rows={3}
                  placeholder="What specific problem does this idea solve?"
                  error={!!errors.problemStatement}
                  helperText={errors.problemStatement}
                  required
                />
                
                <TextField
                  fullWidth
                  label="Target Audience"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleChange}
                  margin="normal"
                  placeholder="Who will benefit from this innovation?"
                />
                
                <TextField
                  fullWidth
                  label="Expected Impact"
                  name="expectedImpact"
                  value={formData.expectedImpact}
                  onChange={handleChange}
                  margin="normal"
                  multiline
                  rows={3}
                  placeholder="How will this idea benefit the company? Include metrics if possible."
                  error={!!errors.expectedImpact}
                  helperText={errors.expectedImpact}
                  required
                />
                
                <TextField
                  fullWidth
                  label="Resources Needed"
                  name="resourcesNeeded"
                  value={formData.resourcesNeeded}
                  onChange={handleChange}
                  margin="normal"
                  multiline
                  rows={2}
                  placeholder="What resources would be required to implement this idea?"
                />
              </Box>
            )}
            
            {activeStep === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Review Your Idea
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">Idea Title</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {formData.title}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">Submitted By</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {formData.submittedBy} ({formData.department})
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Description</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {formData.description}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Tags</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      {formData.tags.map((tag) => (
                        <Chip key={tag} label={tag} />
                      ))}
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Problem Statement</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {formData.problemStatement}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Target Audience</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {formData.targetAudience || "Not specified"}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Expected Impact</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {formData.expectedImpact}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Resources Needed</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {formData.resourcesNeeded || "Not specified"}
                    </Typography>
                  </Grid>
                </Grid>
                
                <Alert severity="info" sx={{ mt: 2 }}>
                  Once submitted, your idea will be evaluated by the AI system for feasibility, impact, and alignment with company goals.
                </Alert>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Back
              </Button>
              <Box>
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={loading}
                    startIcon={loading && <CircularProgress size={20} />}
                  >
                    {loading ? 'Submitting...' : 'Submit Idea'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </form>
        )}
      </Paper>
    </Box>
  );
};

export default IdeaForm;