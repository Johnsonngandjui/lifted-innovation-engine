// src/services/apiService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

/**
 * Service to handle all API calls to the backend
 */
const apiService = {
  /**
   * Get all ideas
   * @returns {Promise} Promise with ideas data
   */
  getAllIdeas: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ideas`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ideas:', error);
      throw error;
    }
  },

  /**
   * Get ideas for a specific user
   * @param {string} userId - User ID
   * @returns {Promise} Promise with user's ideas data
   */
  getUserIdeas: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ideas/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ideas for user ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Get a specific idea
   * @param {string} ideaId - Idea ID
   * @returns {Promise} Promise with idea data
   */
  getIdea: async (ideaId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/idea/${ideaId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching idea ${ideaId}:`, error);
      throw error;
    }
  },


  /**
   * Create a new idea
   * @param {Object} ideaData - New idea data
   * @returns {Promise} Promise with creation result
   */
  createIdea: async (ideaData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/idea/create`, ideaData);

      // The server now returns the complete saved idea with MongoDB-generated ID
      return response.data;
    } catch (error) {
      console.error('Error creating idea:', error);
      throw error;
    }
  },

  /**
   * Update an existing idea
   * @param {string} ideaId - Idea ID to update
   * @param {Object} updateData - Data to update
   * @returns {Promise} Promise with updated idea data
   */
  updateIdea: async (ideaId, updateData) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/idea/${ideaId}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Error updating idea ${ideaId}:`, error);
      throw error;
    }
  },

  /**
   * Enhance idea with AI
   * @param {Object} ideaData - Idea data to enhance
   * @returns {Promise} Promise with AI enhancement result
   */
  enhanceIdeaWithAI: async (ideaData) => {
    try {
      // Format all the idea information in a clear structure
      const ideaText = `
# Innovation Idea Details

## Basic Information
Title: ${ideaData.ideaName || ideaData.title}
Created by: ${ideaData.authorName || ideaData.submittedBy}
Department: ${ideaData.authorDept || ideaData.department}
Tags: ${ideaData.tags && ideaData.tags.length > 0 ? ideaData.tags.join(', ') : 'None'}

## Description
${ideaData.description}

## Problem Statement
${ideaData.problemStatement}

## Target Audience
${ideaData.audience || ideaData.targetAudience || 'Not specified'}

## Expected Impact
${ideaData.expectedImpact}

## Resources Needed
${ideaData.resources || ideaData.resourcesNeeded || 'Not specified'}

Please enhance this innovation idea to make it more compelling, impactful, and business-oriented. Maintain the core concept but improve clarity and presentation.
`;

      const response = await axios.post(`${API_BASE_URL}/gpt`, {
        message: ideaText,
        type: 'idea_enhancement',
        context: {
          stage: 'enhancement',
          ideaMetadata: {
            department: ideaData.authorDept || ideaData.department,
            tags: ideaData.tags
          }
        }
      });

      return response.data.response;
    } catch (error) {
      console.error('Error enhancing idea with AI:', error);
      throw error;
    }
  }
};

export default apiService;