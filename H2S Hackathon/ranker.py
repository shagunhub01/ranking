import os
import json
import csv
import sys

# Define candidate database with rich attributes and behavioral/career signals
CANDIDATES = [
    {
        "id": "cand-1",
        "name": "Alex Rivera",
        "title": "Senior Full-Stack Engineer",
        "experience": 8,
        "education": "M.S. in Computer Science - Stanford University",
        "email": "alex.rivera@techmail.io",
        "phone": "+1 (555) 019-2834",
        "location": "San Jose, CA",
        "summary": "Alex is an exceptional full-stack developer with 8 years of experience, specialized in building scalable TypeScript microservices and reactive interfaces. He has actively deployed multiple machine learning tools on AWS, aligning perfectly with the core tech stack requirements.",
        "skills": ["React", "TypeScript", "Node.js", "Python", "AWS", "SQL", "System Design", "Docker"],
        "assessment_score": 88,
        "responsiveness": 95,
        "github_commits": 310,
        "growth_velocity": 90,
        "average_tenure": 2.7,
        "search_intent": "Active",
        "timeline": [
            {"role": "Lead Full-Stack Engineer", "company": "Synapse AI", "period": "2023 - Present", "desc": "Led the development of a real-time analytics web dashboard using React, Node.js, and AWS. Integrated predictive ML models into user workflows."},
            {"role": "Senior Software Engineer", "company": "CloudScale Inc.", "period": "2020 - 2023", "desc": "Designed and implemented scalable backend microservices in Node.js and TypeScript. Optimized SQL databases reducing queries latencies by 30%."},
            {"role": "Software Engineer", "company": "ByteTech", "period": "2018 - 2020", "desc": "Built user-facing single-page applications with React and Redux. Participated in migration of services to Docker containers."}
        ]
    },
    {
        "id": "cand-2",
        "name": "Sofia Chen",
        "title": "AI Engineer & Full-Stack Developer",
        "experience": 6,
        "education": "B.S. in Software Engineering - UC Berkeley",
        "email": "sofia.chen@innovate.dev",
        "phone": "+1 (555) 024-8192",
        "location": "Oakland, CA",
        "summary": "Sofia has a heavy background in AI agent development and Python, coupled with modern React frontend chops. She has built several LLM integrations and knows Docker inside-out.",
        "skills": ["React", "Python", "Machine Learning", "SQL", "Docker", "TypeScript", "PyTorch", "RAG", "Transformers"],
        "assessment_score": 94,
        "responsiveness": 88,
        "github_commits": 450,
        "growth_velocity": 85,
        "average_tenure": 2.0,
        "search_intent": "Active",
        "timeline": [
            {"role": "Machine Learning Engineer", "company": "CognitiveFlow", "period": "2024 - Present", "desc": "Created RAG pipelines using Python, LangChain, and Pinecone. Developed custom React interfaces for AI chat agents."},
            {"role": "Full-Stack Software Engineer", "company": "WebCrafters", "period": "2021 - 2024", "desc": "Built web applications using Python (FastAPI) backend and React frontend. Dockerized all environments for CI/CD."},
            {"role": "Frontend Engineer", "company": "Stellar Solutions", "period": "2020 - 2021", "desc": "Focused on building complex interactive data visualizations in React and D3.js."}
        ]
    },
    {
        "id": "cand-3",
        "name": "Marcus Vance",
        "title": "Backend Engineer (Python & Node)",
        "experience": 7,
        "education": "B.S. in Computer Science - University of Washington",
        "email": "marcus.v@codeguild.net",
        "phone": "+1 (555) 032-9481",
        "location": "Seattle, WA",
        "summary": "Marcus is a robust backend systems developer. He has exceptional Node.js, Python, and SQL skills and understands cloud engineering, but has limited experience in React.",
        "skills": ["Node.js", "Python", "AWS", "SQL", "System Design", "Docker", "Express", "PostgreSQL"],
        "assessment_score": 85,
        "responsiveness": 75,
        "github_commits": 180,
        "growth_velocity": 75,
        "average_tenure": 3.5,
        "search_intent": "Semi-Active",
        "timeline": [
            {"role": "Senior Backend Developer", "company": "DataShield", "period": "2023 - Present", "desc": "Optimized Node.js REST APIs and oversaw migration to AWS Lambda. Architected data storage pipelines using SQL."},
            {"role": "Backend Engineer", "company": "SaaSify", "period": "2019 - 2023", "desc": "Built scalable web backends with Node.js and Python. Implemented automated Docker containers deployment schedules."}
        ]
    },
    {
        "id": "cand-4",
        "name": "Elena Rostova",
        "title": "Frontend Engineer (React / TS)",
        "experience": 5,
        "education": "B.A. in Interactive Design - NYU",
        "email": "elena.ros@designcode.org",
        "phone": "+1 (555) 041-3920",
        "location": "New York, NY",
        "summary": "Elena is a senior-level frontend designer who builds gorgeous, pixel-perfect React pages and components. Her backend skills in Python and cloud deploy are minimal.",
        "skills": ["React", "TypeScript", "SQL", "JavaScript", "HTML", "CSS"],
        "assessment_score": 78,
        "responsiveness": 90,
        "github_commits": 220,
        "growth_velocity": 80,
        "average_tenure": 2.5,
        "search_intent": "Active",
        "timeline": [
            {"role": "Senior UI Engineer", "company": "PixelPerfect Labs", "period": "2023 - Present", "desc": "Created highly polished responsive React design systems. Coordinated styling guidelines across 4 engineering pods."},
            {"role": "Frontend Developer", "company": "Vivid Interactive", "period": "2021 - 2023", "desc": "Developed single page React applications. Leveraged TypeScript for interface validation and state management."}
        ]
    },
    {
        "id": "cand-5",
        "name": "Devon Cross",
        "title": "Software Engineer",
        "experience": 4,
        "education": "B.S. in Computer Science - University of Utah",
        "email": "devon.cross@devs.net",
        "phone": "+1 (555) 078-4931",
        "location": "Salt Lake City, UT",
        "summary": "Devon has a generalist developer profile with four years of experience. He knows Python and SQL, but has very basic understanding of React and cloud deployments.",
        "skills": ["Python", "SQL", "Docker", "MySQL", "Django"],
        "assessment_score": 65,
        "responsiveness": 85,
        "github_commits": 90,
        "growth_velocity": 60,
        "average_tenure": 4.0,
        "search_intent": "Passive",
        "timeline": [
            {"role": "Software Developer", "company": "LogiCore", "period": "2022 - Present", "desc": "Maintained Python scripts for ETL pipelines and automated testing dashboards."}
        ]
    },
    {
        "id": "cand-6",
        "name": "Priya Sharma",
        "title": "Senior Data Scientist",
        "experience": 7,
        "education": "M.Tech in Data Science - IIT Delhi",
        "email": "priya.sharma@aimail.net",
        "phone": "+1 (555) 055-1928",
        "location": "Boston, MA",
        "summary": "Priya is a mathematical data scientist specialized in neural net models, PyTorch, and NLP. She has a strong Python coding background and has deployed RAG architectures.",
        "skills": ["Python", "Machine Learning", "SQL", "PyTorch", "Deep Learning", "Pandas", "NLP", "RAG"],
        "assessment_score": 93,
        "responsiveness": 92,
        "github_commits": 380,
        "growth_velocity": 88,
        "average_tenure": 2.3,
        "search_intent": "Active",
        "timeline": [
            {"role": "Lead Data Scientist", "company": "NeuralMetrics", "period": "2023 - Present", "desc": "Built and fine-tuned custom transformers for sequence extraction. Led a team of 3 data scientists."},
            {"role": "Data Scientist", "company": "RetailBots", "period": "2020 - 2023", "desc": "Built predictive customer recommendation pipelines in Python and SQL. Maintained ML models in production."}
        ]
    },
    {
        "id": "cand-7",
        "name": "Jordan Taylor",
        "title": "Search & Retrieval Architect",
        "experience": 9,
        "education": "M.S. in CS - Georgia Institute of Technology",
        "email": "jordan.t@searchscale.io",
        "phone": "+1 (555) 062-8371",
        "location": "Austin, TX",
        "summary": "Jordan is a veteran engineer focused on search relevance, vector index matching, and NLP semantic retrieval. Knows Elasticsearch inside-out, with strong system design.",
        "skills": ["System Design", "SQL", "Docker", "Python", "Elasticsearch", "Pinecone", "Vector Database", "Microservices"],
        "assessment_score": 91,
        "responsiveness": 80,
        "github_commits": 240,
        "growth_velocity": 82,
        "average_tenure": 3.0,
        "search_intent": "Semi-Active",
        "timeline": [
            {"role": "Principal Search Engineer", "company": "VectraSearch", "period": "2022 - Present", "desc": "Architected search systems using Elasticsearch and Pinecone. Reduced retrieval latency from 450ms to 40ms."},
            {"role": "Senior Infrastructure Developer", "company": "BigData Corp", "period": "2018 - 2022", "desc": "Designed scalable microservices using Python and Docker. Structured distributed database clusters."}
        ]
    },
    {
        "id": "cand-8",
        "name": "Emily Wong",
        "title": "Senior DevOps & Cloud Engineer",
        "experience": 8,
        "education": "B.ASc. - University of Waterloo",
        "email": "emily.wong@cloudops.ca",
        "phone": "+1 (555) 088-2938",
        "location": "Vancouver, BC",
        "summary": "Emily is a cloud scaling and DevOps specialist with deep AWS and Docker container mastery. Highly stable career trajectory, focusing on secure automation infrastructure.",
        "skills": ["AWS", "Docker", "Python", "System Design", "SQL", "Kubernetes", "Terraform", "CI/CD"],
        "assessment_score": 86,
        "responsiveness": 62,
        "github_commits": 150,
        "growth_velocity": 70,
        "average_tenure": 4.0,
        "search_intent": "Passive",
        "timeline": [
            {"role": "Lead Cloud Infrastructure", "company": "NordicTech", "period": "2022 - Present", "desc": "Designed AWS Multi-Region cluster deployment schemas. Migrated monolithic apps to Kubernetes clusters."},
            {"role": "DevOps Engineer", "company": "SecureStore", "period": "2018 - 2022", "desc": "Managed CI/CD deployment pipelines using Terraform and Docker. Optimized cloud costs by 35%."}
        ]
    },
    {
        "id": "cand-9",
        "name": "Carlos Mendez",
        "title": "MLOps Engineer",
        "experience": 5,
        "education": "B.S. in Computer Science - Tec de Monterrey",
        "email": "carlos.m@mlops.dev",
        "phone": "+1 (555) 091-8273",
        "location": "San Diego, CA",
        "summary": "Carlos bridges the gap between ML modeling and scalable deployments. Deploys custom TensorFlow models inside Docker, orchestrating on AWS platforms.",
        "skills": ["Python", "Machine Learning", "AWS", "Docker", "TensorFlow", "PyTorch", "Kubernetes", "SQL"],
        "assessment_score": 89,
        "responsiveness": 94,
        "github_commits": 410,
        "growth_velocity": 92,
        "average_tenure": 1.8,
        "search_intent": "Active",
        "timeline": [
            {"role": "ML Deployment Specialist", "company": "ModelScale", "period": "2024 - Present", "desc": "Dockerized and deployed custom ML modeling endpoints on AWS ECS. Built auto-scaling pipelines."},
            {"role": "Software Developer (Python)", "company": "CoreML", "period": "2021 - 2024", "desc": "Created ML training datasets. Optimized model training runs using PyTorch and GPU clusters."}
        ]
    },
    {
        "id": "cand-10",
        "name": "Aisha Diallo",
        "title": "Senior Backend Developer",
        "experience": 8,
        "education": "B.S. in Computer Engineering - McGill University",
        "email": "aisha.d@backendcorp.com",
        "phone": "+1 (555) 011-8271",
        "location": "Montreal, QC",
        "summary": "Aisha is an expert backend generalist. Possesses heavy Node.js, Python, and AWS capabilities. Highly adept at refactoring monoliths into resilient microservices.",
        "skills": ["Node.js", "Python", "SQL", "System Design", "AWS", "Go", "Java", "Microservices", "Docker"],
        "assessment_score": 91,
        "responsiveness": 82,
        "github_commits": 290,
        "growth_velocity": 80,
        "average_tenure": 2.8,
        "search_intent": "Semi-Active",
        "timeline": [
            {"role": "Senior Systems Architect", "company": "SaaSify Hub", "period": "2022 - Present", "desc": "Led transition to microservices architecture in Node and Go. Reduced DB query bottlenecks by 40%."},
            {"role": "Backend Engineer", "company": "AppDynamics", "period": "2018 - 2022", "desc": "Built Node.js and Java enterprise backend APIs. Implemented AWS RDS caching with Redis."}
        ]
    },
    {
        "id": "cand-11",
        "name": "Yuki Tanaka",
        "title": "Frontend Architect",
        "experience": 7,
        "education": "B.S. in CS - Waseda University",
        "email": "y.tanaka@frontdev.jp",
        "phone": "+1 (555) 014-9982",
        "location": "Seattle, WA",
        "summary": "Yuki is a frontend maestro who excels at React, TypeScript, and complex UI system architecture. Strong design sense combined with highly structured state management.",
        "skills": ["React", "TypeScript", "System Design", "JavaScript", "Vue.js", "Svelte", "Webpack", "CSS"],
        "assessment_score": 87,
        "responsiveness": 96,
        "github_commits": 330,
        "growth_velocity": 84,
        "average_tenure": 3.2,
        "search_intent": "Active",
        "timeline": [
            {"role": "Lead Frontend Architect", "company": "Portal Corp", "period": "2023 - Present", "desc": "Rebuilt central UI architecture in React & TypeScript. Maintained custom component design package."},
            {"role": "Senior UI Engineer", "company": "Nexus Labs", "period": "2019 - 2023", "desc": "Built highly interactive client portals using React, Svelte, and D3 analytics modules."}
        ]
    },
    {
        "id": "cand-12",
        "name": "Liam O'Connor",
        "title": "Cloud Systems Engineer",
        "experience": 6,
        "education": "B.S. in Computer Science - Trinity College Dublin",
        "email": "liam.oconnor@cloudnet.ie",
        "phone": "+1 (555) 044-8833",
        "location": "Boston, MA",
        "summary": "Liam focuses on AWS infrastructure design, containerization with Docker, and SQL optimization. Possesses basic Python scripting capability to support ops scripts.",
        "skills": ["AWS", "SQL", "Docker", "System Design", "Kubernetes", "Python", "Linux"],
        "assessment_score": 80,
        "responsiveness": 70,
        "github_commits": 120,
        "growth_velocity": 72,
        "average_tenure": 3.0,
        "search_intent": "Semi-Active",
        "timeline": [
            {"role": "Cloud DevOps Engineer", "company": "Fintech Solutions", "period": "2023 - Present", "desc": "Maintained multi-tenant AWS environments. Dockerized legacy applications for cloud deployment."},
            {"role": "Systems Administrator", "company": "IrishData", "period": "2020 - 2023", "desc": "Managed Linux database clusters and wrote automated backup scripts in Python and bash."}
        ]
    },
    {
        "id": "cand-13",
        "name": "Sarah Al-Farsi",
        "title": "LLM Practitioner & Research Engineer",
        "experience": 4,
        "education": "M.S. in Computer Science - KAUST",
        "email": "sarah.farsi@aimaven.org",
        "phone": "+1 (555) 077-1234",
        "location": "San Francisco, CA",
        "summary": "Sarah is a research-focused engineer specializing in LLM tuning, PyTorch model structures, and semantic search. Highly active open-source contributor with supreme AI focus.",
        "skills": ["Python", "Machine Learning", "PyTorch", "Transformers", "HuggingFace", "RAG", "NLP", "Deep Learning", "Docker"],
        "assessment_score": 97,
        "responsiveness": 98,
        "github_commits": 520,
        "growth_velocity": 95,
        "average_tenure": 2.0,
        "search_intent": "Active",
        "timeline": [
            {"role": "AI Research Engineer", "company": "Aura Labs", "period": "2024 - Present", "desc": "Implemented retrieval-augmented generation (RAG) endpoints. Fine-tuned llama and mistral architectures."},
            {"role": "NLP Software Engineer", "company": "TextMind", "period": "2022 - 2024", "desc": "Wrote text parsing engines in Python using Transformers and HuggingFace pipelines. Maintained Docker containers."}
        ]
    },
    {
        "id": "cand-14",
        "name": "David Kim",
        "title": "Junior Software Engineer",
        "experience": 2,
        "education": "B.S. in Computer Science - Rutgers University",
        "email": "david.kim@youngdev.io",
        "phone": "+1 (555) 088-5432",
        "location": "Newark, NJ",
        "summary": "David is a highly motivated junior engineer. Solid foundational coding in React, Python, and SQL. Fast learner with strong outreach responsiveness and active git commits.",
        "skills": ["React", "SQL", "Python", "JavaScript", "HTML", "CSS"],
        "assessment_score": 74,
        "responsiveness": 95,
        "github_commits": 145,
        "growth_velocity": 85,
        "average_tenure": 2.0,
        "search_intent": "Active",
        "timeline": [
            {"role": "Junior Developer", "company": "LocalBiz Solutions", "period": "2024 - Present", "desc": "Built client websites using React and customized CSS stylesheets. Automated reports using Python and SQL."}
        ]
    },
    {
        "id": "cand-15",
        "name": "Chloe Laurent",
        "title": "High-Performance Systems Engineer",
        "experience": 6,
        "education": "M.S. in CS - Sorbonne Université",
        "email": "chloe.laurent@systemic.fr",
        "phone": "+1 (555) 099-7711",
        "location": "New York, NY",
        "summary": "Chloe is a system-level coder who designs lightning-fast APIs. Deeply skilled in Go, C++, multi-threading, and Docker containment, with solid system design foundations.",
        "skills": ["System Design", "SQL", "Docker", "Python", "Go", "C++", "Microservices", "Linux"],
        "assessment_score": 96,
        "responsiveness": 85,
        "github_commits": 260,
        "growth_velocity": 78,
        "average_tenure": 3.0,
        "timeline": [
            {"role": "Senior Systems Engineer", "company": "FastAPI Tech", "period": "2023 - Present", "desc": "Implemented high-throughput network adapters in Go and C++. Dockerized services for AWS deployment."},
            {"role": "Systems Programmer", "company": "CoreSystems", "period": "2020 - 2023", "desc": "Built multi-threaded transaction pipelines in C++. Configured SQL DB read-replicas."}
        ],
        "average_tenure": 3.0,
        "search_intent": "Semi-Active"
    }
]

