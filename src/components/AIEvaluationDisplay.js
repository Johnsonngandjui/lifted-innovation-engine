// src/components/AIEvaluationDisplay.js
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Grid,
  LinearProgress,
  Chip,
  useTheme,
  Paper
} from '@mui/material';

// Icons
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import BuildIcon from '@mui/icons-material/Build';
import AssessmentIcon from '@mui/icons-material/Assessment';

/**
 * Component to display AI evaluation results for an idea
 * @param {Object} props Component props
 * @param {Object} props.evaluation Evaluation data with scores and explanations
 */
const AIEvaluationDisplay = ({ evaluation }) => {
  const theme = useTheme();
  
  // If no evaluation data is provided, show empty state
  if (!evaluation) {
    return (
      <Paper elevation={0} variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No evaluation data available for this idea.
        </Typography>
      </Paper>
    );
  }

  // Extract evaluation data with defaults
  const {
    innovationScore = 0,
    impactScore = 0,
    alignmentScore = 0,
    feasibilityScore = 0,
    innovationExplanation = '',
    impactExplanation = '',
    alignmentExplanation = '',
    feasibilityExplanation = ''
  } = evaluation;
  
  // Calculate overall score
  const overallScore = Math.round(
    (innovationScore + impactScore + alignmentScore + feasibilityScore) / 4
  );
  
  // Define criteria data
  const criteriaData = [
    {
      name: 'Innovation',
      score: innovationScore,
      explanation: innovationExplanation,
      icon: <TipsAndUpdatesIcon />,
      color: theme.palette.warning.main
    },
    {
      name: 'Impact',
      score: impactScore,
      explanation: impactExplanation,
      icon: <TrendingUpIcon />,
      color: theme.palette.primary.main
    },
    {
      name: 'Alignment',
      score: alignmentScore,
      explanation: alignmentExplanation,
      icon: <AlignHorizontalLeftIcon />,
      color: theme.palette.info.main
    },
    {
      name: 'Feasibility',
      score: feasibilityScore,
      explanation: feasibilityExplanation,
      icon: <BuildIcon />,
      color: theme.palette.success.main
    }
  ];
  
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

  return (
    <Box>
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
                    transform: `rotate(${(overallScore / 100) * 360}deg)`,
                    transition: 'all 1s ease-out'
                  }
                }}
              >
                <Typography variant="h3" fontWeight="bold">
                  {overallScore}
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
                  {getRatingLabel(overallScore)} Evaluation
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Chip 
                  label={getRatingLabel(overallScore)} 
                  size="small"
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
              
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                {overallScore >= 85 ? 'This idea shows exceptional potential across all evaluation criteria. Highly recommended for implementation.' : 
                 overallScore >= 70 ? 'This idea demonstrates strong potential and aligns well with organizational goals. Recommended for implementation with minor refinements.' :
                 overallScore >= 50 ? 'This idea has potential but requires further development in certain areas before implementation.' :
                 overallScore >= 30 ? 'This idea needs significant improvements in multiple areas to meet organizational standards.' :
                 'This idea requires fundamental reconsideration across most evaluation criteria.'}
              </Typography>
              
              <Box>
                {criteriaData.map((criterion) => (
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
        {criteriaData.map((criterion) => (
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
  );
};

export default AIEvaluationDisplay;