// services/apiService.js
const API_BASE_URL = 'http://localhost:3001';

/**
 * Service for handling all API calls to the backend
 */
const apiService = {
  /**
   * Fetch all ideas from the database
   * @returns {Promise<Array>} Array of idea objects
   */
  async getAllIdeas() {
    try {
      const response = await fetch(`${API_BASE_URL}/ideas`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching all ideas:', error);
      throw error;
    }
  },
  
  /**
   * Fetch ideas for a specific user
   * @param {string} userId - The user ID to fetch ideas for
   * @returns {Promise<Array>} Array of idea objects
   */
  async getUserIdeas(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/ideas/${userId}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching ideas for user ${userId}:`, error);
      throw error;
    }
  },
  
  /**
   * Fetch a specific idea by ID
   * @param {string} ideaId - The idea ID to fetch
   * @returns {Promise<Object>} The idea object
   */
  async getIdea(ideaId) {
    try {
      const response = await fetch(`${API_BASE_URL}/idea/${ideaId}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching idea ${ideaId}:`, error);
      throw error;
    }
  },
  
  /**
   * Create a new idea
   * @param {Object} ideaData - The idea data to create
   * @returns {Promise<Object>} The created idea object
   */
  async createIdea(ideaData) {
    try {
      const response = await fetch(`${API_BASE_URL}/idea/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ideaData),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating idea:', error);
      throw error;
    }
  },
  
  /**
   * Update an existing idea
   * @param {string} ideaId - The ID of the idea to update
   * @param {Object} updateData - The data to update
   * @returns {Promise<Object>} The updated idea object
   */
  async updateIdea(ideaId, updateData) {
    try {
      const response = await fetch(`${API_BASE_URL}/idea/${ideaId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error updating idea ${ideaId}:`, error);
      throw error;
    }
  },
  
  /**
   * Enhance an idea with AI
   * @param {Object} idea - The idea to enhance
   * @returns {Promise<Object>} The enhanced idea
   */
  async enhanceIdeaWithAI(idea) {
    try {
      const response = await fetch(`${API_BASE_URL}/gpt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'idea_enhancement',
          message: idea.description,
          context: {
            ideaMetadata: {
              department: idea.authorDept || idea.department,
              title: idea.ideaName || idea.title,
              author: idea.authorName
            }
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error enhancing idea with AI:', error);
      throw error;
    }
  },

  /**
 * Evaluate an idea with AI
 * @param {Object} ideaData - The idea data to evaluate
 * @returns {Promise<Object>} The evaluation results
 */
async evaluateIdea(ideaData) {
  try {
    const response = await fetch(`${API_BASE_URL}/idea/evaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ideaData),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error evaluating idea:', error);
    throw error;
  }
}
};

export default apiService;