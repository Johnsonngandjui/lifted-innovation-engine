const express = require('express');
const bodyParser = require('body-parser');
const mongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const mongoose = require('mongoose');
const cors = require('cors');
const { ChatOpenAI } = require("@langchain/openai");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");
const { tool } = require("@langchain/core/tools");


const CORTEX_API_BASE_URL = '';
const CHAT_MODEL_NAME = 'gpt-4o'
const CHAT_DEPLOYMENT_NAME = 'gpt-4o-latest'
const API_VERSION = '2024-10-21'
const CORTEX_API_KEY = 'YOUR  API KEY HERE'

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
    const IdeaSchema = new Schema({
        id: ObjectId,
    author: String,
        ideaBody: String,
    stage: String
    });

    ideaModel = mongoose.model('ideaSchema', IdeaSchema);
  
  // for easier changing and resetting of the system prompt used, will modify the non default prompt by user request
  // stage will indicate what part of the idea creation process the user is requesting
    const PromptSchema = new Schema({
        id: ObjectId,
        systemPrompt: String,
    stage: String,
    isDefault: Boolean
    });

    promptModel = mongoose.model('PromptSchema', PromptSchema);
  
  const defaultSystemPrompt = `
### Instructions ###

You are a useful AI assistant that is being asked to get the result of simple math calculations.

### Output ###

Return a JSON Object with key 'result' that holds the result of the users calculation.

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
};

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.post('/gpt', async (req, res) => {
  let response = {statusCode: 500, body: { error: "There was a problem with your request. Please contact suppport." }};


    // not currently used as Liberty's instance of the 4o model does not support strucutured output
    // will be changed as needed depending on what data is needed in the process
  // could also be turned into an array of formats with key based on stage of idea process
  // const chatReturnFormat = {
  //   type: 'object',
    //     properties: {
  //     result: {
    //             description: "the result of the user's calculation",
  //       type: 'float'
  //     },
  //   },
  //   required: [
  //     'result'
  //   ]
  // };

    // const responseFormatterTool = tool(async () => {}, {
    //     name: "responseFormatter",
    //     schema: chatReturnFormat,
    //   });
      

    try {

        // Client that interacts with an OpenAI instance.  In this case, LibertyGPT
        const chatLlm = new ChatOpenAI({
            openAIApiKey: 'BLANK_VALUE', //This is required to be set as any value (actually populated below), don't need to change this value!
            //Other configurations here are optional/can be tweaked to your needs
            // For more information, see LangChain documentation: https://js.langchain.com/docs/api/chat_models_openai/classes/ChatOpenAI
            modelName: CHAT_MODEL_NAME,
            temperature: 0,
            topP: 1,
            maxRetries: 3,
            timeout: 15000
        }, {
            //LibertyGPT endpoint and parameters
            baseURL: `${CORTEX_API_BASE_URL}/rest/v2/azure/openai/deployments/${CHAT_DEPLOYMENT_NAME}`,
            defaultQuery : {
                "api-version": API_VERSION
            },
            defaultHeaders: {
                //Update with your use-case name for LibertyGPT tracking purposes.
                "use-case": "Gavin.Bloom@libertymutual.com langchain-python-example-pattern"
            },
            // Get your API Key from Cortex, or once approved, populate with Azure Client Bearer token value
            apiKey: CORTEX_API_KEY
        }).bind({
            response_format: { type: "json_object" },
        });
        
        //const chatLlmStructured = chatLlm.bindTools([responseFormatterTool]);
        //const chatLlmStructured = chatLlm.withStructuredOutput(chatReturnFormat);
        console.log('calling llm');

    let systemPromptObj = await promptModel.findOne({ isDefault: false });

        let question = JSON.stringify(req.body.message);

        let llmResponse = await chatLlm.invoke([
            new SystemMessage(systemPromptObj.systemPrompt),
            new HumanMessage(question),
        ]);

        response = {statusCode: 200, body: { question: question, response: llmResponse}};
    
    // process changes of idea object into the db as necessary here 
    
    } catch (error) {
        console.log(`Error: ${error.message}`)
        response = {statusCode: 500, body: { error: "There was an error with your request: " + error.message }};
    }
  res.send(response);
    
});

// put request to insert idea changes from user

// get request to get an idea thats in progress from yourself or another user

// put request to update non-default system prompt

// get request to get current non-default system prompt

// patch request to reset system prompt to default value

// run the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

startMongo();