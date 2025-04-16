const express = require('express');
const bodyParser = require('body-parser');
const mongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const mongoose = require('mongoose');
const cors = require('cors');
const { mockIdeas, aiEvaluationPrompts  } = require('./data/mockDataGavin');

require('dotenv').config();

// Direct configuration without process.env
const PORT = 3001;
const USE_MOCK_DATA = true;
const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY'; // Replace with your actual API key

let ideaModel;
let promptModel;

const startMongo = async () => {
    const mongod = await mongoMemoryServer.create();
    const uri = mongod.getUri();
    console.log(`MongoDB running at ${uri}`);

    await mongoose.connect(uri, { dbName: 'lifted' });

    const Schema = mongoose.Schema;
    const ObjectId = Schema.ObjectId;

    //idea objects created by user, stage indicates what part of the idea creation process this is on
    //further fields can be added to this for the various data needed in the different stages

    //stages = ["created", "innovation", "impact", "alignment", "feasability", "submitted", "approved"]


    const Jira = {
        id: String,
        title: String,
        status: String,
        assignee: String
    };

    const Comment = {
        id: String,
        authorId: String, //n-num
        authorName: String,
        timestamp: Date,
        content: String
    }

    const IdeaSchema = new Schema({
        id: ObjectId, //mongo generated
        ideaName: String, //submitted by idea creator
        authorId: String, //submitted by idea creator
        authorName: String, //submitted by idea creator
        public: Boolean, //submitted by idea creator
        createdAt: Date, //programmatic
        lastUpdated: Date, //programmatic
        authorDept: String,	//submitted by idea creator
        editors: [{id: String, name: String}], //submitted or modified by idea creator
        description: String, //submitted or modified by idea creator
        status: String, //programmatic
        problemStatement: String, //submitted by idea creator
        audience: String, //submitted by idea creator
        expectedImpact: String, //submitted by idea creator
        resources: String, //submitted by idea creator
        innovationExplanation: String, // ai gen
        impactExplanation: String, // ai gen
        alignmentExplanation: String, // ai gen
        feasabilityExplanation: String, // ai gen
        innovationScore: Number, // ai gen
        impactScore: Number, // ai gen
        alignmentScore: Number, // ai gen
        feasabilityScore: Number, // ai gen
        evaluationContext: String, // submitted by idea approver might be split in future
        approvers: [{id: String, name: String}], //submitted by idea creator
        jiraAssignedTeam: String, //submitted by idea approver
        jiraTickets: [Jira], //ai gen
        likes: Number, //submitted by anyone
        comments: [Comment], //submitted by anyone
        parentIdeaId: String, //programmatic, stretch
        childIdeaIds: [String], //programmatic, stretch
        tags: [String] //submitted by idea creator, ai generated as well
    });

    ideaModel = mongoose.model('ideaSchema', IdeaSchema);

    // for easier changing and resetting of the system prompt used, will modify the non default prompt by user request
    // stage will indicate what part of the idea creation process the user is requesting
    const PromptSchema = new Schema({
        id: ObjectId,
        systemPrompt: String,
        stage: String,
        promptType: String,
        isDefault: Boolean
    });

    promptModel = mongoose.model('PromptSchema', PromptSchema);

    const defaultSystemPrompt = `
### Instructions ###

You are a useful AI assistant that is being asked to get the result of simple math calculations.

`;

    promptModel.insertMany({
        systemPrompt: defaultSystemPrompt,
        stage: 'init',
        isDefault: true
    });
    promptModel.insertMany({
        systemPrompt: defaultSystemPrompt,
        stage: 'init',
        isDefault: false
    });

    // Load initial data
    if (USE_MOCK_DATA) { 
        await ideaModel.insertMany(mockIdeas);
        console.log('Mock data loaded');
        await promptModel.insertMany(mockIdeas);
     }
    
};

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Function to make OpenAI API request
async function makeOpenAIRequest(messages, options = {}) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: options.model || 'gpt-3.5-turbo',
            messages: messages,
            temperature: options.temperature || 0.7,
            max_tokens: options.max_tokens || 1500,
        }),
    });

    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

