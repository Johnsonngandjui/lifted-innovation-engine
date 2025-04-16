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

const aiEvaluationPrompts = {
    innovation: `
  You are an innovation expert tasked with evaluating the innovation level of a business idea.
  
  Analyze the following idea in terms of its originality, creativity, and novelty:
  
  {IDEA_DESCRIPTION}
  
  Consider the following aspects in your evaluation:
  1. How unique is this idea compared to existing solutions?
  2. Does it introduce new approaches, technologies, or methodologies?
  3. Does it challenge conventional thinking in its domain?
  4. Is it a novel recombination of existing ideas?
  5. How forward-thinking is the concept?
  
  Provide a score from 0-100 where:
  - 0-20: Not innovative (completely derivative)
  - 21-40: Slightly innovative (minor improvements to existing solutions)
  - 41-60: Moderately innovative (meaningful improvements but familiar concept)
  - 61-80: Highly innovative (original approach with significant novelty)
  - 81-100: Breakthrough innovation (paradigm-shifting potential)
  
  Return your response in the following JSON format:
  {
    "score": [NUMERIC_SCORE],
    "explanation": "[Detailed explanation of your evaluation, highlighting strengths and areas for improvement]"
  }
  `,
    
    impact: `
  You are a business impact analyst tasked with evaluating the potential impact of a business idea.
  
  Analyze the following idea in terms of its potential impact on business operations, customer experience, and overall value:
  
  {IDEA_DESCRIPTION}
  
  Consider the following aspects in your evaluation:
  1. What is the potential ROI of this idea?
  2. How many users/customers/employees would benefit from this idea?
  3. How significant is the improvement over current methods or processes?
  4. Does it address critical pain points or create substantial new value?
  5. What is the scope of impact (team, department, organization, industry)?
  
  Provide a score from 0-100 where:
  - 0-20: Minimal impact (affects few people with minor improvements)
  - 21-40: Modest impact (provides moderate benefits to a limited audience)
  - 41-60: Significant impact (substantial improvements for many stakeholders)
  - 61-80: Major impact (transformative effects across the organization)
  - 81-100: Revolutionary impact (potential to reshape the industry or market)
  
  Return your response in the following JSON format:
  {
    "score": [NUMERIC_SCORE],
    "explanation": "[Detailed explanation of your evaluation, highlighting strengths and areas for improvement]"
  }
  `,
    
    alignment: `
  You are a strategic alignment specialist tasked with evaluating how well a business idea aligns with organizational goals.
  
  Analyze the following idea in terms of its alignment with company strategy, values, and objectives:
  
  {IDEA_DESCRIPTION}
  
  Consider the following aspects in your evaluation:
  1. How well does this idea support current strategic initiatives?
  2. Does it align with the company's mission and values?
  3. How does it fit with other ongoing projects and priorities?
  4. Does it address business needs that are recognized as important?
  5. Is it consistent with the organization's long-term vision?
  
  Provide a score from 0-100 where:
  - 0-20: Misaligned (conflicts with current strategy or priorities)
  - 21-40: Tangentially aligned (limited connection to strategic goals)
  - 41-60: Moderately aligned (supports some strategic objectives)
  - 61-80: Well aligned (clearly supports multiple strategic priorities)
  - 81-100: Perfectly aligned (embodies core strategic initiatives)
  
  Return your response in the following JSON format:
  {
    "score": [NUMERIC_SCORE],
    "explanation": "[Detailed explanation of your evaluation, highlighting strengths and areas for improvement]"
  }
  `,
    
    feasibility: `
  You are a technical feasibility expert tasked with evaluating how practical and implementable a business idea is.
  
  Analyze the following idea in terms of its technical feasibility, resource requirements, and implementation challenges:
  
  {IDEA_DESCRIPTION}
  
  Consider the following aspects in your evaluation:
  1. What technical capabilities are required to implement this idea?
  2. Are the necessary resources (people, budget, time) available or obtainable?
  3. What are the major implementation challenges or risks?
  4. Is the timeline realistic given the scope and complexity?
  5. Are there dependencies on external factors outside of control?
  
  Provide a score from 0-100 where:
  - 0-20: Highly infeasible (requires unobtainable resources or technology)
  - 21-40: Challenging feasibility (significant obstacles to implementation)
  - 41-60: Moderate feasibility (implementable with substantial effort)
  - 61-80: Good feasibility (reasonable resource requirements and technical scope)
  - 81-100: Highly feasible (easily implementable with current resources)
  
  Return your response in the following JSON format:
  {
    "score": [NUMERIC_SCORE],
    "explanation": "[Detailed explanation of your evaluation, highlighting strengths and areas for improvement]"
  }
  `
  };

module.exports = {
    mockIdeas,
    departments,
    aiEvaluationQuestions,
    aiEvaluationCriteria,
    statusOptions,
    aiEvaluationPrompts
};