# Contextual Synonym Groups with weights mapping
# Key is the required target skill, value contains equivalent skills with their matching strength coefficient (0.0 to 1.0)
SYNONYM_GROUPS = {
    "React": {"Vue.js": 0.8, "Angular": 0.7, "Svelte": 0.85, "JavaScript": 0.6, "TypeScript": 0.7},
    "Node.js": {"Express": 0.9, "FastAPI": 0.7, "Django": 0.6, "Go": 0.7, "Java": 0.6, "Microservices": 0.7},
    "Python": {"FastAPI": 0.8, "Django": 0.8, "Flask": 0.8, "Pandas": 0.7, "NumPy": 0.7},
    "TypeScript": {"JavaScript": 0.9, "React": 0.6},
    "Machine Learning": {"Deep Learning": 0.95, "Neural Networks": 0.95, "TensorFlow": 0.9, "PyTorch": 0.9, "NLP": 0.8, "RAG": 0.85, "Transformers": 0.9, "HuggingFace": 0.8},
    "AWS": {"Azure": 0.8, "GCP": 0.8, "Kubernetes": 0.7, "Cloud": 0.8},
    "SQL": {"PostgreSQL": 0.9, "MySQL": 0.95, "MongoDB": 0.6, "Redis": 0.6, "Pinecone": 0.7, "Vector Database": 0.7, "Elasticsearch": 0.6},
    "System Design": {"Architecture": 0.9, "Microservices": 0.85, "Scalability": 0.85},
    "Docker": {"Kubernetes": 0.8, "Containerization": 0.95, "CI/CD": 0.75, "Terraform": 0.7}
}

