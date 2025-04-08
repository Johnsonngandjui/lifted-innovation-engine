import React, { createContext, useState, useEffect } from 'react';
import { mockIdeas, departments, teams, statusOptions } from '../data/mockData';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate loading data from an API
  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIdeas(mockIdeas);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Add a new idea
  const addIdea = (idea) => {
    const newIdea = {
      ...idea,
      id: ideas.length + 1,
      dateSubmitted: new Date().toISOString().slice(0, 10),
      status: idea.status || 'Created',
      progress: 0,
      comments: [],
      jiraTickets: [],
      aiScore: {
        feasibility: 0,
        impact: 0,
        alignment: 0,
        overall: 0
      },
      estimatedCost: {
        development: 0,
        implementation: 0,
        maintenance: 0,
        total: 0
      }
    };
    setIdeas([...ideas, newIdea]);
    return newIdea;
  };

  // Update an idea
  const updateIdea = (id, updatedData) => {
    setIdeas(ideas.map(idea => 
      idea.id === id ? { ...idea, ...updatedData } : idea
    ));
  };

  // Evaluate an idea using "AI"
  const evaluateIdea = (id) => {
    const idea = ideas.find(idea => idea.id === id);
    if (!idea) return null;

    // Simulate AI evaluation
    const generateRandomScore = () => Math.floor(Math.random() * 30) + 70; // Random score between 70-99
    
    const aiScore = {
      feasibility: generateRandomScore(),
      impact: generateRandomScore(),
      alignment: generateRandomScore(),
      overall: 0
    };
    
    // Calculate overall score as average
    aiScore.overall = Math.round((aiScore.feasibility + aiScore.impact + aiScore.alignment) / 3);
    
    // Assign team based on idea content and tags
    const potentialTeams = [...teams];
    const assignedTeam = potentialTeams[Math.floor(Math.random() * potentialTeams.length)];
    
    // Generate estimated costs
    const estimatedCost = {
      development: Math.round((Math.random() * 40000 + 10000) / 1000) * 1000, // $10k-$50k
      implementation: Math.round((Math.random() * 15000 + 5000) / 1000) * 1000, // $5k-$20k
      maintenance: Math.round((Math.random() * 20000 + 5000) / 1000) * 1000, // $5k-$25k
      total: 0
    };
    estimatedCost.total = estimatedCost.development + estimatedCost.implementation + estimatedCost.maintenance;
    
    const updatedIdea = {
      ...idea,
      aiScore,
      status: 'Evaluation',
      assignedTeam,
      estimatedCost
    };
    
    updateIdea(id, updatedIdea);
    return updatedIdea;
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
        title: ticketType + " for " + idea.title,
        status: "Not Started",
        assignee: idea.assignedTeam
      });
    }
    
    const updatedIdea = {
      ...idea,
      jiraTickets,
      status: 'Approved',
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
      departmentCounts[dept] = ideas.filter(idea => idea.department === dept).length;
    });
    
    // Calculate average scores
    let avgFeasibility = 0;
    let avgImpact = 0;
    let avgAlignment = 0;
    let scoredIdeas = ideas.filter(idea => idea.aiScore && idea.aiScore.overall > 0);
    
    if (scoredIdeas.length > 0) {
      avgFeasibility = scoredIdeas.reduce((sum, idea) => sum + idea.aiScore.feasibility, 0) / scoredIdeas.length;
      avgImpact = scoredIdeas.reduce((sum, idea) => sum + idea.aiScore.impact, 0) / scoredIdeas.length;
      avgAlignment = scoredIdeas.reduce((sum, idea) => sum + idea.aiScore.alignment, 0) / scoredIdeas.length;
    }
    
    return {
      totalIdeas,
      statusCounts,
      departmentCounts,
      avgScores: {
        feasibility: Math.round(avgFeasibility),
        impact: Math.round(avgImpact),
        alignment: Math.round(avgAlignment),
        overall: Math.round((avgFeasibility + avgImpact + avgAlignment) / 3)
      }
    };
  };

  return (
    <AppContext.Provider
      value={{
        ideas,
        loading,
        departments,
        teams,
        statusOptions,
        addIdea,
        updateIdea,
        evaluateIdea,
        createJiraTickets,
        getStats
      }}
    >
      {children}
    </AppContext.Provider>
  );
};