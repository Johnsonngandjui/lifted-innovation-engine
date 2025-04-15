// Mock data for the idea management system
  
const mockIdeas = [
    {
        ideaName: "AI-Powered Customer Service Chatbot",
        authorId: "n7654333",
        authorName: "Alex Johnson",
        public: true,
        createdAt: new Date("2025-03-10"),
        lastUpdated: new Date("2025-03-20"),
        authorDept: "Customer Support",
        editors: [],
        description: "Implement an AI chatbot that can handle common customer inquiries, reducing the load on our support team.",
        status: "approved",
        problemStatement: "Our customer support team is overwhelmed with repetitive inquiries that could be handled automatically.",
        audience: "Customer Support teams and end customers",
        expectedImpact: "Reduce support ticket volume by 30% and improve first response time by 50%",
        resources: "AI development team, training data from existing support tickets, integration with current support platform",
        innovationExplanation: "This solution leverages state-of-the-art natural language processing to understand and respond to customer queries with high accuracy.",
        impactExplanation: "By automating responses to common inquiries, we can significantly reduce wait times and allow support staff to focus on complex issues.",
        alignmentExplanation: "This aligns with our company goal of improving customer satisfaction while optimizing operational efficiency.",
        feasabilityExplanation: "We already have the necessary data and technology infrastructure to implement this solution within 3 months.",
        innovationScore: 83,
        impactScore: 90,
        alignmentScore: 75,
        feasabilityScore: 85,
        evaluationContext: "Evaluated based on existing customer support metrics and industry benchmarks for chatbot implementation.",
        approvers: [{id: "n1234567", name: "John Smith"}],
        jiraAssignedTeam: "AI Development",
        jiraTickets: [
            { id: "LIFT-123", title: "Set up chatbot framework", status: "Completed", assignee: "Dev Team" },
            { id: "LIFT-124", title: "Train initial AI model", status: "In Progress", assignee: "AI Team" },
            { id: "LIFT-125", title: "Integrate with customer portal", status: "Not Started", assignee: "Frontend Team" }
        ],
        likes: 2,
        comments: [
            {
                id: "1",
                authorId: "n7654321",
                authorName: "Sarah Kim",
                timestamp: new Date("2025-03-12"),
                content: "This could significantly reduce our response time."
            },
            {
                id: "2",
                authorId: "n7654323",
                authorName: "Michael Chen",
                timestamp: new Date("2025-03-15"),
                content: "We already have the necessary data to train this model."
            }
        ],
        parentIdeaId: "",
        childIdeaIds: [],
        tags: ["AI", "Customer Service", "Automation"]
    },
    {
        ideaName: "Smart Resource Allocation System",
        authorId: "n7654444",
        authorName: "Antonio Monteiro",
        public: true,
        createdAt: new Date("2025-03-15"),
        lastUpdated: new Date("2025-03-18"),
        authorDept: "Project Management",
        editors: [],
        description: "Create an algorithm that optimizes resource allocation across projects based on priority, deadlines, and team availability.",
        status: "alignment",
        problemStatement: "Resource planning is currently manual and inefficient, leading to suboptimal allocation and project delays.",
        audience: "Project managers and team leads across departments",
        expectedImpact: "Improve project delivery times by 20% and increase resource utilization by 15%",
        resources: "Data science team, historical project data, integration with current project management tools",
        innovationExplanation: "The solution uses machine learning to predict optimal resource distribution based on historical performance data.",
        impactExplanation: "Optimized resource allocation will reduce bottlenecks, minimize downtime, and enable more accurate project planning.",
        alignmentExplanation: "",
        feasabilityExplanation: "",
        innovationScore: 83,
        impactScore: 95,
        alignmentScore: 0,
        feasabilityScore: 0,
        evaluationContext: "Currently under evaluation by department heads to assess alignment with company strategy.",
        approvers: [],
        jiraAssignedTeam: "",
        jiraTickets: [],
        likes: 1,
        comments: [
            {
                id: "1",
                authorId: "n3456712",
                authorName: "Jamie Lee",
                timestamp: new Date("2025-03-17"),
                content: "This could transform how we plan our quarterly roadmaps."
            }
        ],
        parentIdeaId: "",
        childIdeaIds: [],
        tags: ["Resource Management", "Optimization", "Project Planning"]
    },
    {
        ideaName: "Smart Time Allocation System for Context Switching",
        authorId: "n1527597",
        authorName: "Gavin Bloom",
        public: true,
        createdAt: new Date("2025-03-18"),
        lastUpdated: new Date("2025-03-21"),
        authorDept: "Project Management",
        editors: [],
        description: "Create an algorithm that optimizes allocation of developer time spent across projects based on priority, deadlines, and team availability with the goal of minimizing context switching.",
        status: "impact",
        problemStatement: "Developers are constantly switching between projects, which reduces productivity and increases mental fatigue.",
        audience: "Development teams and technical project managers",
        expectedImpact: "Reduce context switching by 40% and increase productive coding time by 25%",
        resources: "Access to developer calendars, project management data, and engineering metrics",
        innovationExplanation: "This approach introduces novel scheduling algorithms that prioritize deep work sessions and minimize transitions between unrelated tasks.",
        impactExplanation: "Currently under evaluation to determine quantifiable impact across teams.",
        alignmentExplanation: "",
        feasabilityExplanation: "",
        innovationScore: 55,
        impactScore: 25,
        alignmentScore: 0,
        feasabilityScore: 0,
        evaluationContext: "Being evaluated based on pilot testing with selected development teams.",
        approvers: [],
        jiraAssignedTeam: "",
        jiraTickets: [],
        likes: 1,
        comments: [
            {
                id: "1",
                authorId: "n7654444",
                authorName: "Antonio Monteiro",
                timestamp: new Date("2025-03-20"),
                content: "I like how you built off my idea! Could use some better metrics though."
            }
        ],
        parentIdeaId: "2",
        childIdeaIds: [],
        tags: ["Resource Management", "Optimization", "Project Planning", "Developer Productivity"]
    }
];
  
const departments = [
    "Executables",
    "IFAS",
    "DaBirs",
    "Lifted",
];
  
const aiEvaluationQuestions = [
    "What specific problem does this idea solve?",
    "How does this idea align with our company goals?",
    "What resources would be required to implement this idea?",
    "What is the potential impact on our customers?",
    "Are there any potential risks or challenges?",
    "How would success be measured?",
    "What is the estimated timeline for implementation?",
    "Are there any dependencies or prerequisites?"
];
  
const aiEvaluationCriteria = [
    { name: "Feasibility", description: "How realistic is implementation given current resources and technology?" },
    { name: "Impact", description: "Potential positive effects on business metrics and customer experience" },
    { name: "Alignment", description: "How well does the idea align with company goals and priorities?" },
    { name: "Innovation", description: "Level of novelty and creativity in the proposed solution" },
    { name: "Scalability", description: "Ability to scale the solution as the company grows" }
];
  
const statusOptions = [
    "Draft",      
    "Created",    
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

module.exports = {
    mockIdeas,
    departments,
    aiEvaluationQuestions,
    aiEvaluationCriteria,
    statusOptions
};