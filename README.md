SkillMatch: Predictive Ranking Engine & Candidate Discovery
Track 01 - The Data & AI Challenge (Intelligent Candidate Discovery)

SkillMatch is a robust, workable Proof of Concept built to solve the modern talent acquisition challenge. By moving beyond naive keyword matching, SkillMatch implements a Python-powered Predictive Ranking Engine that dynamically score-ranks candidates based on semantic skill proximity, professional experience metadata, and crucial behavioral intent signals.

1. Project Overview & "Hidden Gems" Strategy
Traditional applicant tracking systems (ATS) drop qualified candidates if they lack specific keyword tokens (e.g., matching "React" but missing a candidate who is highly skilled in "Vue.js" or "Svelte").

SkillMatch implements an AI Brain that:

Sees beyond keywords: Employs synonym mappings to award partial matching scores for related frameworks/libraries.
Integrates behavioral metadata: Combines active job search intent, recruiter email responsiveness, and GitHub project contributions to rank highly engaged candidates.
Promotes Explainable AI: Presents clear, mathematical breakdowns of the fit coefficient, enabling recruiters to adjust weights dynamically.
2. Mathematical Scoring Model
The ranking engine computes a composite match score (
S
c
o
r
e
c
o
m
p
o
s
i
t
e
) between 0.0% and 100.0% for each applicant using four weighted dimensions.

Recruiters can adjust the matching weights (
w
i
) interactively in the UI, and the Python backend recomputes the score on-the-fly:

S
c
o
r
e
c
o
m
p
o
s
i
t
e
=
w
s
e
m
a
n
t
i
c
⋅
S
s
e
m
a
n
t
i
c
+
w
a
s
s
e
s
s
m
e
n
t
⋅
S
a
s
s
e
s
s
m
e
n
t
+
w
b
e
h
a
v
i
o
r
a
l
⋅
S
b
e
h
a
v
i
o
r
a
l
+
w
c
a
r
e
e
r
⋅
S
c
a
r
e
e
r

Where: 
∑
w
i
=
w
s
e
m
a
n
t
i
c
+
w
a
s
s
e
s
s
m
e
n
t
+
w
b
e
h
a
v
i
o
r
a
l
+
w
c
a
r
e
e
r
=
1.0

Scoring Component Breakdown
A. Semantic Stack Proximity (
S
s
e
m
a
n
t
i
c
)
Matches the candidate's skills against job requirements. If a direct match is missing, the engine checks a synonym proximity matrix. Example synonym mappings:

React 
↔
 Vue.js (80%), Svelte (85%), Angular (70%), JavaScript (60%)
Node.js 
↔
 Express (90%), FastAPI (70%), Go (70%)
Machine Learning 
↔
 Deep Learning (95%), PyTorch (90%), TensorFlow (90%), RAG (85%) 
S
s
e
m
a
n
t
i
c
=
∑
r
∈
R
e
q
u
i
r
e
d
MaxSimilarity
(
r
,
CandidateSkills
)
Total Required Skills
×
100
B. Coding Assessment Score (
S
a
s
s
e
s
s
m
e
n
t
)
Integrates candidate performance on technical logic tests directly from the assessment suite (0% - 100%).

C. Behavioral Intent Score (
S
b
e
h
a
v
i
o
r
a
l
)
Aggregates activity signals to target high-engagement applicants:

Search Intent: Active (100 pts), Semi-Active (70 pts), Passive (40 pts).
Responsiveness: Recruiter outreach response rate percentage (0 - 100).
GitHub Activity Index: Annual public repository commit velocity (capped at 400 commits/yr). 
S
b
e
h
a
v
i
o
r
a
l
=
IntentScore
+
Responsiveness
+
min
(
100
,
Commits
4
)
3
D. Career & Stability Score (
S
c
a
r
e
e
r
)
Prevents high-churn hires while ensuring experience thresholds:

Experience Fit: Ratio of years of experience vs target job seniority requirement (capped at 100%).
Promotion/Growth Velocity: Dynamic career growth and seniority progression index (0 - 100).
Job Stability Index: Ratio of average job tenure length vs a standard 2.5-year baseline (capped at 100%). 
S
c
a
r
e
e
r
=
ExpRatio
+
GrowthVelocity
+
min
(
100
,
AvgTenure
2.5
×
100
)
3
3. System Architecture
The application is built as a hybrid client-server platform with zero external package dependencies, ensuring out-of-the-box execution:


Frontend UI: Responsive glassmorphism dashboard built using React (htm template bindings) and Chart.js. Includes matching coefficient range sliders and explainable AI breakdowns.
REST API Layer (server.py): Built-in Python TCP server extended to route API endpoints (/api/rank, /api/candidates) and handle preflight CORS requests.
AI Brain (ranker.py): Python calculation engine conducting the similarity scoring matrix and compiling the CSV candidate leaderboard.
4. Predefined Shortlist Export Format
When the ranking engine runs, it automatically writes the results to ranked_shortlist.csv in the root workspace directory. The CSV uses the following predefined format:

Column	Description
Rank	Position on the candidate leaderboard (1-indexed)
Candidate ID	Unique candidate identifier
Name	Applicant full name
Job Title	Current professional title
Overall Match Score (%)	Composite score (
S
c
o
r
e
c
o
m
p
o
s
i
t
e
)
Semantic Fit (%)	Technical stack synonym mapping score
Coding Challenge (%)	Logic assessment score
Behavioral Score (%)	Sourcing intent + responsiveness + git index
Career Score (%)	Stability + experience + growth metrics
Sourcing Intent	Candidate search intent (Active / Semi-Active / Passive)
Outreach Responsiveness (%)	Recruiter contact response rate
GitHub Commits/Yr	Public contribution velocity
Exp (Yrs)	Total professional coding experience
Average Tenure (Yrs)	Average job tenure
Recommendation	AI-generated candidate assessment summary
5. Getting Started & Execution Guide
Prerequisites
Python 3.x installed (Uses only Python built-in standard libraries).
A modern web browser.
Run Instructions
Run the local launch script:
run.bat
The script will boot the Python static/REST API server on port 8000 and output:
===================================================
          SkillMatch Recruitment Platform
===================================================
Server started on port 8000 (IPv4)...
Serving files with caching disabled...
Open your browser and navigate to:
http://127.0.0.1:8000
Click "Try Demo" to load the workspace, or upload a custom job description and ingest resumes.
In the "Talent Leaderboard" tab, adjust the range sliders to change weights. The candidate ranks, charts, and CSV file will update automatically.
Click "Export Predefined CSV" to download the shortlist. https://ranking-yt0l.onrender.com/
