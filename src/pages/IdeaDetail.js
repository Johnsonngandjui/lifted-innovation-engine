import React from 'react';
import { useParams } from 'react-router-dom';
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
    AvatarGroup,
    Stack,
} from '@mui/material';
import {
    Assessment as AssessmentIcon,
    Groups as GroupsIcon,
    Link as LinkIcon,
    Comment as CommentIcon,
    ThumbUp as ThumbUpIcon,
} from '@mui/icons-material';

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

const IdeaDetail = () => {
    const { id } = useParams();

    // Mock data - replace with actual API call
    const idea = {
        ideaId: id,
        ideaName: "AI-Powered Customer Service Platform",
        author: "John Smith",
        editors: ["Jane Doe", "Mike Wilson"],
        userId: "js123",
        timestamp: "2024-01-15T10:30:00Z",
        department: "Technology",
        description: "An AI platform that can handle customer inquiries 24/7, using natural language processing to provide accurate responses and escalate complex issues to human agents when necessary.",
        initialContext: "Current customer service operations are manual and time-consuming",
        stageOneContext: "Initial prototype developed",
        stageTwoContext: "User testing phase",
        stageThreeContext: "Integration with existing systems",
        stageFourContext: "Final testing and deployment",
        innovScore: 85,
        impactScore: 92,
        alignScore: 78,
        feasScore: 88,
        components: ["AI Module", "Chat Interface", "Analytics Dashboard"],
        approvers: ["Sarah Johnson", "Robert Brown"],
        jiraTeam: "CS-Team",
        jiraTickets: ["CS-123", "CS-124"],
        likes: 42,
        comments: 15,
        latestStage: "Stage 3",
        parentIdeaId: null,
        childIdeaIds: ["idea456", "idea789"]
    };

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', py: 3 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    {idea.ideaName}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Chip
                        icon={<GroupsIcon />}
                        label={idea.department}
                        color="primary"
                        variant="outlined"
                    />
                    <Chip
                        icon={<AssessmentIcon />}
                        label={idea.latestStage}
                        color="secondary"
                    />
                    <Box sx={{ flexGrow: 1 }} />
                    <Chip
                        icon={<ThumbUpIcon />}
                        label={`${idea.likes} Likes`}
                        variant="outlined"
                    />
                    <Chip
                        icon={<CommentIcon />}
                        label={`${idea.comments} Comments`}
                        variant="outlined"
                    />
                </Stack>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>Description</Typography>
                        <Typography>{idea.description}</Typography>
                    </Paper>

                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>Progress Stages</Typography>
                        <List>
                            {[
                                { stage: "Initial Context", content: idea.initialContext },
                                { stage: "Stage One", content: idea.stageOneContext },
                                { stage: "Stage Two", content: idea.stageTwoContext },
                                { stage: "Stage Three", content: idea.stageThreeContext },
                                { stage: "Stage Four", content: idea.stageFourContext }
                            ].map((stage, index) => (
                                <React.Fragment key={index}>
                                    <ListItem>
                                        <ListItemText
                                            primary={stage.stage}
                                            secondary={stage.content}
                                        />
                                    </ListItem>
                                    {index < 4 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>AI Evaluation</Typography>
                        <Box sx={{ mt: 2 }}>
                            <ScoreBar label="Innovation" value={idea.innovScore} />
                            <ScoreBar label="Impact" value={idea.impactScore} />
                            <ScoreBar label="Alignment" value={idea.alignScore} />
                            <ScoreBar label="Feasibility" value={idea.feasScore} />
                        </Box>
                    </Paper>

                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>Team & Approvals</Typography>
                        <Typography variant="subtitle2" gutterBottom>Author</Typography>
                        <Chip
                            avatar={<Avatar>{idea.author[0]}</Avatar>}
                            label={idea.author}
                            sx={{ mb: 2 }}
                        />

                        <Typography variant="subtitle2" gutterBottom>Editors</Typography>

                            {idea.editors.map((editor, index) => (
                                <Chip
                                    avatar={<Avatar key={index}>{editor[0]}</Avatar>}
                                    label={idea.editors[index]}
                                    sx={{ mb: 2 }}
                                />
                            ))}

                        <Typography variant="subtitle2" gutterBottom>Approvers</Typography>
                            {idea.approvers.map((approver, index) => (
                                <Chip
                                    avatar={<Avatar key={index}>{approver[0]}</Avatar>}
                                    label={idea.approvers[index]}
                                    sx={{ mb: 2 }}
                                />
                            ))}
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Implementation</Typography>
                        <Typography variant="subtitle2" gutterBottom>Components</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                            {idea.components.map((component, index) => (
                                <Chip key={index} label={component} size="small" />
                            ))}
                        </Stack>

                        <Typography variant="subtitle2" gutterBottom>JIRA</Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Team: {idea.jiraTeam}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            {idea.jiraTickets.map((ticket, index) => (
                                <Chip
                                    key={index}
                                    icon={<LinkIcon />}
                                    label={ticket}
                                    size="small"
                                    clickable
                                />
                            ))}
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default IdeaDetail;