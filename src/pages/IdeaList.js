import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Grid,
    Card,
    CardContent,
    Chip,
    Collapse,
    LinearProgress,
    Button,
    Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import CommentIcon from '@mui/icons-material/Comment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';

const IdeaList = () => {
    const navigate = useNavigate();
    const [expandedId, setExpandedId] = useState(null);
    const [status, setStatus] = useState('all');
    const [department, setDepartment] = useState('all');
    const [searchText, setSearchText] = useState('');
    const [ideas, setIdeas] = useState([]);
    const [filteredIdeas, setFilteredIdeas] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch ideas from API
    useEffect(() => {
        const fetchIdeas = async () => {
            try {
                const response = await axios.get('http://localhost:3001/ideas');
                setIdeas(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching ideas:', error);
                setLoading(false);
            }
        };
        
        fetchIdeas();
    }, []);

    // Filter ideas based on search criteria
    useEffect(() => {
        if (!ideas) return;
        
        const filtered = ideas.filter(idea => {
            const matchesSearch = idea.ideaName.toLowerCase().includes(searchText.toLowerCase()) ||
                idea.authorName.toLowerCase().includes(searchText.toLowerCase());
            const matchesStatus = status === 'all' || 
                (status === 'in_progress' ? idea.status === 'In Progress' : 
                 status === 'evaluation' ? idea.status === 'Evaluation' : 
                 status === 'approved' ? idea.status === 'Approved' : true);
            const matchesDepartment = department === 'all' || idea.authorDept === department;

            return matchesSearch && matchesStatus && matchesDepartment;
        });

        setFilteredIdeas(filtered);
    }, [searchText, status, department, ideas]);

    const handleViewDetails = (ideaId, e) => {
        e.stopPropagation();
        navigate(`/ideas/${ideaId}`);
    };

    const ScoreBar = ({ label, value }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ width: 100 }}>
                {label}
            </Typography>
            <Box sx={{ flex: 1, mr: 2 }}>
                <LinearProgress
                    variant="determinate"
                    value={value}
                    sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(0,0,0,0.08)',
                        '& .MuiLinearProgress-bar': {
                            borderRadius: 4
                        }
                    }}
                />
            </Box>
            <Typography variant="body2" sx={{ minWidth: 40 }}>
                {value}%
            </Typography>
        </Box>
    );

    // Filter ideas based on search criteria
    useEffect(() => {
        const filtered = ideas.filter(idea => {
            const matchesSearch = idea.title.toLowerCase().includes(searchText.toLowerCase()) ||
                idea.author.toLowerCase().includes(searchText.toLowerCase());
            const matchesStatus = status === 'all' || idea.status.toLowerCase().replace(' ', '_') === status;
            const matchesDepartment = department === 'all' || idea.department === department;

            return matchesSearch && matchesStatus && matchesDepartment;
        });

        setFilteredIdeas(filtered);
    }, [searchText, status, department]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'In Progress': return 'info';
            case 'Evaluation': return 'warning';
            case 'Approved': return 'success';
            default: return 'default';
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Innovation Ideas
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Browse and search through all submitted ideas
                </Typography>
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs>
                    <TextField
                        fullWidth
                        placeholder="Search ideas..."
                        variant="outlined"
                        size="small"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: 'text.secondary' }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={status}
                            label="Status"
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="in_progress">In Progress</MenuItem>
                            <MenuItem value="evaluation">Evaluation</MenuItem>
                            <MenuItem value="approved">Approved</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Department</InputLabel>
                        <Select
                            value={department}
                            label="Department"
                            onChange={(e) => setDepartment(e.target.value)}
                        >
                            <MenuItem value="all">All</MenuItem>
                            {Array.from(new Set(ideas.map(idea => idea.department))).map(dept => (
                                <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Box sx={{ mt: 2 }}>
                {filteredIdeas.length > 0 ? (
                    filteredIdeas.map((idea) => (
                        <Card
                            key={idea._id}
                            sx={{
                                mb: 2,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.12)' },
                                cursor: 'pointer'
                            }}
                            onClick={() => setExpandedId(expandedId === idea._id ? null : idea._id)}
                        >
                            <CardContent sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                p: 2.5
                            }}>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                        {idea.ideaName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Submitted by {idea.authorName} ({idea.authorDept}) • {new Date(idea.createdAt).toLocaleDateString()}
                                    </Typography>
                                </Box>
                                <Chip
                                    label={idea.status}
                                    color={getStatusColor(idea.status)}
                                    size="small"
                                    sx={{ ml: 2 }}
                                />
                            </CardContent>

                            <Collapse in={expandedId === idea._id}>
                                <CardContent sx={{ pt: 0, px: 2.5, pb: 2.5 }}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body1" paragraph>
                                            {idea.description}
                                        </Typography>
                                    </Box>

                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                        AI Evaluation
                                    </Typography>
                                    <Box sx={{ mt: 1.5 }}>
                                        <ScoreBar label="Innovation" value={idea.innovationScore || 0} />
                                        <ScoreBar label="Impact" value={idea.impactScore || 0} />
                                        <ScoreBar label="Alignment" value={idea.alignmentScore || 0} />
                                        <ScoreBar label="Feasability" value={idea.feasabilityScore || 0} />
                                    </Box>
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        sx={{
                                            mt: 3,
                                            justifyContent: 'flex-end'
                                        }}
                                    >
                                        <Button
                                            size="small"
                                            startIcon={<CommentIcon />}
                                            variant="outlined"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Add comment handler
                                            }}
                                        >
                                            Add Comment
                                        </Button>
                                        <Button
                                            size="small"
                                            startIcon={<VisibilityIcon />}
                                            variant="contained"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleViewDetails(idea._id, e)
                                            }}
                                        >
                                            View Details
                                        </Button>
                                    </Stack>
                                </CardContent>
                            </Collapse>
                        </Card>
                    ))
                ) : (
                    <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 4 }}>
                        No ideas match your search criteria
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default IdeaList;