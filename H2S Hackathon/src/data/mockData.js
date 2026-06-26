// Mock Data for SkillMatch recruitment dashboard

export const mockJobDescriptions = [
    {
        id: "jd-1",
        title: "Senior Full Stack AI Engineer",
        department: "AI & Innovation",
        location: "San Francisco, CA (Hybrid)",
        type: "Full-Time",
        salary: "$160,000 - $210,000",
        skills: ["React", "Node.js", "Python", "TypeScript", "Machine Learning", "AWS", "SQL", "System Design", "Docker"],
        description: "We are seeking a Senior Full Stack AI Engineer to design and build our next-generation AI recruiting workflows. The ideal candidate has strong foundations in JavaScript/TypeScript, python analytics, and cloud scalability. You will implement responsive React client applications, integrate with OpenAI APIs, build Node.js microservices, and deploy pipelines using Docker and AWS."
    },
    {
        id: "jd-2",
        title: "Lead Data Scientist / ML Engineer",
        department: "Core AI & ML",
        location: "New York, NY (Hybrid)",
        type: "Full-Time",
        salary: "$180,000 - $230,000",
        skills: ["Python", "Machine Learning", "PyTorch", "Deep Learning", "SQL", "Docker", "AWS", "System Design"],
        description: "Seeking a Lead Data Scientist to build and scale fine-tuned Transformer models, RAG document-retrieval architectures, and deep neural nets. Candidate should be highly proficient in Python, PyTorch, SQL database design, and cloud containerization via Docker and AWS systems."
    },
    {
        id: "jd-3",
        title: "Senior Search & Retrieval Specialist",
        department: "Information Retrieval",
        location: "Seattle, WA (Remote)",
        type: "Full-Time",
        salary: "$150,000 - $190,000",
        skills: ["Elasticsearch", "SQL", "System Design", "Python", "Docker", "AWS", "Machine Learning"],
        description: "We are looking for a Senior Search Specialist to optimize our query pipeline, develop vector database embeddings, and design semantic search engines. Experience in Elasticsearch, Pinecone/Milvus, Python, SQL caching, and Docker deployments is essential."
    }
];

