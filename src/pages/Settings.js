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
  InputLabel
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import KeyIcon from '@mui/icons-material/Key';

const Settings = () => {
  const { aiConfig, updateAIConfig } = useContext(AppContext);
  const [localConfig, setLocalConfig] = useState({ ...aiConfig });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  
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
  
  const handleSaveSettings = () => {
    updateAIConfig(localConfig);
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
            <Typography variant="h5" gutterBottom display="flex" alignItems="center">
              <TipsAndUpdatesIcon sx={{ mr: 1, color: 'secondary.main' }} />
              AI Integration Settings
            </Typography>
            
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