# Add reciprocal synonyms dynamically to increase coverage
for req_skill, syns in list(SYNONYM_GROUPS.items()):
    for syn_skill, wt in syns.items():
        if syn_skill not in SYNONYM_GROUPS:
            SYNONYM_GROUPS[syn_skill] = {}
        if req_skill not in SYNONYM_GROUPS[syn_skill]:
            SYNONYM_GROUPS[syn_skill][req_skill] = wt

def get_skill_similarity(cand_skills, required_skill):
    """
    Returns (score, type) for matching a required skill against candidate's skills.
    type is one of: 'exact', 'semantic', 'none'
    """
    # Direct match (case-insensitive)
    for c_skill in cand_skills:
        if c_skill.lower() == required_skill.lower():
            return 1.0, "exact", required_skill

    # Synonym/Semantic mapping
    max_score = 0.0
    matched_via = None
    
    # Check if the required skill has synonyms in our mapping
    req_mapped = None
    for k in SYNONYM_GROUPS:
        if k.lower() == required_skill.lower():
            req_mapped = k
            break
            
    if req_mapped and req_mapped in SYNONYM_GROUPS:
        syns = SYNONYM_GROUPS[req_mapped]
        for c_skill in cand_skills:
            for syn, weight in syns.items():
                if c_skill.lower() == syn.lower():
                    if weight > max_score:
                        max_score = weight
                        matched_via = c_skill

    if max_score > 0.0:
        return max_score, "semantic", matched_via

    return 0.0, "none", None

