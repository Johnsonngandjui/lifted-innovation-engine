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
  LinearProgress
} from '@mui/material';
import { aiEvaluationQuestions, aiEvaluationCriteria } from '../data/mockData';

const AIEvaluation = () => {
  const [ideaText, setIdeaText] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [evaluationResults, setEvaluationResults] = useState(null);
  const [enhancedIdea, setEnhancedIdea] = useState('');
  
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
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock AI enhancement
    const enhanced = ideaText + "\n\nEnhanced context: This idea could be implemented using our existing data infrastructure with minimal additional resources. It aligns with our Q3 objective of improving operational efficiency and could potentially reduce manual processing time by 40%.";
    setEnhancedIdea(enhanced);
    
    setEvaluating(false);
    setActiveStep(1);
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
              <Typography variant="subtitle1" gutterBottom>
                AI Evaluation Questions
              </Typography>
              <Grid container spacing={2}>
                {aiEvaluationQuestions.map((question, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="body2">
                          {question}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
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
                    <Card sx={{ mb: 3 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Overall Evaluation Score
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
                            <CircularProgress
                              variant="determinate"
                              value={evaluationResults.overallScore}
                              size={80}
                              thickness={4}
                              sx={{ color: 
                                evaluationResults.overallScore >= 90 ? 'success.main' :
                                evaluationResults.overallScore >= 70 ? 'primary.main' :
                                'warning.main'
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
                              }}
                            >
                              <Typography variant="h6" component="div">
                                {evaluationResults.overallScore}%
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body1">
                              {evaluationResults.overallScore >= 90 ? 'Excellent Idea - Highly recommended for implementation' :
                               evaluationResults.overallScore >= 80 ? 'Strong Idea - Recommended for implementation' :
                               evaluationResults.overallScore >= 70 ? 'Good Idea - Consider implementation with refinements' :
                               'Average Idea - Needs significant refinement'}
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
                      {aiEvaluationCriteria.map((criteria, index) => {
                        const criteriaName = criteria.name.toLowerCase();
                        const score = evaluationResults.scores[criteriaName] || 0;
                        
                        return (
                          <Grid item xs={12} md={6} lg={4} key={index}>
                            <Card sx={{ height: '100%' }}>
                              <CardContent>
                                <Typography variant="subtitle1" gutterBottom>
                                  {criteria.name}
                                </Typography>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={score} 
                                  sx={{ height: 8, borderRadius: 2, mb: 1 }}
                                />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Typography variant="body2" color="textSecondary">
                                    {criteria.description}
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
                              <Typography variant="body2" color="textSecondary">
                                Development
                              </Typography>
                              <Typography variant="body1">
                                ${evaluationResults.resources.estimatedCost.development.toLocaleString()}
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Paper variant="outlined" sx={{ p: 1 }}>
                              <Typography variant="body2" color="textSecondary">
                                Implementation
                              </Typography>
                              <Typography variant="body1">
                                ${evaluationResults.resources.estimatedCost.implementation.toLocaleString()}
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Paper variant="outlined" sx={{ p: 1 }}>
                              <Typography variant="body2" color="textSecondary">
                                Maintenance
                              </Typography>
                              <Typography variant="body1">
                                ${evaluationResults.resources.estimatedCost.maintenance.toLocaleString()}
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Paper variant="outlined" sx={{ p: 1 }}>
                              <Typography variant="body2" color="textSecondary">
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
      <Typography variant="h4" gutterBottom>
        AI Idea Evaluation
      </Typography>
      <Typography variant="body1" paragraph>
        Our AI system will help you refine and evaluate your innovation idea based on feasibility, impact, and alignment with company goals.
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
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