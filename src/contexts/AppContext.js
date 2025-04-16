import React, { createContext, useState, useEffect } from 'react';
import { departments, teams, statusOptions } from '../data/mockData';
import apiService from '../services/apiService';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch ideas from the MongoDB database via API
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setLoading(true);
        const fetchedIdeas = await apiService.getAllIdeas();
        setIdeas(fetchedIdeas);
        setError(null);
      } catch (err) {
        console.error('Error fetching ideas:', err);
        setError('Failed to load ideas. Please try again later.');
        // Fallback to mock data if API fails
        // This helps during development if the server isn't running
        setIdeas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  // Add a new idea via API
  const addIdea = async (idea) => {
    try {
      setLoading(true);
      
      // Create idea in the database
      const response = await apiService.createIdea(idea);
      
      // If successful, fetch the updated list of ideas
      // Or, add the new idea to the state
      const newIdea = {
        ...idea,
        id: ideas.length + 1, // This is temporary - the server will assign the real ID
        createdAt: new Date(),
        lastUpdated: new Date()
      };
      
      setIdeas([...ideas, newIdea]);
      setError(null);
      return newIdea;
    } catch (err) {
      console.error('Error adding idea:', err);
      setError('Failed to add idea. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an idea via API
  const updateIdea = async (id, updatedData) => {
    try {
      setLoading(true);
      
      // Update idea in the database
      await apiService.updateIdea(id, updatedData);
      
      // Update the idea in the local state
      setIdeas(ideas.map(idea => 
        idea.id === id ? { ...idea, ...updatedData, lastUpdated: new Date() } : idea
      ));
      
      setError(null);
    } catch (err) {
      console.error('Error updating idea:', err);
      setError('Failed to update idea. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Evaluate an idea with AI
  const evaluateIdea = async (id) => {
    try {
      setLoading(true);
      
      // Get the idea to evaluate
      const idea = ideas.find(idea => idea.id === id);
      if (!idea) {
        throw new Error('Idea not found');
      }
      
      // Call the AI enhancement API
      const enhancementResult = await apiService.enhanceIdeaWithAI(idea);
      
      // Generate scores from the enhancement
      // In a real implementation, these would come from the AI
      const generateRandomScore = () => Math.floor(Math.random() * 30) + 70; // Random score between 70-99
      
      const aiScore = {
        innovationScore: generateRandomScore(),
        impactScore: generateRandomScore(),
        alignmentScore: generateRandomScore(),
        feasibilityScore: generateRandomScore(),
        overall: 0
      };
      
      // Calculate overall score as average
      aiScore.overall = Math.round(
        (aiScore.innovationScore + aiScore.impactScore + aiScore.alignmentScore + aiScore.feasibilityScore) / 4
      );
      
      // Assign team based on idea content and tags
      const potentialTeams = [...teams];
      const assignedTeam = potentialTeams[Math.floor(Math.random() * potentialTeams.length)];
      
      // Update the idea with AI evaluation results
      const updatedIdea = {
        ...idea,
        innovationScore: aiScore.innovationScore,
        impactScore: aiScore.impactScore,
        alignmentScore: aiScore.alignmentScore,
        feasibilityScore: aiScore.feasabilityScore,
        status: 'evaluation',
        jiraAssignedTeam: assignedTeam,
        innovationExplanation: enhancementResult.rewritten || idea.description,
        impactExplanation: enhancementResult.evaluation || "AI evaluation of impact"
      };
      
      // Save the updated idea to the database
      await updateIdea(id, updatedIdea);
      
      setError(null);
      return updatedIdea;
    } catch (err) {
      console.error('Error evaluating idea:', err);
      setError('Failed to evaluate idea. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create Jira tickets for an idea
  const createJiraTickets = (id) => {
    const idea = ideas.find(idea => idea.id === id);
    if (!idea) return null;
    
    // Simulate Jira ticket creation
    const ticketTypes = [
      "Research requirements",
      "Design solution architecture",
      "Develop proof of concept",
      "Create implementation plan",
      "Allocate resources",
      "Develop MVP",
      "Test implementation",
      "Deploy to production",
      "Monitor and collect feedback"
    ];
    
    // Create 3-5 Jira tickets
    const numTickets = Math.floor(Math.random() * 3) + 3;
    const jiraTickets = [];
    
    for (let i = 0; i < numTickets; i++) {
      const ticketType = ticketTypes[Math.floor(Math.random() * ticketTypes.length)];
      const jiraId = `LIFT-${Math.floor(Math.random() * 900) + 100}`;
      
      jiraTickets.push({
        id: jiraId,
        title: ticketType + " for " + idea.ideaName,
        status: "Not Started",
        assignee: idea.jiraAssignedTeam
      });
    }
    
    const updatedIdea = {
      ...idea,
      jiraTickets,
      status: 'approved',
      progress: 5 // Starting progress
    };
    
    updateIdea(id, updatedIdea);
    return updatedIdea;
  };

  // Get stats for dashboard
  const getStats = () => {
    const totalIdeas = ideas.length;
    const statusCounts = {};
    statusOptions.forEach(status => {
      statusCounts[status] = ideas.filter(idea => idea.status === status).length;
    });
    
    const departmentCounts = {};
    departments.forEach(dept => {
      departmentCounts[dept] = ideas.filter(idea => idea.authorDept === dept || idea.department === dept).length;
    });
    
    // Calculate average scores
    let avgInnovation = 0;
    let avgImpact = 0;
    let avgAlignment = 0;
    let avgFeasibility = 0;
    let scoredIdeas = ideas.filter(idea => idea.innovationScore && idea.impactScore);
    
    if (scoredIdeas.length > 0) {
      avgInnovation = scoredIdeas.reduce((sum, idea) => sum + idea.innovationScore, 0) / scoredIdeas.length;
      avgImpact = scoredIdeas.reduce((sum, idea) => sum + idea.impactScore, 0) / scoredIdeas.length;
      avgAlignment = scoredIdeas.reduce((sum, idea) => sum + idea.alignmentScore, 0) / scoredIdeas.length;
      avgFeasibility = scoredIdeas.reduce((sum, idea) => sum + idea.feasabilityScore, 0) / scoredIdeas.length;
    }
    
    return {
      totalIdeas,
      statusCounts,
      departmentCounts,
      avgScores: {
        innovation: Math.round(avgInnovation),
        impact: Math.round(avgImpact),
        alignment: Math.round(avgAlignment),
        feasibility: Math.round(avgFeasibility),
        overall: Math.round((avgInnovation + avgImpact + avgAlignment + avgFeasibility) / 4)
      }
    };
  };

  // Error handling function
  const clearError = () => {
    setError(null);
  };

  return (
    <AppContext.Provider
      value={{
        ideas,
        loading,
        error,
        departments,
        teams,
        statusOptions,
        addIdea,
        updateIdea,
        evaluateIdea,
        createJiraTickets,
        getStats,
        clearError
      }}
    >
      {children}
    </AppContext.Provider>
  );
};