// This is the endpoint that was causing the 404 error - now properly configured
app.post('/gpt', async (req, res) => {
    console.log('Received request to /gpt endpoint');
    let response = {
        statusCode: 500,
        body: { error: "There was a problem with your request. Please contact support." }
    };

    try {
        // Get request type and context
        const requestType = req.body.type || 'general';
        const context = req.body.context || {};
        
        // Log what we received from the client
        console.log(`Request type: ${requestType}`);
        console.log('Request message:', req.body.message);
        
        // Prepare the user input
        let userMessage = req.body.message;

        // Choose appropriate system prompt based on request type
        let systemPrompt;
        
        if (requestType === 'idea_enhancement') {
            systemPrompt = `
                ### Instructions ###
                You are an Innovation AI Assistant specializing in enhancing business ideas. 
                
                Analyze the innovation idea provided and:
                1. Rewrite the description to make it clearer, more compelling, and more impactful
                2. Provide an evaluation of the idea's strengths, weaknesses, and potential business impact
                3. Suggest improvements to make the idea more feasible and valuable
                
                The idea comes from the ${context.ideaMetadata?.department || 'company'} department.
                
                Respond in the following JSON format:
                {
                    "rewritten": "<enhanced description that maintains the core concept but makes it clearer and more compelling>",
                    "evaluation": "<constructive evaluation of the idea's strengths, weaknesses, potential impact, and suggested improvements>"
                }
            `;
        } else {
            // Default prompt for general requests
            systemPrompt = `
                ### Instructions ###
                You are an AI assistant. Your task is to:
                1. Rewrite the user's input to make it clearer, more concise, and professional.
                2. Evaluate the rewritten input and provide constructive feedback on its quality, feasibility, and potential impact.

                Respond in the following JSON format:
                {
                "rewritten": "<rewritten text>",
                "evaluation": "<evaluation text>"
                }
            `;
        }

        console.log(`Processing ${requestType} request...`);

        // Prepare the messages array
        const messages = [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
        ];

        // Call the OpenAI API directly
        const openAIResponse = await makeOpenAIRequest(messages, {
            model: 'gpt-3.5-turbo',
            temperature: 0.7,
            max_tokens: 1500
        });

        let llmResponse = openAIResponse.choices[0].message.content;
        console.log('Received response from OpenAI:', llmResponse.substring(0, 100) + '...');

        // Parse the JSON response
        let parsedResponse;
        try {
            // First check if response contains a JSON structure
            const jsonMatch = llmResponse.match(/\{[\s\S]*\}/);
            
            if (jsonMatch) {
                // Extract just the JSON part and parse it
                const jsonString = jsonMatch[0];
                parsedResponse = JSON.parse(jsonString);
            } else {
                // If no JSON structure found, handle as text and create our own JSON
                console.log("No JSON structure found in response, creating formatted response");
                
                // Split the response to extract key sections if possible
                const sections = llmResponse.split(/\n{2,}/);
                let rewrittenSection = '';
                let evaluationSection = '';
                
                // Try to identify sections based on headers or content
                for (const section of sections) {
                    const lowerSection = section.toLowerCase();
                    if (lowerSection.includes('rewritten') || 
                        lowerSection.includes('enhanced') || 
                        lowerSection.includes('improved')) {
                        rewrittenSection = section.replace(/^(rewritten|enhanced|improved)(\s*idea)?(\s*:)/i, '').trim();
                    } else if (lowerSection.includes('evaluation') || 
                              lowerSection.includes('feedback') || 
                              lowerSection.includes('assessment')) {
                        evaluationSection = section.replace(/^(evaluation|feedback|assessment)(\s*:)/i, '').trim();
                    }
                }
                
                // If couldn't identify sections, use first half for rewritten and second half for evaluation
                if (!rewrittenSection && !evaluationSection && sections.length >= 2) {
                    const midPoint = Math.floor(sections.length / 2);
                    rewrittenSection = sections.slice(0, midPoint).join('\n\n');
                    evaluationSection = sections.slice(midPoint).join('\n\n');
                } else if (!rewrittenSection && !evaluationSection) {
                    // Last resort: use the whole response as rewritten and a generic message for evaluation
                    rewrittenSection = llmResponse;
                    evaluationSection = "No formal evaluation was provided by the AI.";
                }
                
                // Create a structured response
                parsedResponse = {
                    rewritten: rewrittenSection || "AI enhancement failed to provide a rewritten version.",
                    evaluation: evaluationSection || "AI enhancement failed to provide an evaluation."
                };
            }
        } catch (jsonError) {
            console.error('Error parsing LLM response:', jsonError.message);
            console.log('Attempting fallback parsing...');
            
            // More aggressive JSON extraction attempt
            try {
                // Try to find anything that looks like a JSON object with our expected fields
                const jsonRegex = /\{[\s\S]*?"rewritten"[\s\S]*?"evaluation"[\s\S]*?\}/;
                const match = llmResponse.match(jsonRegex);
                
                if (match) {
                    // Clean up common formatting issues
                    const cleanedJson = match[0]
                        .replace(/(\w+):/g, '"$1":') // Add quotes to keys without quotes
                        .replace(/:\s*"([^"]*?)"\s*([,}])/g, ':"$1"$2') // Fix missing quotes on values
                        .replace(/:\s*'([^']*?)'\s*([,}])/g, ':"$1"$2') // Replace single quotes with double quotes
                        .replace(/,\s*}/g, '}') // Remove trailing commas
                        .replace(/}\s*{/g, '},{') // Fix missing commas between objects
                        .replace(/"\s+"/g, '","') // Fix spaces between quoted strings
                        .replace(/([{,])\s*(\w+)\s*:/g, '$1"$2":'); // Add quotes to unquoted keys
                    
                    parsedResponse = JSON.parse(cleanedJson);
                } else {
                    throw new Error('Could not extract valid JSON structure');
                }
            } catch (fallbackError) {
                console.error('Fallback parsing failed:', fallbackError);
                
                // Create a structured response from the raw text as last resort
                parsedResponse = {
                    rewritten: "The AI provided a response but it couldn't be parsed correctly.",
                    evaluation: `Original response: ${llmResponse.substring(0, 500)}${llmResponse.length > 500 ? '...' : ''}`
                };
            }
        }

        // Ensure the response contains the expected fields
        if (!parsedResponse.rewritten || !parsedResponse.evaluation) {
            console.warn('The AI response is missing required fields, using defaults');
            parsedResponse = {
                ...parsedResponse,
                rewritten: parsedResponse.rewritten || "The AI couldn't provide a proper rewrite.",
                evaluation: parsedResponse.evaluation || "The AI couldn't provide a proper evaluation. Please try again or contact support if this issue persists."
            };
        }

        // Format the final response
        response = {
            statusCode: 200,
            body: {
                response: {
                    rewritten: parsedResponse.rewritten,
                    evaluation: parsedResponse.evaluation
                }
            }
        };
        
        console.log('Sending successful response to client');

    } catch (error) {
        console.error(`Error: ${error.message}`);
        response = {
            statusCode: 500,
            body: { error: "There was an error with your request: " + error.message }
        };
    }

    res.status(response.statusCode).send(response.body);
});

