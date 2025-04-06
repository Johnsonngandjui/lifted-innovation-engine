// Mock data for the LIFTED Innovation Engine

export const mockIdeas = [
    {
      id: 1,
      title: "AI-Powered Customer Service Chatbot",
      description: "Implement an AI chatbot that can handle common customer inquiries, reducing the load on our support team.",
      submittedBy: "Alex Johnson",
      department: "Customer Support",
      dateSubmitted: "2025-03-10",
      status: "In Progress",
      aiScore: {
        feasibility: 85,
        impact: 90,
        alignment: 75,
        overall: 83
      },
      tags: ["AI", "Customer Service", "Automation"],
      assignedTeam: "AI Development",
      progress: 65,
      comments: [
        { user: "Sarah Kim", comment: "This could significantly reduce our response time.", date: "2025-03-12" },
        { user: "Michael Chen", comment: "We already have the necessary data to train this model.", date: "2025-03-15" }
      ],
      jiraTickets: [
        { id: "LIFT-123", title: "Set up chatbot framework", status: "Completed", assignee: "Dev Team" },
        { id: "LIFT-124", title: "Train initial AI model", status: "In Progress", assignee: "AI Team" },
        { id: "LIFT-125", title: "Integrate with customer portal", status: "Not Started", assignee: "Frontend Team" }
      ],
      estimatedCost: {
        development: 20000,
        implementation: 5000,
        maintenance: 10000,
        total: 35000
      }
    },
    {
      id: 2,
      title: "Smart Resource Allocation System",
      description: "Create an algorithm that optimizes resource allocation across projects based on priority, deadlines, and team availability.",
      submittedBy: "Taylor Rodriguez",
      department: "Project Management",
      dateSubmitted: "2025-03-15",
      status: "Evaluation",
      aiScore: {
        feasibility: 70,
        impact: 95,
        alignment: 85,
        overall: 83
      },
      tags: ["Resource Management", "Optimization", "Project Planning"],
      assignedTeam: "Data Science",
      progress: 25,
      comments: [
        { user: "Jamie Lee", comment: "This could transform how we plan our quarterly roadmaps.", date: "2025-03-17" }
      ],
      jiraTickets: [
        { id: "LIFT-235", title: "Define resource optimization parameters", status: "In Progress", assignee: "PM Team" },
        { id: "LIFT-236", title: "Create allocation algorithm", status: "Not Started", assignee: "Data Science Team" }
      ],
      estimatedCost: {
        development: 30000,
        implementation: 10000,
        maintenance: 15000,
        total: 55000
      }
    },
    {
      id: 3,
      title: "Predictive Maintenance for Network Infrastructure",
      description: "Implement machine learning to predict potential failures in our network infrastructure before they occur.",
      submittedBy: "Jordan Smith",
      department: "IT Infrastructure",
      dateSubmitted: "2025-03-18",
      status: "Approved",
      aiScore: {
        feasibility: 80,
        impact: 95,
        alignment: 90,
        overall: 88
      },
      tags: ["Machine Learning", "Network", "Maintenance"],
      assignedTeam: "DevOps",
      progress: 10,
      comments: [
        { user: "Pat Wilson", comment: "This could dramatically reduce our downtime incidents.", date: "2025-03-20" }
      ],
      jiraTickets: [
        { id: "LIFT-312", title: "Gather historical network data", status: "In Progress", assignee: "Data Team" }
      ],
      estimatedCost: {
        development: 45000,
        implementation: 15000,
        maintenance: 20000,
        total: 80000
      }
    }
  ];
  
  export const departments = [
    "Engineering",
    "Product",
    "Marketing",
    "Sales",
    "Customer Support",
    "IT Infrastructure",
    "Data Science",
    "Project Management",
    "Human Resources",
    "Finance",
    "Operations"
  ];
  
  export const teams = [
    "Frontend Development",
    "Backend Development",
    "DevOps",
    "UI/UX Design",
    "QA Testing",
    "Data Science",
    "AI Development",
    "Product Management",
    "Digital Marketing",
    "Customer Success"
  ];
  
  export const aiEvaluationQuestions = [
    "What specific problem does this idea solve?",
    "How does this idea align with our company goals?",
    "What resources would be required to implement this idea?",
    "What is the potential impact on our customers?",
    "Are there any potential risks or challenges?",
    "How would success be measured?",
    "What is the estimated timeline for implementation?",
    "Are there any dependencies or prerequisites?"
  ];
  
  export const aiEvaluationCriteria = [
    { name: "Feasibility", description: "How realistic is implementation given current resources and technology?" },
    { name: "Impact", description: "Potential positive effects on business metrics and customer experience" },
    { name: "Alignment", description: "How well does the idea align with company goals and priorities?" },
    { name: "Innovation", description: "Level of novelty and creativity in the proposed solution" },
    { name: "Scalability", description: "Ability to scale the solution as the company grows" }
  ];
  
  export const statusOptions = [
    "Submitted",
    "Under Review",
    "Evaluation",
    "Approved",
    "In Progress",
    "Testing",
    "Completed",
    "On Hold",
    "Rejected"
  ];