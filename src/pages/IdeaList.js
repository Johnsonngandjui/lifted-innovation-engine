// pages/IdeaList.js - Modernized Ideas List with Better UX and Filtering
import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Divider,
  Avatar,
  Tooltip,
  useTheme,
  Tab,
  Tabs,
  InputAdornment,
  Menu,
  ListItemIcon,
  ListItemText,
  Paper,
  Badge,
  Stack
} from '@mui/material';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CommentIcon from '@mui/icons-material/Comment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import CloseIcon from '@mui/icons-material/Close';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ForwardIcon from '@mui/icons-material/Forward';

// Import AIEvaluationDialog component directly here
// We'll define it within this file instead of importing

const IdeaList = () => {
  const { ideas, loading, statusOptions, departments, evaluateIdea } = useContext(AppContext);
  const theme = useTheme();

  // Filter and sort states
  const [filters, setFilters] = useState({
    status: '',
    department: '',
    search: '',
  });
  const [sortBy, setSortBy] = useState('dateSubmitted_desc');
  const [showFilters, setShowFilters] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [bookmarkedIdeas, setBookmarkedIdeas] = useState([]);

  // Filter menu state
  const [sortAnchorEl, setSortAnchorEl] = useState(null);

  // AI Evaluation dialog states
  const [evaluationOpen, setEvaluationOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Handle sort menu
  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    handleSortClose();
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Toggle bookmark
  const toggleBookmark = (ideaId) => {
    if (bookmarkedIdeas.includes(ideaId)) {
      setBookmarkedIdeas(bookmarkedIdeas.filter(id => id !== ideaId));
    } else {
      setBookmarkedIdeas([...bookmarkedIdeas, ideaId]);
    }
  };

  // Open idea evaluation
  const handleOpenEvaluation = (idea) => {
    setSelectedIdea(idea);
    setEvaluationOpen(true);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: '',
      department: '',
      search: '',
    });
  };

  // Status tabs mapping
  const tabStatuses = ['All', 'Draft', 'Submitted', 'In Progress', 'Approved', 'Completed'];

  // Filter and sort ideas
  const filteredIdeas = useMemo(() => {
    // Start with all ideas
    let result = [...ideas];

    // Tab filter (status)
    if (currentTab > 0) {
      result = result.filter(idea => idea.status === tabStatuses[currentTab]);
    }

    // Status filter (if not already filtered by tab)
    if (filters.status && (currentTab === 0)) {
      result = result.filter(idea => idea.status === filters.status);
    }

    // Department filter
    if (filters.department) {
      result = result.filter(idea => idea.department === filters.department);
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(idea =>
        idea.title.toLowerCase().includes(searchLower) ||
        idea.description.toLowerCase().includes(searchLower) ||
        idea.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort
    const [sortField, sortDirection] = sortBy.split('_');
    result = result.sort((a, b) => {
      // Special handling for aiScore.overall
      if (sortField === 'score') {
        // Default to 0 for ideas without scores
        const scoreA = a.aiScore?.overall || 0;
        const scoreB = b.aiScore?.overall || 0;
        return sortDirection === 'asc' ? scoreA - scoreB : scoreB - scoreA;
      }

      // Normal string/date sorting
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [ideas, filters, sortBy, currentTab]);

  // Filter bookmarked ideas
  const bookmarkedFilteredIdeas = useMemo(() => {
    return filteredIdeas.filter(idea => bookmarkedIdeas.includes(idea.id));
  }, [filteredIdeas, bookmarkedIdeas]);

  // Display ideas based on current view
  const displayedIdeas = currentTab === 5 ? bookmarkedFilteredIdeas : filteredIdeas;

  // Helper to get color for status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'primary';
      case 'Approved': return 'info';
      case 'Evaluation': return 'warning';
      case 'Submitted': return 'secondary';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircleOutlineIcon fontSize="small" />;
      case 'In Progress': return <PlayArrowIcon fontSize="small" />;
      case 'Approved': return <CheckCircleIcon fontSize="small" />;
      case 'Evaluation': return <AssessmentIcon fontSize="small" />;
      case 'Submitted': return <LightbulbIcon fontSize="small" />;
      case 'On Hold': return <PauseIcon fontSize="small" />;
      case 'Rejected': return <CloseIcon fontSize="small" />;
      default: return <AccessTimeIcon fontSize="small" />;
    }
  };

  // Render idea card
  const renderIdeaCard = (idea) => {
    const isBookmarked = bookmarkedIdeas.includes(idea.id);

    return (
      <Card
        sx={{
          mb: 3,
          position: 'relative',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
            transform: 'translateY(-3px)'
          }
        }}
        key={idea.id}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1
          }}
        >
          <IconButton
            size="small"
            onClick={() => toggleBookmark(idea.id)}
            sx={{
              color: isBookmarked ? 'warning.main' : 'grey.400',
              '&:hover': {
                color: isBookmarked ? 'warning.main' : 'grey.600',
              }
            }}
          >
            {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </IconButton>
        </Box>

        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                  {idea.title}
                </Typography>
                <Chip
                  icon={getStatusIcon(idea.status)}
                  label={idea.status}
                  size="small"
                  color={getStatusColor(idea.status)}
                  sx={{ ml: 1 }}
                />
              </Box>

              <Typography variant="body2" color="text.secondary" paragraph>
                {idea.description.length > 200
                  ? `${idea.description.substring(0, 200)}...`
                  : idea.description}
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                {idea.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem' }}
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    bgcolor: theme.palette.primary.main,
                    fontSize: '0.9rem',
                    mr: 1
                  }}
                >
                  {idea.submittedBy.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {idea.submittedBy}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {idea.department}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary">
                Submitted on
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {idea.dateSubmitted}
              </Typography>
            </Grid>

            {idea.aiScore && idea.aiScore.overall > 0 && (
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
                    <CircularProgress
                      variant="determinate"
                      value={idea.aiScore.overall}
                      size={36}
                      thickness={4}
                      sx={{
                        color:
                          idea.aiScore.overall >= 85 ? 'success.main' :
                            idea.aiScore.overall >= 70 ? 'primary.main' :
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
                      <Typography variant="caption" fontWeight="bold">
                        {idea.aiScore.overall}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      AI Score
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Feasibility: {idea.aiScore.feasibility}%
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}

            {idea.progress > 0 && (
              <Grid item xs={12}>
                <Box sx={{ mb: 0, mt: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="body2" fontWeight="medium">Progress</Typography>
                    <Typography variant="body2" color="text.secondary">{idea.progress}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={idea.progress}
                    sx={{ height: 6, borderRadius: 5 }}
                  />
                </Box>
              </Grid>
            )}

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                {idea.status === 'Submitted' && (
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AssessmentIcon />}
                    onClick={() => handleOpenEvaluation(idea)}
                    sx={{ mr: 1 }}
                  >
                    Evaluate
                  </Button>
                )}

                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ForwardIcon />}
                  component={Link}
                  to={`/ideas/${idea.id}`}
                >
                  View Details
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Innovation Ideas
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Browse, filter, and evaluate innovation ideas from across the organization
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={Link}
          to="/create"
          sx={{ px: 3, py: 1.2, boxShadow: '0 4px 14px rgba(0, 87, 184, 0.25)' }}
        >
          Create Idea
        </Button>
      </Box>

      {/* Filters and Search */}
      <Paper sx={{ mb: 3, p: 2, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              placeholder="Search ideas..."
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
              }}
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
              size="medium"
              sx={{ height: 40 }}
            >
              Filters
            </Button>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<SortIcon />}
              onClick={handleSortClick}
              size="medium"
              sx={{ height: 40 }}
            >
              {sortBy.includes('title') ? 'Title' :
                sortBy.includes('dateSubmitted') ? 'Date' :
                  sortBy.includes('score') ? 'AI Score' : 'Sort By'}
              {sortBy.includes('asc') ? ' (A-Z)' : ' (Z-A)'}
            </Button>
            <Menu
              anchorEl={sortAnchorEl}
              open={Boolean(sortAnchorEl)}
              onClose={handleSortClose}
            >
              <MenuItem onClick={() => handleSortChange('dateSubmitted_desc')}>
                <ListItemIcon>
                  <CalendarTodayIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Newest First</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleSortChange('dateSubmitted_asc')}>
                <ListItemIcon>
                  <CalendarTodayIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Oldest First</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleSortChange('title_asc')}>
                <ListItemIcon>
                  <SortByAlphaIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Title (A-Z)</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleSortChange('title_desc')}>
                <ListItemIcon>
                  <SortByAlphaIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Title (Z-A)</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleSortChange('score_desc')}>
                <ListItemIcon>
                  <TrendingUpIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Highest AI Score</ListItemText>
              </MenuItem>
            </Menu>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              {(filters.status || filters.department || filters.search) && (
                <Button
                  variant="text"
                  onClick={clearFilters}
                  size="medium"
                  sx={{ mr: 1 }}
                >
                  Clear Filters
                </Button>
              )}
              <Badge
                color="primary"
                badgeContent={
                  (filters.status ? 1 : 0) +
                  (filters.department ? 1 : 0) +
                  (filters.search ? 1 : 0)
                }
                sx={{ mr: 1 }}
              >
                <FilterAltIcon color="action" />
              </Badge>
              <Typography variant="body2" color="text.secondary">
                {displayedIdeas.length} ideas
              </Typography>
            </Box>
          </Grid>

          {showFilters && (
            <>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel id="status-filter-label">Status</InputLabel>
                  <Select
                    labelId="status-filter-label"
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    label="Status"
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel id="department-filter-label">Department</InputLabel>
                  <Select
                    labelId="department-filter-label"
                    name="department"
                    value={filters.department}
                    onChange={handleFilterChange}
                    label="Department"
                  >
                    <MenuItem value="">All Departments</MenuItem>
                    {departments.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>

      {/* Idea Status Tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.95rem',
              minWidth: 100,
            },
          }}
        >
          <Tab label="All Ideas" />
          <Tab label={
            <Badge badgeContent={ideas.filter(i => i.status === 'Draft').length} color="default">
              Draft
            </Badge>
          } />
          <Tab label={
            <Badge badgeContent={ideas.filter(i => i.status === 'Submitted').length} color="primary">
              Submitted
            </Badge>
          } />
          <Tab label={
            <Badge badgeContent={ideas.filter(i => i.status === 'In Progress').length} color="primary">
              In Progress
            </Badge>
          } />
          <Tab label={
            <Badge badgeContent={ideas.filter(i => i.status === 'Approved').length} color="primary">
              Approved
            </Badge>
          } />
          <Tab label={
            <Badge badgeContent={ideas.filter(i => i.status === 'Completed').length} color="primary">
              Completed
            </Badge>
          } />
          <Tab
            label={
              <Badge badgeContent={bookmarkedIdeas.length} color="warning">
                Bookmarked
              </Badge>
            }
            icon={<BookmarkIcon sx={{ fontSize: '1.2rem' }} />}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Ideas List */}
      {displayedIdeas.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 10
          }}
        >
          <LightbulbIcon
            sx={{
              fontSize: 72,
              color: theme.palette.grey[300],
              mb: 3
            }}
          />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No ideas found
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3, maxWidth: 400 }}>
            {currentTab === 5
              ? "You haven't bookmarked any ideas yet."
              : "There are no ideas matching your current filters."}
          </Typography>
          {filters.status || filters.department || filters.search ? (
            <Button
              variant="outlined"
              onClick={clearFilters}
              startIcon={<FilterAltIcon />}
            >
              Clear Filters
            </Button>
          ) : (
            <Button
              variant="contained"
              component={Link}
              to="/submit"
              startIcon={<AddIcon />}
            >
              Submit New Idea
            </Button>
          )}
        </Box>
      ) : (
        <Box>
          {displayedIdeas.map(renderIdeaCard)}
        </Box>
      )}

      {/* AI Evaluation Dialog */}
      {selectedIdea && (
        <AIEvaluationDialog
          open={evaluationOpen}
          onClose={() => setEvaluationOpen(false)}
          idea={selectedIdea}
          onEvaluate={evaluateIdea}
        />
      )}
    </Box>
  );
};

