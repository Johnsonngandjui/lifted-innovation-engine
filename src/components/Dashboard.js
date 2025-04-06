import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Box, Card, CardContent, Typography, Grid, CircularProgress, Divider } from '@mui/material';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const { ideas, loading, getStats } = useContext(AppContext);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  const stats = getStats();

  // Prepare data for status pie chart
  const statusData = {
    labels: Object.keys(stats.statusCounts),
    datasets: [
      {
        data: Object.values(stats.statusCounts),
        backgroundColor: [
          '#4CAF50', // Green
          '#2196F3', // Blue
          '#FFC107', // Amber
          '#9C27B0', // Purple
          '#F44336', // Red
          '#FF9800', // Orange
          '#795548', // Brown
          '#607D8B', // Blue Grey
          '#E91E63', // Pink
        ],
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
        backgroundColor: '#1976d2',
      },
    ],
  };

  // Options for bar chart
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Innovation Dashboard
      </Typography>
      <Typography variant="body1" paragraph>
        Track the progress of innovation ideas across the organization.
      </Typography>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Ideas
              </Typography>
              <Typography variant="h3">{stats.totalIdeas}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Ideas in Progress
              </Typography>
              <Typography variant="h3">
                {stats.statusCounts['In Progress'] || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avg. Feasibility Score
              </Typography>
              <Typography variant="h3">{stats.avgScores.feasibility}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avg. Impact Score
              </Typography>
              <Typography variant="h3">{stats.avgScores.impact}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Ideas */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Ideas
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {ideas.slice(-3).reverse().map((idea) => (
                <Box key={idea.id} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1">{idea.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Submitted by: {idea.submittedBy} | Status: {idea.status}
                  </Typography>
                  <Typography variant="body2" noWrap>
                    {idea.description.substring(0, 100)}...
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ideas by Status
              </Typography>
              <Box sx={{ height: 300 }}>
                <Pie data={statusData} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ideas by Department
              </Typography>
              <Box sx={{ height: 300 }}>
                <Bar data={deptData} options={barOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;