// get all ideas
app.get('/ideas', async (req, res) => {
    const ideas = await ideaModel.find({});
    res.send(ideas);
});

// get all ideas for given user
app.get('/ideas/:userId', async (req, res) => {
    const { userId } = req.params;
    const ideas = await ideaModel.find({ authorId: userId });
    res.send(ideas);
});

// get specific idea info
app.get('/idea/:ideaId', async (req, res) => {
    const { ideaId } = req.params;
    try {
        // Use _id instead of ideaId, and convert the string id to ObjectId
        const idea = await ideaModel.findOne({ _id: ideaId });
        if (!idea) {
            return res.status(404).send({ message: 'Idea not found' });
        }
        res.send(idea);
    } catch (error) {
        console.error('Error fetching idea:', error);
        res.status(404).send({ message: 'Idea not found', error: error.message });
    }
});

//post create new idea
//post create new idea
//post create new idea
app.post('/idea/create', async (req, res) => {
    try {
        // Create a new idea document
        const newIdea = new ideaModel({
            ideaName: req.body.ideaName,
            authorId: req.body.authorId,
            authorName: req.body.authorName,
            authorDept: req.body.authorDept,
            public: req.body.public || true,
            createdAt: new Date(),
            lastUpdated: new Date(),
            description: req.body.description,
            status: req.body.status || "created",
            problemStatement: req.body.problemStatement,
            audience: req.body.audience,
            expectedImpact: req.body.expectedImpact,
            resources: req.body.resources,
            likes: 0,
            parentIdeaId: req.body.parentIdeaId || "",
            tags: req.body.tags || []
        });
        
        // Save the new idea
        const savedIdea = await newIdea.save();
        
        // Return the complete saved idea object with MongoDB-generated ID
        res.status(201).json(savedIdea);
    } catch (error) { 
        console.error('Error creating idea:', error);
        res.status(400).json({ 
            message: 'Error creating idea', 
            error: error.message 
        });
    }
});

// patch update idea
app.patch('/idea/:ideaId', async (req, res) => {
    const { ideaId } = req.params;
    const updateData = req.body;
    try {
        const updatedIdea = await ideaModel.findOneAndUpdate(
            { ideaId },        
            updateData,       
            { new: true, runValidators: true } 
          );
        if (!updatedIdea) { res.status(404).send({ message: 'Idea not found' }); }
    
        res.send(updatedIdea);
    } catch (error) {
        res.status(400).send({ message: 'Error updating idea', error });
    }
});