def run_ranking(jd_skills, weights=None, target_experience=5, candidates_list=None):
    """
    Ranks candidates based on job description skills and custom weights.
    Weights format: { 'semantic': 0.40, 'assessment': 0.20, 'behavioral': 0.20, 'career': 0.20 }
    """
    if weights is None:
        weights = { 'semantic': 0.40, 'assessment': 0.20, 'behavioral': 0.20, 'career': 0.20 }

    # Normalize weights so they sum to 1.0
    total_w = sum(weights.values())
    if total_w > 0:
        norm_weights = { k: v / total_w for k, v in weights.items() }
    else:
        norm_weights = { 'semantic': 0.40, 'assessment': 0.20, 'behavioral': 0.20, 'career': 0.20 }

    ranked_results = []
    candidates_to_rank = candidates_list if candidates_list is not None else CANDIDATES

    for cand in candidates_to_rank:
        # 1. Semantic Match Score (S_semantic)
        match_details = []
        matched_skills_list = []
        missing_skills_list = []
        semantic_scores = []
        
        for req_skill in jd_skills:
            score, match_type, matched_via = get_skill_similarity(cand["skills"], req_skill)
            semantic_scores.append(score)
            
            if match_type == "exact":
                matched_skills_list.append(req_skill)
                match_details.append(f"Direct match: {req_skill}")
            elif match_type == "semantic":
                matched_skills_list.append(req_skill)
                match_details.append(f"Semantic equivalent: {req_skill} matched via {matched_via} ({int(score*100)}% match)")
            else:
                missing_skills_list.append(req_skill)
                match_details.append(f"Missing: {req_skill}")
                
        s_semantic = (sum(semantic_scores) / len(jd_skills) * 100) if jd_skills else 0.0

        # 2. Coding Assessment Score (S_assessment)
        s_assessment = cand["assessment_score"]

        # 3. Behavioral & Intent Score (S_behavioral)
        intent_map = { "Active": 100, "Semi-Active": 70, "Passive": 40 }
        intent_score = intent_map.get(cand["search_intent"], 50)
        github_score = min(100.0, (cand["github_commits"] / 400.0) * 100.0)
        s_behavioral = (intent_score + cand["responsiveness"] + github_score) / 3.0

        # 4. Experience & Career Score (S_career)
        exp_score = min(100.0, (cand["experience"] / target_experience) * 100.0) if target_experience > 0 else 100.0
        stability_score = min(100.0, (cand["average_tenure"] / 2.5) * 100.0)
        s_career = (exp_score + cand["growth_velocity"] + stability_score) / 3.0

        # Calculate final composite score
        final_score = (
            norm_weights['semantic'] * s_semantic +
            norm_weights['assessment'] * s_assessment +
            norm_weights['behavioral'] * s_behavioral +
            norm_weights['career'] * s_career
        )
        final_score = round(final_score, 1)

        # Match level details
        if final_score >= 88:
            match_level = "Best Match"
            badge = "🥇 Best Match"
        elif final_score >= 74:
            match_level = "Strong Match"
            badge = "🥈 Strong Match"
        elif final_score >= 60:
            match_level = "Potential Match"
            badge = "🥉 Potential Match"
        else:
            match_level = "Unmatched"
            badge = "• Match Gap"

        # Generate Explainable AI breakdown matching front-end expectations
        score_breakdown = [
            {
                "category": "Contextual Skill Alignment",
                "weight": int(norm_weights['semantic'] * 100),
                "score": int(s_semantic * norm_weights['semantic']),
                "detail": f"Matched {len(matched_skills_list)} out of {len(jd_skills)} required tech tags. Semantic scoring applied."
            },
            {
                "category": "Coding Assessment Fit",
                "weight": int(norm_weights['assessment'] * 100),
                "score": int(s_assessment * norm_weights['assessment']),
                "detail": f"Scored {cand['assessment_score']}% on coding challenges testing core logic."
            },
            {
                "category": "Behavioral & Intent Signals",
                "weight": int(norm_weights['behavioral'] * 100),
                "score": int(s_behavioral * norm_weights['behavioral']),
                "detail": f"Intent: {cand['search_intent']}. Responsiveness: {cand['responsiveness']}%. Git commits: {cand['github_commits']}/yr."
            },
            {
                "category": "Career Growth & Tenure",
                "weight": int(norm_weights['career'] * 100),
                "score": int(s_career * norm_weights['career']),
                "detail": f"{cand['experience']} yrs experience. Avg tenure: {cand['average_tenure']} yrs. Growth velocity: {cand['growth_velocity']}%."
            }
        ]

        # Generate custom reasoning text based on performance
        recs = []
        if s_semantic >= 85:
            recs.append("highly aligned technical stack")
        elif s_semantic >= 65:
            recs.append("serviceable technical baseline with minor tool gaps")
        else:
            recs.append("noticeable technical skill gaps requiring upskilling")

        if s_behavioral >= 85:
            recs.append("exceptional sourcing responsiveness and project activity")
        if s_career >= 85:
            recs.append("rapid career trajectory and strong job stability")

        reasoning_summary = f"{cand['name']} scored {final_score}% overall, demonstrating a {', '.join(recs)}."
        
        # Recommendations
        if final_score >= 88:
            recommendation = "Highly recommended for fast-track interview pipeline. Key highlights include strong technical similarity and excellent active signals."
        elif final_score >= 74:
            recommendation = "Recommend proceeding to phone screening. Candidate has strong baseline competencies and manageable skill overlaps."
        else:
            recommendation = "Keep in talent pool for future or more aligned placements. Technical stack or experience gaps exist for this specific role."

        ranked_results.append({
            "id": cand["id"],
            "name": cand["name"],
            "title": cand["title"],
            "score": int(final_score),
            "matchLevel": match_level,
            "badge": badge,
            "experience": cand["experience"],
            "education": cand["education"],
            "email": cand["email"],
            "phone": cand["phone"],
            "location": cand["location"],
            "summary": cand["summary"],
            "recommendation": recommendation,
            "matchedSkills": matched_skills_list,
            "missingSkills": missing_skills_list,
            "explainableAI": {
                "scoreBreakdown": score_breakdown,
                "reasoningSummary": reasoning_summary,
                "matchDetails": match_details
            },
            "heatmapMetrics": {
                "technical": int(s_semantic),
                "softSkills": int((cand["responsiveness"] + 80) / 2), # Simulated
                "cultureFit": int((intent_score + 80) / 2), # Simulated
                "experience": int(exp_score),
                "leadership": int((cand["growth_velocity"] + 65) / 2) # Simulated
            },
            "timeline": cand["timeline"],
            "behavioralSignals": {
                "assessmentScore": cand["assessment_score"],
                "githubCommits": cand["github_commits"],
                "responsiveness": cand["responsiveness"],
                "searchIntent": cand["search_intent"],
                "averageTenure": cand["average_tenure"],
                "growthVelocity": cand["growth_velocity"]
            }
        })

    # Sort candidates by final score descending
    ranked_results.sort(key=lambda x: x["score"], reverse=True)
    return ranked_results