// Inline AIEvaluationDialog component to fix import errors
const AIEvaluationDialog = ({ open, onClose, idea, onEvaluate }) => {
  const theme = useTheme();
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationComplete, setEvaluationComplete] = useState(false);

  const handleStartEvaluation = async () => {
    setEvaluating(true);

    // Simulate evaluation delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Call the evaluation function
    onEvaluate(idea.id);

    setEvaluating(false);
    setEvaluationComplete(true);
  };

  return (
    <Dialog
      open={open}
      onClose={evaluating ? undefined : onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            AI Evaluation: {idea.title}
          </Typography>
          {!evaluating && (
            <IconButton onClick={onClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent>
        {evaluating ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h6" gutterBottom>
              AI Evaluation in Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Our AI is analyzing the idea using multiple data points...
            </Typography>
          </Box>
        ) : evaluationComplete ? (
          <Box>
            <Alert severity="success" sx={{ mb: 3 }}>
              AI evaluation complete!
            </Alert>

            <Typography variant="subtitle1" gutterBottom>
              Evaluation Results
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="body2">Feasibility</Typography>
                <LinearProgress
                  variant="determinate"
                  value={85}
                  sx={{ height: 8, borderRadius: 2 }}
                />
                <Typography variant="body2" align="right">85%</Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant="body2">Impact</Typography>
                <LinearProgress
                  variant="determinate"
                  value={92}
                  color="secondary"
                  sx={{ height: 8, borderRadius: 2 }}
                />
                <Typography variant="body2" align="right">92%</Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant="body2">Alignment</Typography>
                <LinearProgress
                  variant="determinate"
                  value={78}
                  color="success"
                  sx={{ height: 8, borderRadius: 2 }}
                />
                <Typography variant="body2" align="right">78%</Typography>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                AI Recommendations
              </Typography>
              <Typography variant="body1" paragraph>
                This idea shows strong potential with high impact and good feasibility. The alignment with company goals is solid but could be improved. Recommended next steps include:
              </Typography>
              <Typography component="ul" sx={{ pl: 2 }}>
                <li>Create detailed implementation plan</li>
                <li>Consult with the IT Infrastructure team for technical requirements</li>
                <li>Consider a small pilot project to demonstrate value</li>
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography variant="body1" paragraph>
              Our AI will evaluate this idea based on:
            </Typography>
            <Typography component="ul">
              <li>Feasibility - How realistic is implementation given current resources</li>
              <li>Impact - Potential positive effects on business metrics</li>
              <li>Alignment - How well the idea aligns with company goals</li>
            </Typography>
            <Typography variant="body1" paragraph>
              The AI will also provide recommendations and resource estimates.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        {!evaluationComplete ? (
          <>
            <Button onClick={onClose} disabled={evaluating}>
              Cancel
            </Button>
            {!evaluating && (
              <Button
                variant="contained"
                onClick={handleStartEvaluation}
                disabled={evaluating}
              >
                Start Evaluation
              </Button>
            )}
          </>
        ) : (
          <Button
            variant="contained"
            onClick={onClose}
          >
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default IdeaList;