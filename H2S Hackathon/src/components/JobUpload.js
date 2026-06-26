import React, { useState } from 'https://esm.sh/react@18.2.0';
import htm from 'https://esm.sh/htm@3.1.1';
import { mockJobDescriptions } from '../data/mockData.js';

const html = htm.bind(React.createElement);

export default function JobUpload({ currentJD, setCurrentJD, addToast, onNext }) {
    const [jdText, setJdText] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisStep, setAnalysisStep] = useState(0);
    const [extractedSkills, setExtractedSkills] = useState([]);
    const [newTagText, setNewTagText] = useState("");

    const sampleJDText = `Role: Senior Full Stack AI Engineer
Department: AI & Innovation
Required Skills: React, Node.js, Python, TypeScript, Machine Learning, AWS, SQL, System Design, Docker

Description: We are seeking a Senior Full Stack AI Engineer to design and build our next-generation AI recruiting workflows. The ideal candidate has strong foundations in JavaScript/TypeScript, python analytics, and cloud scalability. You will implement responsive React client applications, integrate with OpenAI APIs, build Node.js microservices, and deploy pipelines using Docker and AWS.`;

    const handleLoadSample = () => {
        setJdText(sampleJDText);
        addToast("Sample Job Description populated!", "info");
    };

    const handleSelectPreset = (presetId) => {
        const jd = mockJobDescriptions.find(j => j.id === presetId);
        if (jd) {
            setJdText(`Role: ${jd.title}\nDepartment: ${jd.department}\nRequired Skills: ${jd.skills.join(", ")}\n\nDescription: ${jd.description}`);
            addToast(`Loaded preset campaign: ${jd.title}`, "info");
        }
    };

    const handleAnalyze = () => {
        if (!jdText.trim()) {
            addToast("Please paste a job description or load a sample first.", "warning");
            return;
        }

        setIsAnalyzing(true);
        setAnalysisStep(1);

        // Analyze text keywords to dynamically select the corresponding preset template
        let matchedJD = mockJobDescriptions[0]; // default
        const lowerText = jdText.toLowerCase();
        if (lowerText.includes("data scientist") || lowerText.includes("pytorch") || lowerText.includes("deep learning") || lowerText.includes("scientist")) {
            matchedJD = mockJobDescriptions[1];
        } else if (lowerText.includes("search") || lowerText.includes("elasticsearch") || lowerText.includes("retrieval")) {
            matchedJD = mockJobDescriptions[2];
        }

        // Step 1: Text Ingestion
        setTimeout(() => {
            setAnalysisStep(2);
            // Step 2: Entity Recognition
            setTimeout(() => {
                setAnalysisStep(3);
                // Step 3: Skill Mapping & Completion
                setTimeout(() => {
                    setIsAnalyzing(false);
                    // Create a copied instance so we don't mutate mock data globally
                    const finalJD = { ...matchedJD, skills: [...matchedJD.skills] };
                    setCurrentJD(finalJD);
                    setExtractedSkills(finalJD.skills);
                    addToast(`AI Extraction Complete! Loaded: ${finalJD.title}.`, "success");
                }, 1000);
            }, 1000);
        }, 1000);
    };

    const handleAddTag = (e) => {
        e.preventDefault();
        const cleanTag = newTagText.trim();
        if (cleanTag && !extractedSkills.includes(cleanTag)) {
            const updated = [...extractedSkills, cleanTag];
            setExtractedSkills(updated);
            if (currentJD) {
                setCurrentJD({ ...currentJD, skills: updated });
            }
            setNewTagText("");
            addToast(`Added search tag: ${cleanTag}`, "success");
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        const updated = extractedSkills.filter(t => t !== tagToRemove);
        setExtractedSkills(updated);
        if (currentJD) {
            setCurrentJD({ ...currentJD, skills: updated });
        }
        addToast(`Removed search tag: ${tagToRemove}`, "info");
    };

    return html`
        <div>
            
            <div style=${{ marginBottom: '30px' }}>
                <h2 style=${{ fontSize: '32px', marginBottom: '5px' }}>Job Specification Workspace</h2>
                <p style=${{ color: 'var(--text-secondary)', fontSize: '14px' }}>Provide target parameters for the AI matching algorithm.</p>
            </div>

            <div style=${{ display: 'grid', gridTemplateColumns: currentJD ? '1.2fr 1fr' : '1fr', gap: '30px' }}>
                
                <div class="glass-card">
                    ${!currentJD && !isAnalyzing ? html`
                        <div>
                            <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <h3 style=${{ fontSize: '18px' }}>Paste Job Description</h3>
                                <button class="btn btn-secondary" style=${{ padding: '6px 12px', fontSize: '12px' }} onClick=${handleLoadSample}>
                                    Load Sample JD
                                </button>
                            </div>
                            
                            <div style=${{ marginBottom: '20px' }}>
                                <div style=${{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>Quick Campaign Presets</div>
                                <div style=${{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    ${mockJobDescriptions.map(jd => html`
                                        <button 
                                            key=${jd.id}
                                            class="btn btn-secondary" 
                                            style=${{ padding: '6px 12px', fontSize: '11px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}
                                            onClick=${() => handleSelectPreset(jd.id)}
                                        >
                                            ${jd.title}
                                        </button>
                                    `)}
                                </div>
                            </div>
                            
                            <textarea 
                                value=${jdText}
                                onChange=${(e) => setJdText(e.target.value)}
                                placeholder="Paste the details of your job description here, detailing requirements, qualifications, and core tech stacks..."
                                style=${{
                                    width: '100%',
                                    height: '220px',
                                    background: 'rgba(10, 8, 25, 0.45)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '10px',
                                    padding: '15px',
                                    color: 'var(--text-primary)',
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '14px',
                                    outline: 'none',
                                    resize: 'none',
                                    marginBottom: '20px',
                                    transition: 'all var(--transition-normal)'
                                }}
                                onFocus=${(e) => e.target.style.borderColor = 'var(--accent-cyan)'}
                                onBlur=${(e) => e.target.style.borderColor = 'var(--glass-border)'}
                            />

                            
                            <div class="upload-zone" onClick=${handleLoadSample} style=${{ marginBottom: '25px' }}>
                                <i class="fa-solid fa-cloud-arrow-up upload-icon"></i>
                                <h4 style=${{ marginBottom: '5px', fontSize: '15px' }}>Drag & Drop Job Specification File</h4>
                                <p style=${{ color: 'var(--text-muted)', fontSize: '12px' }}>Supports PDF, DOCX, TXT up to 10MB</p>
                            </div>

                            <button class="btn btn-primary" style=${{ width: '100%', padding: '12px' }} onClick=${handleAnalyze}>
                                <i class="fa-solid fa-wand-magic-sparkles"></i> Execute AI JD Extraction
                            </button>
                        </div>
                    ` : null}

                    
                    ${isAnalyzing && html`
                        <div style=${{ padding: '40px 20px', textAlign: 'center' }}>
                            <div class="glow-pulse-circle" style=${{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: 'rgba(0, 242, 254, 0.1)',
                                border: '2px solid var(--accent-cyan)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 30px auto',
                                display: 'inline-flex'
                            }}>
                                <i class="fa-solid fa-microchip" style=${{ fontSize: '32px', color: 'var(--accent-cyan)' }}></i>
                            </div>
                            
                            <h3 style=${{ fontSize: '20px', marginBottom: '10px' }}>Analyzing Job Specification</h3>
                            <p style=${{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '30px' }}>Our natural language processor is parsing details and locating keywords...</p>

                            
                            <div style=${{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '340px', margin: '0 auto', textAlign: 'left' }}>
                                <div style=${{ display: 'flex', alignItems: 'center', gap: '15px', opacity: analysisStep >= 1 ? 1 : 0.3 }}>
                                    <i class="fa-solid ${analysisStep > 1 ? 'fa-circle-check' : 'fa-circle-notch fa-spin'}" style=${{ color: analysisStep > 1 ? 'var(--accent-green)' : 'var(--accent-cyan)' }}></i>
                                    <span style=${{ fontSize: '13px' }}>Ingesting document structure...</span>
                                </div>
                                <div style=${{ display: 'flex', alignItems: 'center', gap: '15px', opacity: analysisStep >= 2 ? 1 : 0.3 }}>
                                    <i class="fa-solid ${analysisStep > 2 ? 'fa-circle-check' : 'fa-circle-notch fa-spin'}" style=${{ color: analysisStep > 2 ? 'var(--accent-green)' : 'var(--accent-cyan)' }}></i>
                                    <span style=${{ fontSize: '13px' }}>Parsing entity and core skills tags...</span>
                                </div>
                                <div style=${{ display: 'flex', alignItems: 'center', gap: '15px', opacity: analysisStep >= 3 ? 1 : 0.3 }}>
                                    <i class="fa-solid ${analysisStep > 3 ? 'fa-circle-check' : 'fa-circle-notch fa-spin'}" style=${{ color: analysisStep > 3 ? 'var(--accent-green)' : 'var(--accent-cyan)' }}></i>
                                    <span style=${{ fontSize: '13px' }}>Compiling weighting parameters...</span>
                                </div>
                            </div>

                            <div class="progress-bar-container" style=${{ maxWidth: '340px', margin: '30px auto 0 auto' }}>
                                <div class="progress-bar" style=${{ width: analysisStep === 1 ? '33%' : analysisStep === 2 ? '66%' : '100%' }}></div>
                            </div>
                        </div>
                    `}

                    
                    ${currentJD && !isAnalyzing ? html`
                        <div>
                            <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style=${{ fontSize: '18px' }}>AI-Analyzed Campaign</h3>
                                <button class="btn btn-secondary" style=${{ padding: '5px 10px', fontSize: '11px', color: 'var(--accent-magenta)' }} onClick=${() => {
                                    setCurrentJD(null);
                                    setExtractedSkills([]);
                                    setJdText("");
                                }}>
                                    Reset Specification
                                </button>
                            </div>

                            <div style=${{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div>
                                    <div style=${{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Target Role Title</div>
                                    <div style=${{ fontSize: '18px', fontWeight: '700', color: 'var(--text-cyan)' }}>${currentJD.title}</div>
                                </div>

                                <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div>
                                        <div style=${{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Department</div>
                                        <div style=${{ fontSize: '14px', fontWeight: '500' }}>${currentJD.department}</div>
                                    </div>
                                    <div>
                                        <div style=${{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Compensation Tier</div>
                                        <div style=${{ fontSize: '14px', fontWeight: '500' }}>${currentJD.salary}</div>
                                    </div>
                                </div>

                                <div>
                                    <div style=${{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Core Tech & Concepts Extracted</div>
                                    <div class="skill-tags">
                                        ${extractedSkills.map(tag => html`
                                            <span key=${tag} class="skill-tag" style=${{ border: '1px solid rgba(0, 242, 254, 0.25)', color: 'var(--text-cyan)', background: 'rgba(0, 242, 254, 0.05)' }}>
                                                ${tag}
                                                <i class="fa-solid fa-xmark" style=${{ cursor: 'pointer', marginLeft: '4px', fontSize: '10px' }} onClick=${() => handleRemoveTag(tag)}></i>
                                            </span>
                                        `)}
                                    </div>

                                    
                                    <form onSubmit=${handleAddTag} style=${{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                        <input 
                                            type="text" 
                                            value=${newTagText}
                                            onChange=${(e) => setNewTagText(e.target.value)}
                                            placeholder="Add manual search term..."
                                            style=${{
                                                flex: 1,
                                                background: 'rgba(255,255,255,0.02)',
                                                border: '1px solid var(--glass-border)',
                                                borderRadius: '8px',
                                                padding: '8px 12px',
                                                color: 'var(--text-primary)',
                                                fontFamily: 'var(--font-body)',
                                                fontSize: '13px',
                                                outline: 'none'
                                            }}
                                        />
                                        <button class="btn btn-secondary" style=${{ padding: '8px 15px', fontSize: '13px' }} type="submit">
                                            Add Skill
                                        </button>
                                    </form>
                                </div>
                            </div>

                            <button class="btn btn-primary" style=${{ width: '100%', marginTop: '30px', padding: '12px' }} onClick=${onNext}>
                                Next Step: Load Applicant Resumes <i class="fa-solid fa-arrow-right"></i>
                            </button>
                        </div>
                    ` : null}
                </div>


                
                ${currentJD && html`
                    <div class="glass-card" style=${{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <h3 style=${{ fontSize: '18px' }}>Matching Configuration</h3>
                        
                        <div style=${{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style=${{ padding: '15px', background: 'rgba(0, 242, 254, 0.03)', border: '1px solid rgba(0, 242, 254, 0.1)', borderRadius: '10px' }}>
                                <div style=${{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                                    <i class="fa-solid fa-sliders" style=${{ color: 'var(--accent-cyan)' }}></i>
                                    <span style=${{ fontWeight: '600', fontSize: '14px' }}>Skill Weights</span>
                                </div>
                                <p style=${{ fontSize: '12px', color: 'var(--text-secondary)' }}>Matching priority is allocated automatically. Core technology tags count for 45% of total score, past seniority/title matching counts for 30%, and cloud/scale structures count for 25%.</p>
                            </div>

                            <div style=${{ padding: '15px', background: 'rgba(157, 78, 221, 0.03)', border: '1px solid rgba(157, 78, 221, 0.1)', borderRadius: '10px' }}>
                                <div style=${{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                                    <i class="fa-solid fa-filter" style=${{ color: 'var(--accent-purple)' }}></i>
                                    <span style=${{ fontWeight: '600', fontSize: '14px' }}>AI Match Filters</span>
                                </div>
                                <p style=${{ fontSize: '12px', color: 'var(--text-secondary)' }}>Fuzzy matching is enabled. Candidate records listing related keywords (e.g. "React Hooks" or "React Native" matches "React") will receive partial match points.</p>
                            </div>
                        </div>

                        <div style=${{
                            marginTop: 'auto',
                            padding: '15px',
                            background: 'rgba(255,255,255,0.02)',
                            borderRadius: '10px',
                            border: '1px solid var(--glass-border)',
                            fontSize: '12px',
                            color: 'var(--text-muted)',
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'center'
                        }}>
                            <i class="fa-solid fa-circle-info" style=${{ fontSize: '16px', color: 'var(--accent-cyan)' }}></i>
                            <span>You can modify, add, or remove tags to dynamically adjust match calculations on the candidate leaderboards.</span>
                        </div>
                    </div>
                `}
            </div>

            
            <style dangerouslySetInnerHTML=${{__html: `
                @keyframes pulseGlow {
                    0% { box-shadow: 0 0 10px rgba(0, 242, 254, 0.2); }
                    100% { box-shadow: 0 0 25px rgba(0, 242, 254, 0.5); }
                }
                .glow-pulse-circle {
                    animation: pulseGlow 2s infinite alternate;
                }
            `}} />
        </div>
    `;
}