app.post('/idea/evaluate', async (req, res) => {
    try {
        const { 
            ideaName,
            description,
            authorName,
            authorDept,
            tags,
            problemStatement,
            audience,
            expectedImpact,
            resources
        } = req.body;
        
        // Format the idea description for use in the prompts
        const ideaDescription = `
# Innovation Idea Details

## Basic Information
Title: ${ideaName || 'Untitled Idea'}
Created by: ${authorName || 'Anonymous'}
Department: ${authorDept || 'Not specified'}
Tags: ${tags && tags.length > 0 ? tags.join(', ') : 'None'}

## Description
${description || 'No description provided'}

## Problem Statement
${problemStatement || 'No problem statement provided'}

## Target Audience
${audience || 'Not specified'}

## Expected Impact
${expectedImpact || 'Not specified'}

## Resources Needed
${resources || 'Not specified'}
`;

        // Get all evaluation prompts from the database
        const evaluationPrompts = await promptModel.find({ 
            promptType: { $in: ['innovation', 'impact', 'alignment', 'feasibility'] },
            isDefault: true
        });

        if (!evaluationPrompts || evaluationPrompts.length === 0) {
            throw new Error('Evaluation prompts not found in database');
        }

        // Create a map of prompt types to their content
        const promptMap = {};
        evaluationPrompts.forEach(prompt => {
            promptMap[prompt.promptType] = prompt.systemPrompt.replace('{IDEA_DESCRIPTION}', ideaDescription);
        });

        // Make OpenAI API calls for each evaluation type
        const [innovationResponse, impactResponse, alignmentResponse, feasibilityResponse] = await Promise.all([
            makeOpenAIRequest([
                { role: "system", content: promptMap.innovation },
                { role: "user", content: "Please evaluate the innovation level of this idea." }
            ]),
            makeOpenAIRequest([
                { role: "system", content: promptMap.impact },
                { role: "user", content: "Please evaluate the potential impact of this idea." }
            ]),
            makeOpenAIRequest([
                { role: "system", content: promptMap.alignment },
                { role: "user", content: "Please evaluate the alignment of this idea with organizational goals." }
            ]),
            makeOpenAIRequest([
                { role: "system", content: promptMap.feasibility },
                { role: "user", content: "Please evaluate the feasibility of implementing this idea." }
            ])
        ]);

        // Parse the JSON responses
        const parseResponse = (response) => {
            try {
                return JSON.parse(response.choices[0].message.content);
            } catch (error) {
                console.error(`Error parsing response:`, error);
                return { score: 50, explanation: "Error parsing AI evaluation response." };
            }
        };

        const innovationResult = parseResponse(innovationResponse);
        const impactResult = parseResponse(impactResponse);
        const alignmentResult = parseResponse(alignmentResponse);
        const feasibilityResult = parseResponse(feasibilityResponse);

        // Calculate overall score (average of all scores)
        const overallScore = Math.round(
            (innovationResult.score + impactResult.score + alignmentResult.score + feasibilityResult.score) / 4
        );

        // Prepare the evaluation results
        const evaluationResults = {
            innovationScore: innovationResult.score,
            impactScore: impactResult.score,
            alignmentScore: alignmentResult.score,
            feasibilityScore: feasibilityResult.score,
            innovationExplanation: innovationResult.explanation,
            impactExplanation: impactResult.explanation,
            alignmentExplanation: alignmentResult.explanation,
            feasibilityExplanation: feasibilityResult.explanation,
            overallScore
        };

        // Return the evaluation results
        res.status(200).json(evaluationResults);

    } catch (error) {
        console.error('Error evaluating idea:', error);
        res.status(500).json({ 
            error: 'Error evaluating idea',
            message: error.message 
        });
    }
});
const loadEvaluationPrompts = async () => {
    try {
        // Check if prompts already exist
        const existingPrompts = await promptModel.find({
            promptType: { $in: ['innovation', 'impact', 'alignment', 'feasibility'] }
        });

        if (existingPrompts.length === 0) {
            // Insert the evaluation prompts
            await promptModel.insertMany([
                {
                    systemPrompt: aiEvaluationPrompts.innovation,
                    promptType: 'innovation',
                    isDefault: true
                },
                {
                    systemPrompt: aiEvaluationPrompts.impact,
                    promptType: 'impact',
                    isDefault: true
                },
                {
                    systemPrompt: aiEvaluationPrompts.alignment,
                    promptType: 'alignment',
                    isDefault: true
                },
                {
                    systemPrompt: aiEvaluationPrompts.feasibility,
                    promptType: 'feasibility',
                    isDefault: true
                }
            ]);
            console.log('AI evaluation prompts loaded into database');
        }
    } catch (error) {
        console.error('Error loading evaluation prompts:', error);
    }
};

// Call this function after starting MongoDB
const startServer = async () => {
    await startMongo();
    await loadEvaluationPrompts();
    
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();