def export_shortlist_to_csv(ranked_candidates, filepath="ranked_shortlist.csv"):
    """
    Writes the ranked candidate shortlist to a CSV file in the root directory.
    """
    try:
        with open(filepath, mode="w", newline="", encoding="utf-8") as csvfile:
            writer = csv.writer(csvfile)
            # Write Header
            writer.writerow([
                "Rank", 
                "Candidate ID", 
                "Name", 
                "Job Title", 
                "Overall Match Score (%)", 
                "Semantic Fit (%)", 
                "Coding Challenge (%)", 
                "Behavioral Score (%)", 
                "Career Score (%)", 
                "Sourcing Intent", 
                "Outreach Responsiveness (%)",
                "GitHub Commits/Yr", 
                "Exp (Yrs)", 
                "Average Tenure (Yrs)",
                "Recommendation Recommendation"
            ])
            
            # Write Data Rows
            for idx, cand in enumerate(ranked_candidates):
                bs = cand["behavioralSignals"]
                writer.writerow([
                    idx + 1,
                    cand["id"],
                    cand["name"],
                    cand["title"],
                    cand["score"],
                    cand["heatmapMetrics"]["technical"],
                    bs["assessmentScore"],
                    int((bs["responsiveness"] + min(100.0, (bs["githubCommits"]/400.0)*100.0) + (100 if bs["searchIntent"] == "Active" else (70 if bs["searchIntent"] == "Semi-Active" else 40))) / 3.0),
                    cand["heatmapMetrics"]["experience"],
                    bs["searchIntent"],
                    bs["responsiveness"],
                    bs["githubCommits"],
                    cand["experience"],
                    bs["averageTenure"],
                    cand["recommendation"]
                ])
        print(f"Successfully generated ranked shortlist at {filepath}")
        return True
    except Exception as e:
        print(f"Error exporting CSV: {e}", file=sys.stderr)
        return False

if __name__ == "__main__":
    # Test script execution
    test_skills = ["React", "Node.js", "Python", "TypeScript", "Machine Learning", "AWS", "SQL", "System Design", "Docker"]
    results = run_ranking(test_skills)
    export_shortlist_to_csv(results)
    
    # Simple verification test output
    print("\n--- Top 3 Candidates Ranked ---")
    for r in results[:3]:
        print(f"Score: {r['score']}% - Name: {r['name']} ({r['title']})")
