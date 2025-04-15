import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Card,
  CardContent,
  Divider,
  Slider,
  Alert,
  Grid,
  Tooltip,
  IconButton,
  Collapse,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import KeyIcon from '@mui/icons-material/Key';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BusinessIcon from '@mui/icons-material/Business';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const Settings = () => {
  const { aiConfig, updateAIConfig } = useContext(AppContext);
  const [localConfig, setLocalConfig] = useState({ 
    enabled: aiConfig?.enabled || false,
    apiKey: aiConfig?.apiKey || '',
    model: aiConfig?.model || 'gpt-4o',
    temperature: aiConfig?.temperature || 0.7,
    isAdmin: aiConfig?.isAdmin || false,
    evaluationPrompt: aiConfig?.evaluationPrompt || "Evaluate this idea based on innovation, feasibility, and business impact.",
    companyFocus: aiConfig?.companyFocus || [],
    evaluationResources: aiConfig?.evaluationResources || []
  });
  
  const [companyGuidelines, setCompanyGuidelines] = useState(
    aiConfig?.companyGuidelines || "Our company is currently focusing on sustainability and digital transformation initiatives."
  );

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [adminTabValue, setAdminTabValue] = useState(0);
  const [newFocusPoint, setNewFocusPoint] = useState("");
  const [newResourceName, setNewResourceName] = useState("");
  const [newResourceContent, setNewResourceContent] = useState("");
  
  // Rest of your existing handlers...
  const handleToggleAI = (event) => {
    setLocalConfig({
      ...localConfig,
      enabled: event.target.checked
    });
  };
  
  const handleApiKeyChange = (event) => {
    setLocalConfig({
      ...localConfig,
      apiKey: event.target.value
    });
  };
  
  const handleModelChange = (event) => {
    setLocalConfig({
      ...localConfig,
      model: event.target.value
    });
  };
  
  const handleTemperatureChange = (event, newValue) => {
    setLocalConfig({
      ...localConfig,
      temperature: newValue
    });
  };
  
  // New handlers for admin functionality
  const handleToggleAdmin = (event) => {
    setLocalConfig({
      ...localConfig,
      isAdmin: event.target.checked
    });
  };

  const handleEvaluationPromptChange = (event) => {
    setLocalConfig({
      ...localConfig,
      evaluationPrompt: event.target.value
    });
  };

  const handleAdminTabChange = (event, newValue) => {
    setAdminTabValue(newValue);
  };

  const handleAddFocusPoint = () => {
    if (newFocusPoint.trim()) {
      setLocalConfig({
        ...localConfig,
        companyFocus: [...localConfig.companyFocus, newFocusPoint.trim()]
      });
      setNewFocusPoint("");
    }
  };

  const handleDeleteFocusPoint = (index) => {
    const updatedFocus = [...localConfig.companyFocus];
    updatedFocus.splice(index, 1);
    setLocalConfig({
      ...localConfig,
      companyFocus: updatedFocus
    });
  };

  const handleAddResource = () => {
    if (newResourceName.trim() && newResourceContent.trim()) {
      setLocalConfig({
        ...localConfig,
        evaluationResources: [
          ...localConfig.evaluationResources,
          {
            name: newResourceName.trim(),
            content: newResourceContent.trim()
          }
        ]
      });
      setNewResourceName("");
      setNewResourceContent("");
    }
  };

  const handleDeleteResource = (index) => {
    const updatedResources = [...localConfig.evaluationResources];
    updatedResources.splice(index, 1);
    setLocalConfig({
      ...localConfig,
      evaluationResources: updatedResources
    });
  };

  const handleCompanyGuidelinesChange = (event) => {
    setCompanyGuidelines(event.target.value);
  };
  
  const handleSaveSettings = () => {
    updateAIConfig({
      ...localConfig,
      companyGuidelines: companyGuidelines
    });
    setSaveSuccess(true);
    
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };
  
  const getTemperatureDescription = (temp) => {
    if (temp < 0.3) return "More deterministic, focused responses";
    if (temp < 0.7) return "Balanced creativity and determinism";
    return "More creative, varied responses";
  };
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" gutterBottom display="flex" alignItems="center">
                <TipsAndUpdatesIcon sx={{ mr: 1, color: 'secondary.main' }} />
                AI Integration Settings
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={localConfig.isAdmin}
                    onChange={handleToggleAdmin}
                    color="secondary"
                  />
                }
                label={
                  <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <AdminPanelSettingsIcon sx={{ mr: 0.5 }} /> Admin Mode
                  </Typography>
                }
              />
            </Box>
            
            <Typography variant="body1" paragraph color="text.secondary">
              Configure the AI engine that powers the innovation evaluation system. The AI helps evaluate, enhance, and score submitted ideas.
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={localConfig.enabled}
                    onChange={handleToggleAI}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="subtitle1">
                    Enable AI Integration
                  </Typography>
                }
              />
              {localConfig.enabled ? (
                <Typography variant="body2" color="text.secondary">
                  AI evaluation is active. Ideas will be evaluated using the OpenAI API.
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  AI evaluation is disabled. The system will use mock evaluations instead.
                </Typography>
              )}
            </Box>
            
            <Collapse in={localConfig.enabled}>
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom display="flex" alignItems="center">
                    <KeyIcon sx={{ mr: 1, fontSize: '1.2rem', color: 'primary.main' }} />
                    OpenAI API Configuration
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        fullWidth
                        label="OpenAI API Key"
                        value={localConfig.apiKey}
                        onChange={handleApiKeyChange}
                        type={showApiKey ? "text" : "password"}
                        placeholder="sk-..."
                        sx={{ mr: 1 }}
                      />
                      <Button
                        variant="outlined"
                        onClick={() => setShowApiKey(!showApiKey)}
                        size="small"
                      >
                        {showApiKey ? "Hide" : "Show"}
                      </Button>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Get your API key from the OpenAI dashboard. Your API key is stored locally and is never sent to our servers.
                    </Typography>
                  </Box>
                  
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="model-select-label">AI Model</InputLabel>
                    <Select
                      labelId="model-select-label"
                      value={localConfig.model}
                      label="AI Model"
                      onChange={handleModelChange}
                    >
                      <MenuItem value="gpt-4o">GPT-4o (Recommended)</MenuItem>
                      <MenuItem value="gpt-4-turbo">GPT-4 Turbo</MenuItem>
                      <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster, less accurate)</MenuItem>
                    </Select>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      More capable models provide better evaluations but may cost more to use.
                    </Typography>
                  </FormControl>
                  
                  <Box sx={{ mb: 1 }}>
                    <Typography gutterBottom>
                      Response Temperature: {localConfig.temperature}
                      <Tooltip title="Controls randomness in AI responses. Lower values are more deterministic, higher values are more creative.">
                        <IconButton size="small">
                          <HelpOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Typography>
                    <Slider
                      value={localConfig.temperature}
                      onChange={handleTemperatureChange}
                      min={0}
                      max={1}
                      step={0.1}
                      marks={[
                        { value: 0, label: '0' },
                        { value: 0.5, label: '0.5' },
                        { value: 1, label: '1' }
                      ]}
                      valueLabelDisplay="auto"
                    />
                    <Typography variant="body2" color="text.secondary">
                      {getTemperatureDescription(localConfig.temperature)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Innovation Guidelines - Visible to everyone */}
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom display="flex" alignItems="center">
                    <BusinessIcon sx={{ mr: 1, fontSize: '1.2rem', color: 'primary.main' }} />
                    Company Innovation Guidelines
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    These guidelines define what the company is currently looking for in innovation ideas.
                    {!localConfig.isAdmin && " Only admins can modify these guidelines."}
                  </Typography>
                  
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Company Guidelines"
                    value={companyGuidelines}
                    onChange={handleCompanyGuidelinesChange}
                    placeholder="Describe what innovation areas the company is currently focusing on..."
                    variant="outlined"
                    disabled={!localConfig.isAdmin}
                    sx={{ mb: 2 }}
                  />
                  
                  {!localConfig.isAdmin && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      These guidelines help you understand what kinds of innovation ideas are currently valued by the company.
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Evaluation Criteria - Visible to everyone */}
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom display="flex" alignItems="center">
                    <TipsAndUpdatesIcon sx={{ mr: 1, fontSize: '1.2rem', color: 'primary.main' }} />
                    Evaluation Criteria Settings
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Customize how ideas should be evaluated. These settings affect how the AI judges feasibility, impact, and other aspects of innovation ideas.
                  </Typography>
                  
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    label="Evaluation Prompt"
                    value={localConfig.evaluationPrompt}
                    onChange={handleEvaluationPromptChange}
                    placeholder="Describe how ideas should be evaluated..."
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  
                  <Alert severity="info" sx={{ mb: 2 }}>
                    You can customize how ideas are evaluated. Focus on aspects like feasibility, business impact, innovation level, and alignment with company goals.
                  </Alert>
                </CardContent>
              </Card>
              
              {/* Admin Configuration Panel */}
              <Collapse in={localConfig.isAdmin}>
                <Paper variant="outlined" sx={{ mb: 3, p: 0 }}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs 
                      value={adminTabValue} 
                      onChange={handleAdminTabChange}
                      aria-label="admin configuration tabs"
                    >
                      <Tab label="Evaluation Prompt" />
                      <Tab label="Company Focus" />
                      <Tab label="Resources" />
                    </Tabs>
                  </Box>
                  
                  {/* Evaluation Prompt Tab */}
                  <Box sx={{ p: 3, display: adminTabValue === 0 ? 'block' : 'none' }}>
                    <Typography variant="subtitle1" gutterBottom>
                      AI Evaluation Prompt
                      <Tooltip title="This is the prompt that will be sent to the AI for evaluating ideas. You can customize it to focus on specific aspects.">
                        <IconButton size="small">
                          <HelpOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Typography>
                    
                    <TextField
                      fullWidth
                      multiline
                      rows={8}
                      label="Evaluation Prompt Template"
                      value={localConfig.evaluationPrompt}
                      onChange={handleEvaluationPromptChange}
                      placeholder="You are an innovation expert tasked with evaluating an idea..."
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                    
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Use {'{idea}'} as a placeholder for where the idea text should be inserted. You can use {'{companyFocus}'} to insert the company's current focus areas.
                    </Alert>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Tips for effective prompts:
                    </Typography>
                    <ul>
                      <Typography component="li" variant="body2" color="text.secondary">
                        Be specific about evaluation criteria (feasibility, innovation, impact)
                      </Typography>
                      <Typography component="li" variant="body2" color="text.secondary">
                        Ask the AI to provide scores on a specific scale (e.g., 1-10)
                      </Typography>
                      <Typography component="li" variant="body2" color="text.secondary">
                        Request specific feedback categories for idea improvement
                      </Typography>
                    </ul>
                  </Box>
                  
                  {/* Company Focus Tab */}
                  <Box sx={{ p: 3, display: adminTabValue === 1 ? 'block' : 'none' }}>
                    <Typography variant="subtitle1" gutterBottom display="flex" alignItems="center">
                      <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                      Company Focus Areas
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Define the current strategic focus areas for your company. These will guide the AI in evaluating how well ideas align with business objectives.
                    </Typography>
                    
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      <TextField
                        fullWidth
                        label="New Focus Point"
                        value={newFocusPoint}
                        onChange={(e) => setNewFocusPoint(e.target.value)}
                        placeholder="e.g., Sustainability initiatives"
                        sx={{ mr: 1 }}
                      />
                      <Button
                        variant="contained"
                        onClick={handleAddFocusPoint}
                        startIcon={<AddIcon />}
                      >
                        Add
                      </Button>
                    </Box>
                    
                    <Paper variant="outlined" sx={{ mb: 2 }}>
                      <List dense>
                        {localConfig.companyFocus.length === 0 ? (
                          <ListItem>
                            <ListItemText 
                              primary="No focus points defined yet"
                              secondary="Add focus points to help the AI evaluate ideas in context of your business goals"
                            />
                          </ListItem>
                        ) : (
                          localConfig.companyFocus.map((focus, index) => (
                            <ListItem key={index} divider={index < localConfig.companyFocus.length - 1}>
                              <ListItemText primary={focus} />
                              <ListItemSecondaryAction>
                                <IconButton edge="end" onClick={() => handleDeleteFocusPoint(index)}>
                                  <DeleteIcon />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                          ))
                        )}
                      </List>
                    </Paper>
                    
                    <Alert severity="info">
                      These focus points will be provided to the AI to help it understand your company's priorities when evaluating ideas.
                    </Alert>
                  </Box>
                  
                  {/* Resources Tab */}
                  <Box sx={{ p: 3, display: adminTabValue === 2 ? 'block' : 'none' }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Evaluation Resources
                      <Tooltip title="Provide additional context and materials to help the AI evaluate ideas more effectively.">
                        <IconButton size="small">
                          <HelpOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Add knowledge resources that will be used by the AI when evaluating ideas. These could include company guidelines, industry standards, or market research.
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <TextField
                        fullWidth
                        label="Resource Name"
                        value={newResourceName}
                        onChange={(e) => setNewResourceName(e.target.value)}
                        placeholder="e.g., Company Values"
                        sx={{ mb: 2 }}
                      />
                      
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Resource Content"
                        value={newResourceContent}
                        onChange={(e) => setNewResourceContent(e.target.value)}
                        placeholder="Enter text content or reference information..."
                        sx={{ mb: 2 }}
                      />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                          variant="outlined"
                          startIcon={<UploadFileIcon />}
                          disabled
                        >
                          Upload File (Coming Soon)
                        </Button>
                        
                        <Button
                          variant="contained"
                          onClick={handleAddResource}
                          startIcon={<AddIcon />}
                          disabled={!newResourceName.trim() || !newResourceContent.trim()}
                        >
                          Add Resource
                        </Button>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Current Resources ({localConfig.evaluationResources.length})
                    </Typography>
                    
                    {localConfig.evaluationResources.length === 0 ? (
                      <Alert severity="info" sx={{ mb: 2 }}>
                        No resources have been added yet. Add resources to improve the AI's understanding of your company context.
                      </Alert>
                    ) : (
                      <List>
                        {localConfig.evaluationResources.map((resource, index) => (
                          <Paper key={index} variant="outlined" sx={{ mb: 2, p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="subtitle2">{resource.name}</Typography>
                              <IconButton size="small" onClick={() => handleDeleteResource(index)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{
                              maxHeight: '100px',
                              overflow: 'auto',
                              whiteSpace: 'pre-wrap'
                            }}>
                              {resource.content.length > 150 
                                ? `${resource.content.substring(0, 150)}...` 
                                : resource.content}
                            </Typography>
                          </Paper>
                        ))}
                      </List>
                    )}
                  </Box>
                </Paper>
              </Collapse>
              
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">Advanced AI Prompt Settings</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" paragraph color="text.secondary">
                    These settings control how the AI evaluates ideas. The default settings are optimized for most use cases.
                  </Typography>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Evaluation Criteria Weights
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography gutterBottom variant="body2">
                      Feasibility
                    </Typography>
                    <Slider
                      defaultValue={1}
                      min={0.5}
                      max={1.5}
                      step={0.1}
                      marks={[
                        { value: 0.5, label: 'Less' },
                        { value: 1, label: 'Default' },
                        { value: 1.5, label: 'More' }
                      ]}
                      valueLabelDisplay="auto"
                      disabled
                    />
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography gutterBottom variant="body2">
                      Business Impact
                    </Typography>
                    <Slider
                      defaultValue={1}
                      min={0.5}
                      max={1.5}
                      step={0.1}
                      marks={[
                        { value: 0.5, label: 'Less' },
                        { value: 1, label: 'Default' },
                        { value: 1.5, label: 'More' }
                      ]}
                      valueLabelDisplay="auto"
                      disabled
                    />
                  </Box>
                  
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Advanced criteria weighting will be available in a future update. Stay tuned!
                  </Alert>
                </AccordionDetails>
              </Accordion>
            </Collapse>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSaveSettings}
              >
                Save Settings
              </Button>
            </Box>
            
            <Collapse in={saveSuccess}>
              <Alert severity="success" sx={{ mt: 2 }}>
                Settings saved successfully.
              </Alert>
            </Collapse>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              AI Integration Help
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="subtitle2" gutterBottom>
              What does the AI do?
            </Typography>
            <Typography variant="body2" paragraph>
              The AI helps evaluate innovation ideas by analyzing feasibility, impact, alignment with business goals, innovation level, and scalability.
            </Typography>
            
            {localConfig.isAdmin && (
              <>
                <Typography variant="subtitle2" gutterBottom>
                  Admin Settings
                </Typography>
                <Typography variant="body2" paragraph>
                  As an admin, you can customize the AI evaluation prompts, define company focus areas, and add knowledge resources to improve evaluation quality.
                </Typography>
              </>
            )}
            
            <Typography variant="subtitle2" gutterBottom>
              Do I need an API key?
            </Typography>
            <Typography variant="body2" paragraph>
              Yes, to use the real AI evaluation features, you need an OpenAI API key. Without a key, the system will use simulated evaluations.
            </Typography>
            
            <Typography variant="subtitle2" gutterBottom>
              How do I get an API key?
            </Typography>
            <Typography variant="body2" paragraph>
              You can obtain an API key from the OpenAI website. Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">platform.openai.com</a> to create an account and generate a key.
            </Typography>
            
            <Typography variant="subtitle2" gutterBottom>
              Is my API key secure?
            </Typography>
            <Typography variant="body2" paragraph>
              Your API key is stored locally in your browser and is never sent to our servers. API calls are made directly from your browser to OpenAI.
            </Typography>
            
            <Alert severity="info" sx={{ mt: 2 }}>
              Using the AI features will consume API credits from your OpenAI account based on their pricing model.
            </Alert>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;