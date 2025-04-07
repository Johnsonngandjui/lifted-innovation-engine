import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  CircularProgress, 
  Divider,
  Paper,
  Avatar,
  Button,
  Chip,
  IconButton,
  Stack,
  useTheme
} from '@mui/material';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import StarIcon from '@mui/icons-material/Star';
import GroupIcon from '@mui/icons-material/Group';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const { ideas, loading, getStats } = useContext(AppContext);
  const theme = useTheme();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  const stats = getStats();

  // Custom colors for charts
  const statusColors = [
    theme.palette.success.main,
    theme.palette.primary.main,
    theme.palette.warning.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    '#9C27B0', // Purple
    '#795548', // Brown
    '#607D8B', // Blue Grey
  ];

  // Prepare data for status pie chart with custom colors
  const statusData = {
    labels: Object.keys(stats.statusCounts),
    datasets: [
      {
        data: Object.values(stats.statusCounts),
        backgroundColor: statusColors,
        borderWidth: 0,
      },
    ],
  };

  // Prepare data for department bar chart
  const deptData = {
    labels: Object.keys(stats.departmentCounts).filter(dept => stats.departmentCounts[dept] > 0),
    datasets: [
      {
        label: 'Ideas per Department',
        data: Object.keys(stats.departmentCounts)
          .filter(dept => stats.departmentCounts[dept] > 0)
          .map(dept => stats.departmentCounts[dept]),
        backgroundColor: theme.palette.primary.main,
        borderRadius: 4,
      },
    ],
  };

  // Options for bar chart
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        },
        grid: {
          display: false,
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    }
  };

  // Options for pie chart
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          padding: 15,
        }
      }
    },
    cutout: '60%',
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Innovation Dashboard
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<LightbulbIcon />}
          component={Link}
          to="/submit"
        >
          Submit New Idea
        </Button>
      </Box>

      {/* Stats Cards Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', borderRadius: 3, position: 'relative', overflow: 'visible' }}>
            <Box 
              sx={{ 
                position: 'absolute', 
                top: -15, 
                left: 20, 
                bgcolor: theme.palette.primary.main,
                borderRadius: '50%',
                p: 1.5,
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
              }}
            >
              <LightbulbIcon sx={{ color: '#fff' }} />
            </Box>
            <CardContent sx={{ pt: 4 }}>
              <Typography color="textSecondary" gutterBottom>
                Total Ideas
              </Typography>
              <Typography variant="h3" fontWeight="bold">{stats.totalIdeas}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Chip size="small" label="+12% from last month" color="success" variant="outlined" 
                  sx={{ 
                    height: 22, 
                    '& .MuiChip-label': { px: 1, fontSize: '0.7rem' } 
                  }} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', borderRadius: 3, position: 'relative', overflow: 'visible' }}>
            <Box 
              sx={{ 
                position: 'absolute', 
                top: -15, 
                left: 20, 
                bgcolor: theme.palette.info.main,
                borderRadius: '50%',
                p: 1.5,
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
              }}
            >
              <TrendingUpIcon sx={{ color: '#fff' }} />
            </Box>
            <CardContent sx={{ pt: 4 }}>
              <Typography color="textSecondary" gutterBottom>
                Ideas in Progress
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {stats.statusCounts['In Progress'] || 0}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {Math.round((stats.statusCounts['In Progress'] || 0) / stats.totalIdeas * 100)}% of total ideas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', borderRadius: 3, position: 'relative', overflow: 'visible' }}>
            <Box 
              sx={{ 
                position: 'absolute', 
                top: -15, 
                left: 20, 
                bgcolor: theme.palette.success.main,
                borderRadius: '50%',
                p: 1.5,
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
              }}
            >
              <StarIcon sx={{ color: '#fff' }} />
            </Box>
            <CardContent sx={{ pt: 4 }}>
              <Typography color="textSecondary" gutterBottom>
                Avg. Feasibility
              </Typography>
              <Typography variant="h3" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                {stats.avgScores.feasibility}<Typography variant="body1" component="span" sx={{ ml: 0.5 }}>%</Typography>
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <ArrowUpwardIcon sx={{ color: theme.palette.success.main, fontSize: '0.9rem', mr: 0.5 }} />
                <Typography variant="body2" color="success.main">+5% from previous quarter</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', borderRadius: 3, position: 'relative', overflow: 'visible' }}>
            <Box 
              sx={{ 
                position: 'absolute', 
                top: -15, 
                left: 20, 
                bgcolor: theme.palette.warning.main,
                borderRadius: '50%',
                p: 1.5,
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
              }}
            >
              <GroupIcon sx={{ color: '#fff' }} />
            </Box>
            <CardContent sx={{ pt: 4 }}>
              <Typography color="textSecondary" gutterBottom>
                Avg. Impact Score
              </Typography>
              <Typography variant="h3" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                {stats.avgScores.impact}<Typography variant="body1" component="span" sx={{ ml: 0.5 }}>%</Typography>
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Across {Object.keys(stats.departmentCounts).length} departments
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts and Recent Ideas Row */}
      <Grid container spacing={3}>
        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                      Ideas by Department
                    </Typography>
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  <Box sx={{ height: 300 }}>
                    <Bar data={deptData} options={barOptions} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                      Ideas by Status
                    </Typography>
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  <Box sx={{ height: 300 }}>
                    <Pie data={statusData} options={pieOptions} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Recent Ideas */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Recent Ideas
                </Typography>
                <Button 
                  endIcon={<ArrowForwardIcon />} 
                  component={Link} 
                  to="/ideas"
                  size="small"
                >
                  View all
                </Button>
              </Box>
              
              <Stack spacing={2}>
                {ideas.slice(-3).reverse().map((idea) => (
                  <Paper key={idea.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">{idea.title}</Typography>
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
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      {idea.description.substring(0, 80)}...
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: theme.palette.primary.main, fontSize: '0.8rem' }}>
                          {idea.submittedBy.charAt(0)}
                        </Avatar>
                        <Typography variant="caption" color="textSecondary">
                          {idea.submittedBy}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="textSecondary">
                        {idea.dateSubmitted}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
                
                {ideas.length === 0 && (
                  <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', p: 2 }}>
                    No ideas submitted yet.
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;