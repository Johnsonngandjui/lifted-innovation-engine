// components/AIEvaluation.js - Modified version of the AIEvaluation component
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Alert,
  Divider,
  Rating,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';

// Icons
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import AssessmentIcon from '@mui/icons-material/Assessment';
import RecommendIcon from '@mui/icons-material/Recommend';

const AIEvaluation = () => {
  const theme = useTheme();
  
  const [ideaText, setIdeaText] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [evaluationResults, setEvaluationResults] = useState(null);
  const [enhancedIdea, setEnhancedIdea] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(['Innovation', 'AI', 'Automation']);
  
  const steps = ['Enter Your Idea', 'AI Enhancement', 'Evaluation Results'];
  
  const handleTextChange = (e) => {
    setIdeaText(e.target.value);
  };
  
  const handleEnhancedIdeaChange = (e) => {
    setEnhancedIdea(e.target.value);
  };
  
  const handleEvaluate = async () => {
    setEvaluating(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI enhancement
    const enhanced = ideaText + "\n\nEnhanced context: This idea could be implemented using our existing data infrastructure with minimal additional resources. It aligns with our Q3 objective of improving operational efficiency and could potentially reduce manual processing time by 40%.";
    setEnhancedIdea(enhanced);
    
    // Add default tags if none exist
    if (tags.length === 0) {
      setTags(['Efficiency', 'Process Improvement', 'Innovation']);
    }
    
    setEvaluating(false);
    setActiveStep(1);
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
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
  };
  
  const handleRunEvaluation = async () => {
    setEvaluating(true);
    
    // Simulate AI evaluation delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock evaluation results
    const results = {
      scores: {
        feasibility: Math.floor(Math.random() * 20) + 75, // 75-95
        impact: Math.floor(Math.random() * 20) + 75,
        alignment: Math.floor(Math.random() * 20) + 75,
        innovation: Math.floor(Math.random() * 20) + 75,
        scalability: Math.floor(Math.random() * 20) + 75,
      },
      feedback: {
        strengths: [
          "Leverages existing company infrastructure",
          "Addresses a clear business need",
          "Potentially high ROI with relatively low implementation cost"
        ],
        weaknesses: [
          "May require specialized skills not currently in the team",
          "Timeline might be optimistic given other priorities"
        ],
        recommendations: [
          "Consider a phased implementation approach",
          "Consult with IT security early in the process",
          "Develop clear success metrics before beginning development"
        ]
      },
      resources: {
        estimatedCost: {
          development: Math.floor(Math.random() * 40000) + 20000,
          implementation: Math.floor(Math.random() * 15000) + 5000,
          maintenance: Math.floor(Math.random() * 20000) + 10000
        },
        estimatedTimeline: Math.floor(Math.random() * 4) + 2 + " months",
        suggestedTeam: "Cross-functional team from IT, Data, and Business Operations"
      }
    };
    
    // Calculate overall score
    const scores = Object.values(results.scores);
    results.overallScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
    
    // Calculate total cost
    results.resources.estimatedCost.total = 
      results.resources.estimatedCost.development + 
      results.resources.estimatedCost.implementation + 
      results.resources.estimatedCost.maintenance;
    
    setEvaluationResults(results);
    setEvaluating(false);
    setActiveStep(2);
  };
  
  const handleReset = () => {
    setIdeaText('');
    setEnhancedIdea('');
    setEvaluationResults(null);
    setTags(['Innovation', 'AI', 'Automation']);
    setActiveStep(0);
  };
  
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="body1" paragraph>
              Enter your innovation idea in as much detail as possible. The AI will help enhance your idea before evaluation.
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              value={ideaText}
              onChange={handleTextChange}
              placeholder="Describe your innovation idea here..."
              helperText="Include problem being solved, potential implementation approach, and expected benefits"
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                disabled={ideaText.trim().length < 20 || evaluating}
                onClick={handleEvaluate}
                startIcon={evaluating ? undefined : <AutoAwesomeIcon />}
                sx={{ minWidth: 150 }}
              >
                {evaluating ? <CircularProgress size={24} /> : "AI Enhance"}
              </Button>
            </Box>
          </Box>
        );
      
      case 1:
        return (
          <Box>
            <Typography variant="body1" paragraph>
              The AI has enhanced your idea with additional context. You can edit this before evaluation.
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={8}
              value={enhancedIdea}
              onChange={handleEnhancedIdeaChange}
            />
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom display="flex" alignItems="center">
                Tags
                <Tooltip title="Keywords that help categorize your idea">
                  <IconButton size="small">
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TextField
                  label="Add Tag"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagKeyDown}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Button 
                  variant="outlined" 
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={addTag}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleDeleteTag(tag)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                AI Evaluation Process
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LightbulbIcon sx={{ color: theme.palette.warning.main, mr: 1 }} />
                        <Typography variant="subtitle2">
                          Idea Analysis
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        The AI analyzes the core concept, innovation potential, and uniqueness
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <AssessmentIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                        <Typography variant="subtitle2">
                          Scoring & Metrics
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        Evaluation across feasibility, impact, alignment, and scalability
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <RecommendIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
                        <Typography variant="subtitle2">
                          Recommendations
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        Actionable suggestions for implementation and refinement
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => setActiveStep(0)}
                sx={{ mr: 2 }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={enhancedIdea.trim().length < 20 || evaluating}
                onClick={handleRunEvaluation}
                startIcon={evaluating ? undefined : <AssessmentIcon />}
                sx={{ minWidth: 150 }}
              >
                {evaluating ? <CircularProgress size={24} /> : "Run Evaluation"}
              </Button>
            </Box>
          </Box>
        );
      
      case 2:
        return (
          <Box>
            {evaluationResults && (
              <>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Card sx={{ mb: 3, bgcolor: theme.palette.primary.light, color: 'white' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Overall Evaluation Score
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ position: 'relative', display: 'inline-flex', mr: 3 }}>
                            <CircularProgress
                              variant="determinate"
                              value={evaluationResults.overallScore}
                              size={80}
                              thickness={5}
                              sx={{ color: 'white' }}
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
                              <Typography variant="h4" fontWeight="bold" color="white">
                                {evaluationResults.overallScore}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" fontWeight="bold">
                              {evaluationResults.overallScore >= 90 ? 'Excellent Idea' :
                               evaluationResults.overallScore >= 80 ? 'Strong Idea' :
                               evaluationResults.overallScore >= 70 ? 'Good Idea' :
                               'Average Idea'}
                            </Typography>
                            <Typography variant="body1">
                              {evaluationResults.overallScore >= 90 ? 'Highly recommended for implementation' :
                               evaluationResults.overallScore >= 80 ? 'Recommended for implementation' :
                               evaluationResults.overallScore >= 70 ? 'Consider implementation with refinements' :
                               'Needs significant refinement'}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Evaluation Criteria
                    </Typography>
                    <Grid container spacing={2}>
                      {Object.entries(evaluationResults.scores).map(([criteriaKey, score]) => {
                        // Skip the overall score
                        if (criteriaKey === 'overallScore') return null;
                        
                        // Format the criteria name
                        const criteriaName = criteriaKey.charAt(0).toUpperCase() + criteriaKey.slice(1);
                        
                        return (
                          <Grid item xs={12} md={6} lg={4} key={criteriaKey}>
                            <Card sx={{ height: '100%' }}>
                              <CardContent>
                                <Typography variant="subtitle1" gutterBottom>
                                  {criteriaName}
                                </Typography>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={score} 
                                  sx={{ height: 8, borderRadius: 2, mb: 1 }}
                                />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Typography variant="body2" color="text.secondary">
                                    {criteriaName === 'Feasibility' ? 'Implementation difficulty' :
                                     criteriaName === 'Impact' ? 'Business value' :
                                     criteriaName === 'Alignment' ? 'Strategic fit' :
                                     criteriaName === 'Innovation' ? 'Novelty' :
                                     'Growth potential'}
                                  </Typography>
                                  <Typography variant="body2" fontWeight="bold">
                                    {score}%
                                  </Typography>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          AI Feedback
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle1" color="success.main" gutterBottom>
                            Strengths
                          </Typography>
                          <ul style={{ paddingLeft: '20px', marginTop: 0 }}>
                            {evaluationResults.feedback.strengths.map((item, i) => (
                              <li key={i}>
                                <Typography variant="body2">{item}</Typography>
                              </li>
                            ))}
                          </ul>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle1" color="error.main" gutterBottom>
                            Areas for Improvement
                          </Typography>
                          <ul style={{ paddingLeft: '20px', marginTop: 0 }}>
                            {evaluationResults.feedback.weaknesses.map((item, i) => (
                              <li key={i}>
                                <Typography variant="body2">{item}</Typography>
                              </li>
                            ))}
                          </ul>
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" color="primary.main" gutterBottom>
                            Recommendations
                          </Typography>
                          <ul style={{ paddingLeft: '20px', marginTop: 0 }}>
                            {evaluationResults.feedback.recommendations.map((item, i) => (
                              <li key={i}>
                                <Typography variant="body2">{item}</Typography>
                              </li>
                            ))}
                          </ul>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Resource Estimates
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                          Estimated Cost
                        </Typography>
                        <Grid container spacing={1} sx={{ mb: 2 }}>
                          <Grid item xs={12} sm={6}>
                            <Paper variant="outlined" sx={{ p: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Development
                              </Typography>
                              <Typography variant="body1">
                                ${evaluationResults.resources.estimatedCost.development.toLocaleString()}
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Paper variant="outlined" sx={{ p: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Implementation
                              </Typography>
                              <Typography variant="body1">
                                ${evaluationResults.resources.estimatedCost.implementation.toLocaleString()}
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Paper variant="outlined" sx={{ p: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Maintenance
                              </Typography>
                              <Typography variant="body1">
                                ${evaluationResults.resources.estimatedCost.maintenance.toLocaleString()}
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Paper variant="outlined" sx={{ p: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Total Cost
                              </Typography>
                              <Typography variant="body1" fontWeight="bold">
                                ${evaluationResults.resources.estimatedCost.total.toLocaleString()}
                              </Typography>
                            </Paper>
                          </Grid>
                        </Grid>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" gutterBottom>
                              Estimated Timeline
                            </Typography>
                            <Typography variant="body1">
                              {evaluationResults.resources.estimatedTimeline}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" gutterBottom>
                              Suggested Team
                            </Typography>
                            <Typography variant="body1">
                              {evaluationResults.resources.suggestedTeam}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setActiveStep(1)}
                    sx={{ mr: 2 }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleReset}
                  >
                    Evaluate Another Idea
                  </Button>
                </Box>
              </>
            )}
          </Box>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        AI Idea Evaluation
      </Typography>
      <Typography variant="body1" paragraph>
        Our AI system will help you refine and evaluate your innovation idea based on feasibility, impact, and alignment with company goals.
      </Typography>
      
      <Stepper 
        activeStep={activeStep} 
        sx={{ 
          mb: 4,
          '& .MuiStepLabel-iconContainer .Mui-active': { color: 'primary.main' },
          '& .MuiStepLabel-iconContainer .Mui-completed': { color: 'success.main' },
        }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Paper sx={{ p: 3 }}>
        {renderStepContent()}
      </Paper>
    </Box>
  );
};

export default AIEvaluation;