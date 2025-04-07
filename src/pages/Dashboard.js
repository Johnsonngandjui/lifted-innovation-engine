// pages/Dashboard.js - Modernized Dashboard with Improved UX
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

// Custom Card with Animated Stats
const StatCard = ({ icon, title, value, subtitle, trend, color }) => {
  const theme = useTheme();
  
  return (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
      <Box 
        sx={{ 
          position: 'absolute', 
          top: -18, 
          left: 24, 
          bgcolor: color || theme.palette.primary.main,
          borderRadius: '12px',
          p: 1.5,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1
        }}
      >
        {icon}
      </Box>
      <CardContent sx={{ pt: 4, pb: 2, px: 3 }}>
        <Box sx={{ mt: 1.5 }}>
          <Typography color="text.secondary" variant="body2" fontWeight={500}>
            {title}
          </Typography>
          <Typography variant="h3" fontWeight="bold" sx={{ my: 1 }}>
            {value}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', height: 24 }}>
            {trend ? (
              <Chip 
                size="small" 
                icon={<ArrowUpwardIcon style={{ fontSize: '0.8rem' }} />} 
                label={trend} 
                color="success" 
                variant="outlined" 
                sx={{ 
                  height: 22, 
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

// Custom component for idea cards
const IdeaCard = ({ idea }) => {
  const theme = useTheme();
  
  // Determine status color
  const getStatusColor = (status) => {
    switch(status) {
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
    <Card sx={{ mb: 2, position: 'relative' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography variant="subtitle1" fontWeight="600">
            {truncate(idea.title, 40)}
          </Typography>
          <Chip
            label={idea.status}
            size="small"
            sx={{
              backgroundColor: getStatusColor(idea.status) + '15',
              color: getStatusColor(idea.status),
              fontWeight: 600,
              fontSize: '0.7rem'
            }}
          />
        </Box>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: 2, height: 40, overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {truncate(idea.description, 120)}
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          {idea.tags.slice(0, 3).map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{ fontSize: '0.7rem', height: 20 }}
            />
          ))}
          {idea.tags.length > 3 && (
            <Chip
              label={`+${idea.tags.length - 3}`}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem', height: 20 }}
            />
          )}
        </Box>
        
        <Divider sx={{ mt: 1, mb: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              sx={{ 
                width: 28, 
                height: 28, 
                fontSize: '0.875rem', 
                bgcolor: theme.palette.primary.light 
              }}
            >
              {idea.submittedBy.charAt(0)}
            </Avatar>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              {idea.submittedBy}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            {idea.dateSubmitted}
          </Typography>
        </Box>
      </CardContent>
      
      {idea.progress > 0 && (
        <LinearProgress 
          variant="determinate" 
          value={idea.progress} 
          sx={{ 
            height: 4, 
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            bgcolor: theme.palette.grey[100]
          }} 
        />
      )}
    </Card>
  );
};

const Dashboard = () => {
  const { ideas, loading, getStats } = useContext(AppContext);
  const theme = useTheme();

  const stats = getStats();
  
  // Custom colors for charts
  const statusColors = [
    theme.palette.success.main,
    theme.palette.primary.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.error.main,
    theme.palette.secondary.main,
    '#9c27b0', // Purple
    '#795548', // Brown
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
      name: dept.length > 12 ? dept.substring(0, 12) + '...' : dept,
      value: stats.departmentCounts[dept],
      fullName: dept
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6); // Show only top 6 departments

  // Custom pie chart label
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
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
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
          to="/submit"
          sx={{ px: 3, py: 1.2, boxShadow: '0 4px 14px rgba(0, 87, 184, 0.25)' }}
        >
          New Idea
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
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

      {/* Charts and Recent Ideas */}
      <Grid container spacing={3}>
        {/* Department Chart */}
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CorporateFareIcon sx={{ color: theme.palette.primary.main, mr: 1.5 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Ideas by Department
                  </Typography>
                </Box>
                <IconButton size="small">
                  <MoreHorizIcon />
                </IconButton>
              </Box>
              
              <Box sx={{ height: 300, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={deptData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      tick={{ fontSize: 12 }} 
                      width={150}
                    />
                    <RechartsTooltip
                      formatter={(value, name, props) => [`${value} ideas`, props.payload.fullName]}
                      labelFormatter={() => 'Department'}
                    />
                    <Bar 
                      dataKey="value" 
                      name="Ideas" 
                      fill={theme.palette.primary.main}
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Status Chart */}
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUpIcon sx={{ color: theme.palette.primary.main, mr: 1.5 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Ideas by Status
                  </Typography>
                </Box>
                <IconButton size="small">
                  <MoreHorizIcon />
                </IconButton>
              </Box>
              
              <Box sx={{ height: 300, width: '100%', display: 'flex', flexDirection: 'column' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
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
                      layout="vertical" 
                      verticalAlign="middle" 
                      align="right"
                      iconSize={10}
                      iconType="circle"
                      formatter={(value) => (
                        <span style={{ fontSize: 12, color: theme.palette.text.primary }}>
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Ideas */}
        <Grid item xs={12} md={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LightbulbIcon sx={{ color: theme.palette.primary.main, mr: 1.5 }} />
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
              
              <Box sx={{ maxHeight: 302, overflow: 'auto', pr: 1 }}>
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
                      py: 4 
                    }}
                  >
                    <LightbulbIcon 
                      sx={{ 
                        fontSize: 48, 
                        color: theme.palette.grey[300],
                        mb: 2
                      }} 
                    />
                    <Typography variant="body1" color="text.secondary" align="center">
                      No ideas submitted yet.
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<AddIcon />}
                      component={Link}
                      to="/submit"
                      sx={{ mt: 2 }}
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
    </Box>
  );
};

export default Dashboard;