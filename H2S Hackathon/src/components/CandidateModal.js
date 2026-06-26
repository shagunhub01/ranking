import React, { useEffect } from 'https://esm.sh/react@18.2.0';
import htm from 'https://esm.sh/htm@3.1.1';

const html = htm.bind(React.createElement);

export default function CandidateModal({ candidate, isShortlisted, onClose, toggleShortlist, activeWeights }) {
    
    // Calculate Radial gauge paths
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (candidate.score / 100) * circumference;

    useEffect(() => {
        const radarCanvas = document.getElementById('radarChart');
        if (!radarCanvas) return;

        const ctx = radarCanvas.getContext('2d');
        
        // Dynamically compute the required skills list from candidate matched + missing
        const coreSkills = (candidate.matchedSkills && candidate.missingSkills) ? 
            [...candidate.matchedSkills, ...candidate.missingSkills] : 
            ['React', 'Node.js', 'Python', 'TypeScript', 'Machine Learning', 'AWS', 'SQL', 'System Design', 'Docker'];

        const candidateData = coreSkills.map(s => {
            const hasSkill = candidate.matchedSkills && candidate.matchedSkills.some(cs => cs.toLowerCase() === s.toLowerCase());
            return hasSkill ? 100 : 20; // Partial score for visual flair
        });

        const data = {
            labels: coreSkills,
            datasets: [
                {
                    label: 'Required Spec',
                    data: coreSkills.map(() => 100),
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    borderWidth: 1,
                    pointRadius: 0
                },
                {
                    label: candidate.name,
                    data: candidateData,
                    borderColor: '#00f2fe',
                    backgroundColor: 'rgba(0, 242, 254, 0.15)',
                    borderWidth: 2.5,
                    pointBackgroundColor: '#9d4edd',
                    pointBorderColor: '#00f2fe',
                    pointHoverRadius: 6,
                    pointRadius: 3
                }
            ]
        };

        const config = {
            type: 'radar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    r: {
                        angleLines: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        pointLabels: {
                            color: '#a1a1aa',
                            font: {
                                family: 'Inter',
                                size: 9
                            }
                        },
                        ticks: {
                            display: false
                        },
                        min: 0,
                        max: 100
                    }
                }
            }
        };

        const chart = new Chart(ctx, config);

        return () => {
            chart.destroy();
        };
    }, [candidate.id]);

    return html`
        <div class="modal-overlay" onClick=${onClose}>
            <div class="glass-card modal-content" onClick=${(e) => e.stopPropagation()} style=${{ background: 'rgba(12, 10, 31, 0.96)', border: '1px solid rgba(255,255,255,0.1)' }}>
                
                <div class="modal-header">
                    <div>
                        <h3 style=${{ fontSize: '24px', marginBottom: '4px' }}>Candidate Evaluation</h3>
                        <p style=${{ color: 'var(--text-secondary)', fontSize: '13px' }}>AI-analyzed fit scorecard detailing semantic matching and behavioral signals.</p>
                    </div>
                    <div style=${{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        ${candidate.resume_url && html`
                            <a 
                                href=${candidate.resume_url} 
                                target="_blank" 
                                class="btn btn-secondary" 
                                style=${{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '12px', height: '36px', textDecoration: 'none', border: '1px solid var(--glass-border)', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}
                            >
                                <i class="fa-solid fa-file-lines" style=${{ color: 'var(--accent-cyan)' }}></i> Open Resume
                            </a>
                        `}
                        <button class="modal-close" onClick=${onClose} style=${{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', color: 'var(--text-muted)' }}>
                            <i class="fa-solid fa-circle-xmark"></i>
                        </button>
                    </div>
                </div>

                
                <div style=${{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }} class="modal-body-grid">
                    
                    
                    <div style=${{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        
                        <div style=${{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <div style=${{ 
                                width: '56px', 
                                height: '56px', 
                                borderRadius: '50%', 
                                background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '800',
                                color: 'var(--bg-deep)',
                                fontSize: '20px',
                                display: 'inline-flex'
                            }}>
                                ${candidate.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <h4 style=${{ fontSize: '20px', fontWeight: '700', marginBottom: '3px' }}>${candidate.name}</h4>
                                <div style=${{ fontSize: '13px', color: 'var(--accent-cyan)', fontWeight: '600' }}>${candidate.title}</div>
                                <div style=${{ fontSize: '12px', color: 'var(--text-muted)' }}>${candidate.location} • ${candidate.phone}</div>
                            </div>
                        </div>

                        
                        <div>
                            <h4 style=${{ fontSize: '15px', marginBottom: '8px', color: 'var(--text-purple)' }}>Resume Profile Synthesis</h4>
                            <p style=${{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                                ${candidate.summary}
                            </p>
                        </div>

                        
                        <div>
                            <h4 style=${{ fontSize: '15px', marginBottom: '10px' }}>Capabilities Gap Map</h4>
                            <div style=${{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                
                                <div>
                                    <div style=${{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Matched Core Skills</div>
                                    <div class="skill-tags">
                                        ${(candidate.matchedSkills || candidate.skills || []).map(skill => html`
                                            <span key=${skill} class="skill-tag match">
                                                <i class="fa-solid fa-circle-check"></i> ${skill}
                                            </span>
                                        `)}
                                    </div>
                                </div>
                                
                                
                                <div>
                                    <div style=${{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Missing Requirements</div>
                                    <div class="skill-tags">
                                        ${(candidate.missingSkills || []).length === 0 ? html`
                                            <span class="skill-tag" style=${{ color: 'var(--accent-green)', borderColor: 'rgba(0,255,136,0.1)' }}>None! 100% skill matching</span>
                                        ` : (candidate.missingSkills || []).map(skill => html`
                                            <span key=${skill} class="skill-tag missing">
                                                <i class="fa-solid fa-triangle-exclamation"></i> ${skill}
                                            </span>
                                        `)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                        <div style=${{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
                            <h4 style=${{ fontSize: '15px', marginBottom: '12px', color: 'var(--accent-cyan)' }}>
                                <i class="fa-solid fa-circle-info" style=${{ marginRight: '6px' }}></i> Explainable AI Assessment
                            </h4>
                            <div style=${{ background: 'rgba(0, 242, 254, 0.02)', border: '1px solid rgba(0, 242, 254, 0.15)', borderRadius: '10px', padding: '16px' }}>
                                <div style=${{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '15px' }}>
                                    ${candidate.explainableAI.reasoningSummary}
                                </div>

                                
                                <div style=${{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    ${candidate.explainableAI.scoreBreakdown.map((item, i) => html`
                                        <div key=${i} style=${{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', borderBottom: '1px dashed rgba(255,255,255,0.03)', paddingBottom: '4px' }}>
                                            <span style=${{ color: 'var(--text-secondary)' }}>${item.category}</span>
                                            <span style=${{ fontWeight: '600' }} class="score-text">${item.score} / ${item.weight} pts</span>
                                        </div>
                                    `)}
                                </div>
                            </div>
                        </div>
                    </div>

                    
                    <div style=${{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
                        
                        <div class="glass-card" style=${{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
                            <h4 style=${{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '15px' }}>AI Fit Quotient</h4>
                            <div class="radial-score-container">
                                <svg class="radial-score-svg" width="140" height="140" viewBox="0 0 140 140">
                                    <defs>
                                        <linearGradient id="gradient-gauge" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stop-color="var(--accent-cyan)" />
                                            <stop offset="100%" stop-color="var(--accent-purple)" />
                                        </linearGradient>
                                    </defs>
                                    <circle cx="70" cy="70" r=${radius} stroke="rgba(255, 255, 255, 0.04)" stroke-width="8" fill="none" />
                                    <circle 
                                        cx="70" 
                                        cy="70" 
                                        r=${radius} 
                                        stroke="url(#gradient-gauge)" 
                                        stroke-width="8" 
                                        stroke-dasharray=${circumference} 
                                        stroke-dashoffset=${strokeDashoffset}
                                        stroke-linecap="round"
                                        fill="none" 
                                        style=${{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                                    />
                                </svg>
                                <div class="score-center-text">
                                    <div class="score-percent">${candidate.score}%</div>
                                    <div class="score-desc" style=${{ color: candidate.score >= 88 ? 'var(--accent-green)' : 'var(--accent-cyan)' }}>
                                        ${candidate.matchLevel}
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                        <div class="glass-card" style=${{ width: '100%', padding: '16px' }}>
                            <h4 style=${{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px', textAlign: 'center' }}>Skill Similarity Radar</h4>
                            <div style=${{ height: '180px', width: '100%', position: 'relative' }}>
                                <canvas id="radarChart"></canvas>
                            </div>
                        </div>

                        
                        <div class="glass-card" style=${{ width: '100%', padding: '16px' }}>
                            <h4 style=${{ fontSize: '13px', color: 'var(--text-purple)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <i class="fa-solid fa-signal" style=${{ color: 'var(--accent-purple)' }}></i>
                                Sourcing Activity & Signals
                            </h4>
                            <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '11px' }}>
                                <div style=${{ background: 'rgba(255,255,255,0.01)', padding: '6px 8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)' }}>
                                    <div style=${{ color: 'var(--text-muted)' }}>Coding assessment</div>
                                    <div style=${{ fontSize: '14px', fontWeight: '700', color: 'var(--accent-green)', marginTop: '2px' }}>
                                        ${candidate.behavioralSignals ? candidate.behavioralSignals.assessmentScore : 75}%
                                    </div>
                                </div>
                                <div style=${{ background: 'rgba(255,255,255,0.01)', padding: '6px 8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)' }}>
                                    <div style=${{ color: 'var(--text-muted)' }}>Outreach response</div>
                                    <div style=${{ fontSize: '14px', fontWeight: '700', color: 'var(--accent-cyan)', marginTop: '2px' }}>
                                        ${candidate.behavioralSignals ? candidate.behavioralSignals.responsiveness : 80}%
                                    </div>
                                </div>
                                <div style=${{ background: 'rgba(255,255,255,0.01)', padding: '6px 8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)' }}>
                                    <div style=${{ color: 'var(--text-muted)' }}>GitHub Activity</div>
                                    <div style=${{ fontSize: '12px', fontWeight: '700', color: '#ffb703', marginTop: '2px' }}>
                                        ${candidate.behavioralSignals ? candidate.behavioralSignals.githubCommits : 120} commits/yr
                                    </div>
                                </div>
                                <div style=${{ background: 'rgba(255,255,255,0.01)', padding: '6px 8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)' }}>
                                    <div style=${{ color: 'var(--text-muted)' }}>Sourcing Intent</div>
                                    <div style=${{ fontSize: '13px', fontWeight: '700', color: 'var(--accent-magenta)', marginTop: '2px' }}>
                                        ${candidate.behavioralSignals ? candidate.behavioralSignals.searchIntent : 'Active'}
                                    </div>
                                </div>
                                <div style=${{ background: 'rgba(255,255,255,0.01)', padding: '6px 8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)' }}>
                                    <div style=${{ color: 'var(--text-muted)' }}>Average Tenure</div>
                                    <div style=${{ fontSize: '13px', fontWeight: '700', color: '#f3f4f6', marginTop: '2px' }}>
                                        ${candidate.behavioralSignals ? candidate.behavioralSignals.averageTenure : 2.5} yrs
                                    </div>
                                </div>
                                <div style=${{ background: 'rgba(255,255,255,0.01)', padding: '6px 8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)' }}>
                                    <div style=${{ color: 'var(--text-muted)' }}>Growth Velocity</div>
                                    <div style=${{ fontSize: '13px', fontWeight: '700', color: 'var(--accent-cyan)', marginTop: '2px' }}>
                                        ${candidate.behavioralSignals ? candidate.behavioralSignals.growthVelocity : 70}%
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                        <div style=${{ width: '100%', display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                            <button 
                                class="btn ${isShortlisted ? 'btn-accent' : 'btn-secondary'}" 
                                style=${{ padding: '12px' }}
                                onClick=${() => toggleShortlist(candidate.id)}
                            >
                                <i class="fa-${isShortlisted ? 'solid' : 'regular'} fa-star"></i> 
                                ${isShortlisted ? 'Remove from Shortlist' : 'Add to Shortlist'}
                            </button>
                            <button class="btn btn-primary" style=${{ padding: '12px' }} onClick=${onClose}>
                                Close Evaluation
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            
            <style dangerouslySetInnerHTML=${{__html: `
                @media (max-width: 900px) {
                    .modal-body-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .modal-content {
                        max-width: 500px !important;
                    }
                }
            `}} />
        </div>
    `;
}
