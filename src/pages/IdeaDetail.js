import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Chip,
    LinearProgress,
    Divider,
    List,
    ListItem,
    ListItemText,
    Avatar,
    Stack,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    Assessment as AssessmentIcon,
    Groups as GroupsIcon,
    Link as LinkIcon,
    Comment as CommentIcon,
    ThumbUp as ThumbUpIcon,
    Person as PersonIcon,
    Business as BusinessIcon,
    Tag as TagIcon,
} from '@mui/icons-material';

const API_BASE_URL = 'http://localhost:3001';

const ScoreBar = ({ label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="body2" sx={{ width: 100 }}>
            {label}
        </Typography>
        <Box sx={{ flex: 1, mr: 2 }}>
            <LinearProgress
                variant="determinate"
                value={value || 0}
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
            {value || 0}%
        </Typography>
    </Box>
);

const IdeaDetail = () => {
    const { id } = useParams();
    const [idea, setIdea] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchIdea = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/idea/${id}`);
                setIdea(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching idea:', err);
                setError('Failed to load idea. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchIdea();
        }
    }, [id]);

    // Format date helper
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        
        const date = new Date(dateString);
        return isNaN(date.getTime()) 
            ? 'Invalid date' 
            : date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !idea) {
        return (
            <Box sx={{ maxWidth: 1200, mx: 'auto', py: 3 }}>
                <Alert severity="error">{error || 'Idea not found'}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', py: 3 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    {idea.ideaName}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
                    <Chip
                        icon={<BusinessIcon />}
                        label={idea.authorDept || 'Department not specified'}
                        color="primary"
                        variant="outlined"
                    />
                    <Chip
                        icon={<AssessmentIcon />}
                        label={idea.status || 'Status not set'}
                        color="secondary"
                    />
                    {idea.tags && idea.tags.length > 0 && (
                        <Chip
                            icon={<TagIcon />}
                            label={idea.tags[0]}
                            variant="outlined"
                        />
                    )}
                    <Box sx={{ flexGrow: 1 }} />
                    <Chip
                        icon={<ThumbUpIcon />}
                        label={`${idea.likes || 0} Likes`}
                        variant="outlined"
                    />
                    <Chip
                        icon={<CommentIcon />}
                        label={`${idea.comments?.length || 0} Comments`}
                        variant="outlined"
                    />
                </Stack>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>Description</Typography>
                        <Typography>{idea.description}</Typography>
                        
                        {idea.problemStatement && (
                            <>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" gutterBottom>Problem Statement</Typography>
                                <Typography>{idea.problemStatement}</Typography>
                            </>
                        )}
                        
                        {idea.audience && (
                            <>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" gutterBottom>Target Audience</Typography>
                                <Typography>{idea.audience}</Typography>
                            </>
                        )}
                        
                        {idea.expectedImpact && (
                            <>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" gutterBottom>Expected Impact</Typography>
                                <Typography>{idea.expectedImpact}</Typography>
                            </>
                        )}
                        
                        {idea.resources && (
                            <>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" gutterBottom>Resources Needed</Typography>
                                <Typography>{idea.resources}</Typography>
                            </>
                        )}
                    </Paper>

                    {idea.innovationExplanation && (
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" gutterBottom>AI Enhanced Description</Typography>
                            <Typography>{idea.innovationExplanation}</Typography>
                        </Paper>
                    )}

                    {idea.impactExplanation && (
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" gutterBottom>Impact Analysis</Typography>
                            <Typography>{idea.impactExplanation}</Typography>
                        </Paper>
                    )}

                    {idea.alignmentExplanation && (
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" gutterBottom>Alignment Analysis</Typography>
                            <Typography>{idea.alignmentExplanation}</Typography>
                        </Paper>
                    )}

                    {idea.feasabilityExplanation && (
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" gutterBottom>Feasibility Analysis</Typography>
                            <Typography>{idea.feasabilityExplanation}</Typography>
                        </Paper>
                    )}

                    {idea.jiraTickets && idea.jiraTickets.length > 0 && (
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" gutterBottom>Implementation Tasks</Typography>
                            <List>
                                {idea.jiraTickets.map((ticket, index) => (
                                    <React.Fragment key={index}>
                                        <ListItem>
                                            <ListItemText
                                                primary={`${ticket.id}: ${ticket.title}`}
                                                secondary={`Status: ${ticket.status} | Assignee: ${ticket.assignee}`}
                                            />
                                        </ListItem>
                                        {index < idea.jiraTickets.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </Paper>
                    )}

                    {idea.comments && idea.comments.length > 0 && (
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" gutterBottom>Comments</Typography>
                            <List>
                                {idea.comments.map((comment, index) => (
                                    <React.Fragment key={index}>
                                        <ListItem alignItems="flex-start">
                                            <Avatar sx={{ mr: 2 }}>{comment.authorName?.[0] || 'U'}</Avatar>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography variant="subtitle2">
                                                            {comment.authorName}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {formatDate(comment.timestamp)}
                                                        </Typography>
                                                    </Box>
                                                }
                                                secondary={comment.content}
                                            />
                                        </ListItem>
                                        {index < idea.comments.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </Paper>
                    )}
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>Idea Details</Typography>
                        
                        <Typography variant="subtitle2" gutterBottom>Author</Typography>
                        <Chip
                            avatar={<Avatar>{idea.authorName?.[0] || 'U'}</Avatar>}
                            label={idea.authorName}
                            sx={{ mb: 2 }}
                        />

                        {idea.authorDept && (
                            <>
                                <Typography variant="subtitle2" gutterBottom>Department</Typography>
                                <Chip
                                    icon={<BusinessIcon />}
                                    label={idea.authorDept}
                                    sx={{ mb: 2 }}
                                />
                            </>
                        )}

                        <Typography variant="subtitle2" gutterBottom>Created</Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            {formatDate(idea.createdAt)}
                        </Typography>

                        <Typography variant="subtitle2" gutterBottom>Last Updated</Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            {formatDate(idea.lastUpdated)}
                        </Typography>

                        <Typography variant="subtitle2" gutterBottom>Status</Typography>
                        <Chip
                            label={idea.status || 'Not set'}
                            color="primary"
                            sx={{ mb: 2 }}
                        />

                        {idea.editors && idea.editors.length > 0 && (
                            <>
                                <Typography variant="subtitle2" gutterBottom>Editors</Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                                    {idea.editors.map((editor, index) => (
                                        <Chip
                                            key={index}
                                            avatar={<Avatar>{editor.name?.[0] || 'E'}</Avatar>}
                                            label={editor.name}
                                            sx={{ mb: 1 }}
                                        />
                                    ))}
                                </Stack>
                            </>
                        )}

                        {idea.approvers && idea.approvers.length > 0 && (
                            <>
                                <Typography variant="subtitle2" gutterBottom>Approvers</Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                                    {idea.approvers.map((approver, index) => (
                                        <Chip
                                            key={index}
                                            avatar={<Avatar>{approver.name?.[0] || 'A'}</Avatar>}
                                            label={approver.name}
                                            sx={{ mb: 1 }}
                                        />
                                    ))}
                                </Stack>
                            </>
                        )}

                        {idea.tags && idea.tags.length > 0 && (
                            <>
                                <Typography variant="subtitle2" gutterBottom>Tags</Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                                    {idea.tags.map((tag, index) => (
                                        <Chip
                                            key={index}
                                            label={tag}
                                            size="small"
                                            sx={{ mb: 1 }}
                                        />
                                    ))}
                                </Stack>
                            </>
                        )}
                    </Paper>

                    {(idea.innovationScore > 0 || idea.impactScore > 0 || idea.alignmentScore > 0 || idea.feasabilityScore > 0) && (
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" gutterBottom>AI Evaluation</Typography>
                            <Box sx={{ mt: 2 }}>
                                {idea.innovationScore > 0 && <ScoreBar label="Innovation" value={idea.innovationScore} />}
                                {idea.impactScore > 0 && <ScoreBar label="Impact" value={idea.impactScore} />}
                                {idea.alignmentScore > 0 && <ScoreBar label="Alignment" value={idea.alignmentScore} />}
                                {idea.feasabilityScore > 0 && <ScoreBar label="Feasibility" value={idea.feasabilityScore} />}
                                
                                {/* Calculate overall score */}
                                {(idea.innovationScore > 0 || idea.impactScore > 0 || idea.alignmentScore > 0 || idea.feasabilityScore > 0) && (
                                    <>
                                        <Divider sx={{ my: 2 }} />
                                        <ScoreBar 
                                            label="Overall" 
                                            value={Math.round((
                                                (idea.innovationScore || 0) + 
                                                (idea.impactScore || 0) + 
                                                (idea.alignmentScore || 0) + 
                                                (idea.feasabilityScore || 0)
                                            ) / 4)} 
                                        />
                                    </>
                                )}
                            </Box>
                        </Paper>
                    )}

                    {idea.jiraAssignedTeam && (
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Implementation</Typography>
                            
                            <Typography variant="subtitle2" gutterBottom>JIRA Team</Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                {idea.jiraAssignedTeam}
                            </Typography>
                            
                            {idea.jiraTickets && idea.jiraTickets.length > 0 && (
                                <>
                                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>JIRA Tickets</Typography>
                                    <Stack direction="row" spacing={1} flexWrap="wrap">
                                        {idea.jiraTickets.map((ticket, index) => (
                                            <Chip
                                                key={index}
                                                icon={<LinkIcon />}
                                                label={ticket.id}
                                                size="small"
                                                clickable
                                            />
                                        ))}
                                    </Stack>
                                </>
                            )}
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default IdeaDetail;