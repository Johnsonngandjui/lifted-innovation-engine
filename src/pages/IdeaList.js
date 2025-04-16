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

const IdeaList = () => {
    const navigate = useNavigate();

    const [expandedId, setExpandedId] = useState(null);
    const [status, setStatus] = React.useState('all');
    const [department, setDepartment] = React.useState('all');
    const [searchText, setSearchText] = useState('');
    const [filteredIdeas, setFilteredIdeas] = useState([]);

    const handleViewDetails = (ideaId, e) => {
        e.stopPropagation();
        navigate(`/ideas/${ideaId}`);
    };

    // Mock data - replace with actual data
    const ideas = [
        {
            id: 1,
            title: "AI-Powered Customer Service Platform",
            author: "John Smith",
            department: "Technology",
            createdAt: "2024-01-15",
            status: "In Progress",
            description: "An AI platform that can handle customer inquiries 24/7, using natural language processing to provide accurate responses and escalate complex issues to human agents when necessary.",
            aiEvaluation: {
                feasibility: 85,
                impact: 92,
                alignment: 78,
                progress: 45
            }
        },
        {
            id: 2,
            title: "Sustainable Packaging Initiative",
            author: "Sarah Johnson",
            department: "Operations",
            createdAt: "2024-01-14",
            status: "Evaluation",
            description: "An AI platform that can handle customer inquiries 24/7, using natural language processing to provide accurate responses and escalate complex issues to human agents when necessary.",
            aiEvaluation: {
                feasibility: 85,
                impact: 92,
                alignment: 78,
                progress: 45
            }
        },
        {
            id: 3,
            title: "Employee Wellness Program",
            author: "Mike Wilson",
            department: "HR",
            createdAt: "2024-01-13",
            status: "Approved",
            description: "An AI platform that can handle customer inquiries 24/7, using natural language processing to provide accurate responses and escalate complex issues to human agents when necessary.",
            aiEvaluation: {
                feasibility: 85,
                impact: 92,
                alignment: 78,
                progress: 45
            }
        },
    ];

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
                            key={idea.id}
                            sx={{
                                mb: 2,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.12)' },
                                cursor: 'pointer'
                            }}
                            onClick={() => setExpandedId(expandedId === idea.id ? null : idea.id)}
                        >
                            <CardContent sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                p: 2.5
                            }}>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                        {idea.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Submitted by {idea.author} ({idea.department}) • {new Date(idea.createdAt).toLocaleDateString()}
                                    </Typography>
                                </Box>
                                <Chip
                                    label={idea.status}
                                    color={getStatusColor(idea.status)}
                                    size="small"
                                    sx={{ ml: 2 }}
                                />
                            </CardContent>

                            <Collapse in={expandedId === idea.id}>
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
                                        <ScoreBar label="Feasibility" value={idea.aiEvaluation.feasibility} />
                                        <ScoreBar label="Impact" value={idea.aiEvaluation.impact} />
                                        <ScoreBar label="Alignment" value={idea.aiEvaluation.alignment} />
                                        <ScoreBar label="Progress" value={idea.aiEvaluation.progress} />
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
                                                handleViewDetails(idea.id, e)
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