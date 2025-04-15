// pages/Dashboard.js - Complete Restructuring for Better Fit
import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Chip,
  IconButton,
  Avatar,
  Divider,
  useTheme,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';

// Icons
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SchoolIcon from '@mui/icons-material/School';
import GroupsIcon from '@mui/icons-material/Groups';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Simple Stat Card - Redesigned for better space utilization
const StatCard = ({ icon, title, value, subtitle, trend, color }) => {
  const theme = useTheme();

  return (
    <Card sx={{ height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <Box
            sx={{
              mr: 2,
              bgcolor: color || theme.palette.primary.main,
              borderRadius: '8px',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography color="text.secondary" variant="body2" fontWeight={500}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ my: 0.5 }}>
              {value}
            </Typography>
            {trend ? (
              <Chip
                size="small"
                icon={<ArrowUpwardIcon style={{ fontSize: '0.8rem' }} />}
                label={trend}
                color="success"
                variant="outlined"
                sx={{
                  height: 20,
                  '& .MuiChip-label': { px: 1, fontSize: '0.7rem', fontWeight: 600 }
                }}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Compact component for idea cards
const IdeaCard = ({ idea }) => {
  const theme = useTheme();

  // Determine status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return theme.palette.success.main;
      case 'In Progress': return theme.palette.primary.main;
      case 'Approved': return theme.palette.info.main;
      case 'Evaluation': return theme.palette.warning.main;
      default: return theme.palette.grey[500];
    }
  };

  // Truncate text
  const truncate = (text, length) => {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  return (
    <Box sx={{ mb: 2, pb: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="subtitle2" fontWeight="600">
          {truncate(idea.title, 40)}
        </Typography>
        <Chip
          label={idea.status}
          size="small"
          sx={{
            backgroundColor: getStatusColor(idea.status) + '15',
            color: getStatusColor(idea.status),
            fontWeight: 600,
            fontSize: '0.65rem',
            height: 18
          }}
        />
      </Box>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 1, fontSize: '0.8rem' }}
      >
        {truncate(idea.description, 100)}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            sx={{
              width: 20,
              height: 20,
              fontSize: '0.75rem',
              bgcolor: theme.palette.primary.light
            }}
          >
            {idea.submittedBy.charAt(0)}
          </Avatar>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 0.75, fontSize: '0.7rem' }}>
            {idea.submittedBy}
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
          {idea.dateSubmitted}
        </Typography>
      </Box>

      {idea.progress > 0 && (
        <LinearProgress
          variant="determinate"
          value={idea.progress}
          sx={{
            height: 3,
            mt: 1,
            borderRadius: 5,
            bgcolor: theme.palette.grey[100]
          }}
        />
      )}
    </Box>
  );
};

const Dashboard = () => {
  const { ideas, getStats } = useContext(AppContext);
  const theme = useTheme();

  const stats = getStats();

  // Custom colors for charts
  const statusColors = [
    theme.palette.success.main,
    theme.palette.primary.main,
    theme.palette.warning.main,
    theme.palette.info.main,
  ];

  // Prepare data for status pie chart
  const statusData = Object.keys(stats.statusCounts).map(status => ({
    name: status,
    value: stats.statusCounts[status]
  })).filter(item => item.value > 0);

  // Prepare data for department bar chart
  const deptData = Object.keys(stats.departmentCounts)
    .filter(dept => stats.departmentCounts[dept] > 0)
    .map(dept => ({
      name: dept,
      value: stats.departmentCounts[dept],
      fullName: dept
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Show top 5 departments

  // Custom pie chart label
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    // Only show label if percentage is significant enough (>= 8%)
    if (percent < 0.08) return null;

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={11}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Innovation Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track, analyze, and manage innovation ideas across the organization
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={Link}
          to="/create"
          sx={{ px: 2, py: 1, boxShadow: '0 4px 10px rgba(0, 87, 184, 0.2)' }}
        >
          New Idea
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<LightbulbIcon sx={{ color: '#fff' }} />}
            title="Total Ideas"
            value={stats.totalIdeas}
            trend="+12% from last month"
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<BuildIcon sx={{ color: '#fff' }} />}
            title="In Progress"
            value={stats.statusCounts['In Progress'] || 0}
            subtitle={`${Math.round((stats.statusCounts['In Progress'] || 0) / stats.totalIdeas * 100)}% of total`}
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<ShowChartIcon sx={{ color: '#fff' }} />}
            title="Avg. Feasibility"
            value={`${stats.avgScores.feasibility}%`}
            trend="+5% from previous quarter"
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<GroupsIcon sx={{ color: '#fff' }} />}
            title="Avg. Impact Score"
            value={`${stats.avgScores.impact}%`}
            subtitle={`Across ${Object.keys(stats.departmentCounts).length} departments`}
            color={theme.palette.warning.main}
          />
        </Grid>
      </Grid>

      {/* Charts and Recent Ideas Row */}
      <Grid container spacing={2.5}>

        {/* Status Chart + Recent Ideas - Stacked column */}
        <Grid item xs={12} lg={7}>
          <Grid container spacing={2.5} direction="column">
            {/* Status Chart */}
            <Grid item xs={12}>
              <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrendingUpIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                      <Typography variant="h6" fontWeight={600}>
                        Ideas by Status
                      </Typography>
                    </Box>
                    <IconButton size="small">
                      <MoreHorizIcon />
                    </IconButton>
                  </Box>

                  <Box sx={{ height: 200, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={1}
                          dataKey="value"
                          labelLine={false}
                          label={renderCustomizedLabel}
                        >
                          {statusData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={statusColors[index % statusColors.length]}
                            />
                          ))}
                        </Pie>
                        <RechartsTooltip formatter={(value) => [`${value} ideas`, 'Count']} />
                        <Legend
                          layout="horizontal"
                          verticalAlign="bottom"
                          align="center"
                          iconSize={10}
                          iconType="circle"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Ideas */}
            <Grid item xs={12}>
              <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LightbulbIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                      <Typography variant="h6" fontWeight={600}>
                        Recent Ideas
                      </Typography>
                    </Box>
                    <Button
                      endIcon={<ArrowForwardIcon />}
                      component={Link}
                      to="/ideas"
                      color="primary"
                      size="small"
                    >
                      View all
                    </Button>
                  </Box>

                  <Box sx={{ maxHeight: 220, overflow: 'auto', pr: 1 }}>
                    {ideas.length > 0 ? (
                      ideas.slice(-3).reverse().map((idea) => (
                        <IdeaCard key={idea.id} idea={idea} />
                      ))
                    ) : (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          py: 3
                        }}
                      >
                        <LightbulbIcon
                          sx={{
                            fontSize: 36,
                            color: theme.palette.grey[300],
                            mb: 1.5
                          }}
                        />
                        <Typography variant="body2" color="text.secondary" align="center">
                          No ideas submitted yet.
                        </Typography>
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<AddIcon />}
                          component={Link}
                          to="/submit"
                          sx={{ mt: 1.5, py: 0.5 }}
                          size="small"
                        >
                          Submit First Idea
                        </Button>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;