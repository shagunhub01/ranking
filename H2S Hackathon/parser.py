import re
import os
import zipfile
import xml.etree.ElementTree as ET
import io
import base64
import hashlib

def extract_text_from_docx(docx_bytes):
    """
    Extracts text content from a DOCX file using standard library zipfile and XML parser.
    """
    try:
        with zipfile.ZipFile(io.BytesIO(docx_bytes)) as z:
            xml_content = z.read('word/document.xml')
            root = ET.fromstring(xml_content)
            texts = []
            for elem in root.iter():
                if elem.tag.endswith('}t'): # matches w:t tag
                    if elem.text:
                        texts.append(elem.text)
            return " ".join(texts)
    except Exception as e:
        print(f"Error parsing DOCX: {e}")
        return ""

def extract_text_from_pdf(pdf_bytes):
    """
    Best effort extraction of raw strings from uncompressed/simple PDF files using regular expressions.
    """
    try:
        content = pdf_bytes.decode('latin1')
        strings = re.findall(r'\((.*?)\)', content)
        text_parts = []
        for s in strings:
            s_clean = s.replace(r'\)', ')').replace(r'\(', '(')
            # Remove PDF specific strings or commands
            if len(s_clean) > 2 and any(c.isalpha() for c in s_clean):
                text_parts.append(s_clean)
        if text_parts:
            return " ".join(text_parts)
    except Exception as e:
        print(f"Error parsing PDF: {e}")
    return ""

def parse_resume_text(text, filename):
    """
    Analyzes raw resume text to extract Candidate Name, Email, Phone, Title, Experience, Skills, and Education.
    """
    # Clean filename to get fallback name
    base_name = os.path.splitext(filename)[0]
    base_name = base_name.replace('_', ' ').replace('-', ' ').title()
    base_name = re.sub(r'\b(Resume|Cv|New|Final|Doc|Pdf|File|Upload|Applicant)\b', '', base_name, flags=re.I).strip()
    if not base_name:
        base_name = "Jane Doe"
        
    # 1. Email extraction
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    email = email_match.group(0) if email_match else f"{base_name.lower().replace(' ', '.')}@example.com"
    
    # 2. Phone extraction
    phone_match = re.search(r'\+?\d[\d\s\.-]{8,}\d', text)
    phone = phone_match.group(0) if phone_match else "+1 (555) 019-0000"
    
    # 3. Name extraction
    name = base_name
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    if lines:
        for line in lines[:4]:
            words = line.split()
            # If a line at the very top contains 2-3 capitalized alphabetic words, use it as Name
            if 1 < len(words) <= 3 and all(w[0].isupper() for w in words if w.isalpha()):
                # Filter out titles like "Curriculum Vitae"
                if "curriculum" not in line.lower() and "vitae" not in line.lower():
                    name = line
                    break

    # 4. Experience extraction
    exp = 3 # default
    exp_matches = re.findall(r'(\d+)\+?\s*(?:year|yr)s?\s*(?:of)?\s*(?:experience|exp)?', text, re.I)
    if exp_matches:
        try:
            valid_exps = [int(m) for m in exp_matches if int(m) < 40]
            if valid_exps:
                exp = max(valid_exps)
        except ValueError:
            pass
            
    # 5. Skills extraction
    known_skills = [
        "React", "Node.js", "Python", "TypeScript", "Machine Learning", "AWS", "SQL", "System Design", "Docker",
        "Vue.js", "Angular", "Svelte", "JavaScript", "Express", "FastAPI", "Django", "Flask", "Deep Learning",
        "Neural Networks", "TensorFlow", "PyTorch", "NLP", "RAG", "Transformers", "HuggingFace", "Azure", "GCP",
        "Kubernetes", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Pinecone", "Vector Database", "Elasticsearch"
    ]
    matched_skills = []
    for skill in known_skills:
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        # Special matching for Node.js or Vue.js since they have dots/hyphens
        if skill in ["Node.js", "Vue.js"]:
            pattern = re.escape(skill.lower())
        if re.search(pattern, text.lower()):
            matched_skills.append(skill)
            
    if not matched_skills:
        # Fallback skills based on filename keywords
        if "ai" in filename.lower() or "ml" in filename.lower() or "data" in filename.lower():
            matched_skills = ["Python", "Machine Learning", "PyTorch"]
        elif "front" in filename.lower() or "web" in filename.lower() or "react" in filename.lower():
            matched_skills = ["React", "JavaScript", "SQL"]
        else:
            matched_skills = ["Python", "SQL", "Docker"]

    # 6. Education extraction
    education = "B.S. in Computer Science"
    edu_match = re.search(r'(?:B\.S\.|M\.S\.|B\.A\.|M\.Tech|Ph\.D\.|Bachelor|Master|Doctorate)[^\n,.]+', text, re.I)
    if edu_match:
        education = edu_match.group(0).strip()
        
    # 7. Job Title extraction
    title = "Software Engineer"
    text_lower = text.lower()
    if "data scientist" in text_lower:
        title = "Data Scientist"
    elif "ai engineer" in text_lower or "ml engineer" in text_lower or "machine learning engineer" in text_lower:
        title = "AI/ML Engineer"
    elif "frontend" in text_lower:
        title = "Frontend Engineer"
    elif "backend" in text_lower:
        title = "Backend Engineer"
    elif "devops" in text_lower:
        title = "DevOps Engineer"
    elif "search" in text_lower or "retrieval" in text_lower:
        title = "Search & Retrieval Architect"
        
    # 8. Summary / Bio
    summary = text[:250] + "..." if len(text) > 250 else text
    if not text.strip():
        summary = f"Applicant profile generated dynamically from file: {filename}."

    return {
        "id": f"cand-{int(hashlib.md5(email.lower().encode()).hexdigest()[:10], 16)}", # deterministic unique ID from email
        "name": name,
        "title": title,
        "experience": exp,
        "education": education,
        "email": email,
        "phone": phone,
        "location": "San Francisco, CA" if "california" in text_lower or "sf" in text_lower else "Remote",
        "summary": summary,
        "skills": matched_skills,
        "matchedSkills": matched_skills,
        "missingSkills": [],
        "assessment_score": 80, # default average
        "responsiveness": 85,
        "github_commits": 120,
        "growth_velocity": 75,
        "average_tenure": 2.5,
        "search_intent": "Active",
        "timeline": [
            {"role": title, "company": "Tech Corp", "period": "2023 - Present", "desc": f"Worked with {', '.join(matched_skills[:3])}."}
        ]
    }