export const mockCandidates = [
    {
        id: "cand-1",
        name: "Alex Rivera",
        title: "Senior Full-Stack Engineer",
        score: 96,
        matchLevel: "Best Match",
        badge: "🥇 Best Match",
        experience: 8,
        education: "M.S. in Computer Science - Stanford University",
        email: "alex.rivera@techmail.io",
        phone: "+1 (555) 019-2834",
        location: "San Jose, CA",
        summary: "Alex is an exceptional full-stack developer with 8 years of experience, specialized in building scalable TypeScript microservices and reactive interfaces. He has actively deployed multiple machine learning tools on AWS, aligning perfectly with the core tech stack requirements.",
        recommendation: "Highly recommended for immediate technical interview. Score is backed by outstanding system design experience, strong cloud deployment portfolio, and complete stack matching.",
        matchedSkills: ["React", "TypeScript", "Node.js", "Python", "AWS", "SQL", "System Design", "Docker"],
        missingSkills: ["Machine Learning"],
        explainableAI: {
            scoreBreakdown: [
                { category: "Core Technologies Match", weight: 35, score: 33, detail: "Matches 8 out of 9 target core technologies. React, Node.js, and Python alignments are strong." },
                { category: "Professional Experience", weight: 25, score: 25, detail: "8 years of experience exceeds the 5-year seniority baseline for the role." },
                { category: "System Architecture & Scaling", weight: 20, score: 20, detail: "Proven experience with AWS, SQL database optimization, and containerization via Docker." },
                { category: "Education Alignment", weight: 10, score: 10, detail: "M.S. in CS from Stanford provides a top academic match." },
                { category: "AI & Machine Learning Fit", weight: 10, score: 8, detail: "Strong general integration with OpenAI APIs, though lacks raw ML modeling experience." }
            ],
            reasoningSummary: "Alex scored 96% primarily due to an exact overlap of the technology stack (React, Node, Python, AWS, Docker) combined with rich system architecture experience. He has a slight deduction of 4% because his machine learning experience focuses on REST APIs rather than native TensorFlow training models."
        },
        heatmapMetrics: {
            technical: 98,
            softSkills: 90,
            cultureFit: 95,
            experience: 96,
            leadership: 92
        },
        behavioralSignals: {
            assessmentScore: 88,
            githubCommits: 310,
            responsiveness: 95,
            searchIntent: "Active",
            averageTenure: 2.7,
            growthVelocity: 90
        },
        timeline: [
            {
                role: "Lead Full-Stack Engineer",
                company: "Synapse AI",
                period: "2023 - Present",
                desc: "Led the development of a real-time analytics web dashboard using React, Node.js, and AWS. Integrated predictive ML models into user workflows."
            },
            {
                role: "Senior Software Engineer",
                company: "CloudScale Inc.",
                period: "2020 - 2023",
                desc: "Designed and implemented scalable backend microservices in Node.js and TypeScript. Optimized SQL databases reducing queries latencies by 30%."
            },
            {
                role: "Software Engineer",
                company: "ByteTech",
                period: "2018 - 2020",
                desc: "Built user-facing single-page applications with React and Redux. Participated in migration of services to Docker containers."
            }
        ]
    },
    {
        id: "cand-2",
        name: "Sofia Chen",
        title: "AI Engineer & Full-Stack Developer",
        score: 89,
        matchLevel: "Strong Match",
        badge: "🥈 Strong Match",
        experience: 6,
        education: "B.S. in Software Engineering - UC Berkeley",
        email: "sofia.chen@innovate.dev",
        phone: "+1 (555) 024-8192",
        location: "Oakland, CA",
        summary: "Sofia has a heavy background in AI agent development and Python, coupled with modern React frontend chops. She has built several LLM integrations and knows Docker inside-out.",
        recommendation: "Recommend advancing to initial screening round. Her deep AI background is highly valuable, and she has sufficient full-stack capabilities.",
        matchedSkills: ["React", "Python", "Machine Learning", "SQL", "Docker", "TypeScript"],
        missingSkills: ["Node.js", "AWS", "System Design"],
        explainableAI: {
            scoreBreakdown: [
                { category: "Core Technologies Match", weight: 35, score: 28, detail: "Matches 6 out of 9 target skills. Missing Node.js backend experience." },
                { category: "Professional Experience", weight: 25, score: 25, detail: "6 years of software engineer experience fits the target range." },
                { category: "System Architecture & Scaling", weight: 20, score: 16, detail: "Strong with Docker, but has limited experience designing high-scale AWS infrastructure." },
                { category: "Education Alignment", weight: 10, score: 10, detail: "UC Berkeley degree is highly valued." },
                { category: "AI & Machine Learning Fit", weight: 10, score: 10, detail: "Perfect match with custom ML agent training and vector database integrations." }
            ],
            reasoningSummary: "Sofia Chen scored 89% because of her exceptional Python and ML capabilities, which align perfectly with the AI aspects of the role. Her score is slightly constrained by the lack of direct Node.js backend microservices deployment and large-scale AWS orchestration."
        },
        heatmapMetrics: {
            technical: 92,
            softSkills: 88,
            cultureFit: 90,
            experience: 85,
            leadership: 80
        },
        behavioralSignals: {
            assessmentScore: 94,
            githubCommits: 450,
            responsiveness: 88,
            searchIntent: "Active",
            averageTenure: 2.0,
            growthVelocity: 85
        },
        timeline: [
            {
                role: "Machine Learning Engineer",
                company: "CognitiveFlow",
                period: "2024 - Present",
                desc: "Created RAG pipelines using Python, LangChain, and Pinecone. Developed custom React interfaces for AI chat agents."
            },
            {
                role: "Full-Stack Software Engineer",
                company: "WebCrafters",
                period: "2021 - 2024",
                desc: "Built web applications using Python (FastAPI) backend and React frontend. Dockerized all environments for CI/CD."
            },
            {
                role: "Frontend Engineer",
                company: "Stellar Solutions",
                period: "2020 - 2021",
                desc: "Focused on building complex interactive data visualizations in React and D3.js."
            }
        ]
    },
    {
        id: "cand-3",
        name: "Marcus Vance",
        title: "Backend Engineer (Python & Node)",
        score: 78,
        matchLevel: "Strong Match",
        badge: "🥈 Strong Match",
        experience: 7,
        education: "B.S. in Computer Science - University of Washington",
        email: "marcus.v@codeguild.net",
        phone: "+1 (555) 032-9481",
        location: "Seattle, WA",
        summary: "Marcus is a robust backend systems developer. He has exceptional Node.js, Python, and SQL skills and understands cloud engineering, but has limited experience in React.",
        recommendation: "Recommend technical review. Excellent backend capabilities but would need frontend training or support to handle the React components of the role.",
        matchedSkills: ["Node.js", "Python", "AWS", "SQL", "System Design", "Docker"],
        missingSkills: ["React", "TypeScript", "Machine Learning"],
        explainableAI: {
            scoreBreakdown: [
                { category: "Core Technologies Match", weight: 35, score: 23, detail: "Strong backend match (Node/Python/SQL) but missing React and TypeScript experience." },
                { category: "Professional Experience", weight: 25, score: 25, detail: "7 years of professional experience is excellent." },
                { category: "System Architecture & Scaling", weight: 20, score: 18, detail: "Strong AWS configuration skills and database indexing." },
                { category: "Education Alignment", weight: 10, score: 9, detail: "Solid B.S. CS degree." },
                { category: "AI & Machine Learning Fit", weight: 10, score: 3, detail: "Minimal exposure to machine learning workflows." }
            ],
            reasoningSummary: "Marcus Vance scored 78% due to a very strong backend developer record (SQL, AWS, Node, Python, Docker). The score is limited because he does not have active React/TypeScript frontend portfolio experience, and has not built AI models or machine learning endpoints."
        },
        heatmapMetrics: {
            technical: 80,
            softSkills: 85,
            cultureFit: 78,
            experience: 88,
            leadership: 72
        },
        behavioralSignals: {
            assessmentScore: 85,
            githubCommits: 180,
            responsiveness: 75,
            searchIntent: "Semi-Active",
            averageTenure: 3.5,
            growthVelocity: 75
        },
        timeline: [
            {
                role: "Senior Backend Developer",
                company: "DataShield",
                period: "2023 - Present",
                desc: "Optimized Node.js REST APIs and oversaw migration to AWS Lambda. Architected data storage pipelines using SQL."
            },
            {
                role: "Backend Engineer",
                company: "SaaSify",
                period: "2019 - 2023",
                desc: "Built scalable web backends with Node.js and Python. Implemented automated Docker containers deployment schedules."
            }
        ]
    },
    {
        id: "cand-4",
        name: "Elena Rostova",
        title: "Frontend Engineer (React / TS)",
        score: 72,
        matchLevel: "Potential Match",
        badge: "🥉 Potential Match",
        experience: 5,
        education: "B.A. in Interactive Design - NYU",
        email: "elena.ros@designcode.org",
        phone: "+1 (555) 041-3920",
        location: "New York, NY",
        summary: "Elena is a senior-level frontend designer who builds gorgeous, pixel-perfect React pages and components. Her backend skills in Python and cloud deploy are minimal.",
        recommendation: "Keep in pool for frontend-specific openings. Her visual execution is unmatched, but her skills gap in backend, AI, and systems limits full-stack fit.",
        matchedSkills: ["React", "TypeScript", "SQL"],
        missingSkills: ["Node.js", "Python", "Machine Learning", "AWS", "System Design", "Docker"],
        explainableAI: {
            scoreBreakdown: [
                { category: "Core Technologies Match", weight: 35, score: 15, detail: "Strong React/TypeScript match but misses key backend technologies like Node and Python." },
                { category: "Professional Experience", weight: 25, score: 22, detail: "5 years of experience matches the baseline requirement." },
                { category: "System Architecture & Scaling", weight: 20, score: 10, detail: "Familiar with hosting static sites, but lacks complex database design or containerization experience." },
                { category: "Education Alignment", weight: 10, score: 8, detail: "Creative design background is useful for UI but less aligned mathematically." },
                { category: "AI & Machine Learning Fit", weight: 10, score: 17, detail: "Lacks core ML background, although she has consumed mock AI endpoints in frontend apps." }
            ],
            reasoningSummary: "Elena Rostova scored 72% because she has stellar React and UI development capabilities. However, because this is a Full Stack AI Engineer role, she faces large gaps in Python scripting, backend Node.js microservices, Docker containment, and AWS architecture."
        },
        heatmapMetrics: {
            technical: 65,
            softSkills: 95,
            cultureFit: 88,
            experience: 70,
            leadership: 75
        },
        behavioralSignals: {
            assessmentScore: 78,
            githubCommits: 220,
            responsiveness: 90,
            searchIntent: "Active",
            averageTenure: 2.5,
            growthVelocity: 80
        },
        timeline: [
            {
                role: "Senior UI Engineer",
                company: "PixelPerfect Labs",
                period: "2023 - Present",
                desc: "Created highly polished responsive React design systems. Coordinated styling guidelines across 4 engineering pods."
            },
            {
                role: "Frontend Developer",
                company: "Vivid Interactive",
                period: "2021 - 2023",
                desc: "Developed single page React applications. Leveraged TypeScript for interface validation and state management."
            }
        ]
    },
    {
        id: "cand-5",
        name: "Devon Cross",
        title: "Software Engineer",
        score: 61,
        matchLevel: "Potential Match",
        badge: "🥉 Potential Match",
        experience: 4,
        education: "B.S. in Computer Science - University of Utah",
        email: "devon.cross@devs.net",
        phone: "+1 (555) 078-4931",
        location: "Salt Lake City, UT",
        summary: "Devon has a generalist developer profile with four years of experiences. He knows Python and SQL, but has very basic understanding of React and cloud deployments.",
        recommendation: "Not recommended for this senior role, but could be considered for a junior backend engineer role.",
        matchedSkills: ["Python", "SQL", "Docker"],
        missingSkills: ["React", "Node.js", "TypeScript", "Machine Learning", "AWS", "System Design"],
        explainableAI: {
            scoreBreakdown: [
                { category: "Core Technologies Match", weight: 35, score: 12, detail: "Only matches 3 skills (Python, SQL, Docker)." },
                { category: "Professional Experience", weight: 25, score: 18, detail: "4 years is slightly below the preferred senior duration." },
                { category: "System Architecture & Scaling", weight: 20, score: 12, detail: "Basic SQL queries and Docker compose experience, but no large enterprise design." },
                { category: "Education Alignment", weight: 10, score: 9, detail: "B.S. Computer Science degree." },
                { category: "AI & Machine Learning Fit", weight: 10, score: 10, detail: "Took coursework in AI but no hands-on commercial experience." }
            ],
            reasoningSummary: "Devon Cross scored 61% because he lacks the senior-level systems design and cloud expertise required, and has not actively built React backend apps using Node.js or TypeScript."
        },
        heatmapMetrics: {
            technical: 58,
            softSkills: 80,
            cultureFit: 82,
            experience: 60,
            leadership: 55
        },
        behavioralSignals: {
            assessmentScore: 65,
            githubCommits: 90,
            responsiveness: 85,
            searchIntent: "Passive",
            averageTenure: 4.0,
            growthVelocity: 60
        },
        timeline: [
            {
                role: "Software Developer",
                company: "LogiCore",
                period: "2022 - Present",
                desc: "Maintained Python scripts for ETL pipelines and automated testing dashboards."
            }
        ]
    }
];

export const mockDashboardStats = {
    totalCandidates: 142,
    topMatches: 12,
    averageMatchScore: 82.5,
    uploadedResumes: 184
};

export const mockWeeklyUploads = [
    { label: "Mon", count: 8 },
    { label: "Tue", count: 15 },
    { label: "Wed", count: 24 },
    { label: "Thu", count: 18 },
    { label: "Fri", count: 32 },
    { label: "Sat", count: 5 },
    { label: "Sun", count: 10 }
];

export const mockRequiredSkillsGap = {
    labels: ["React", "Node.js", "Python", "TypeScript", "Machine Learning", "AWS", "SQL", "System Design", "Docker"],
    candidateCoverage: [72, 60, 85, 55, 40, 48, 90, 50, 75], // Percentage of candidates who have the skill
};
