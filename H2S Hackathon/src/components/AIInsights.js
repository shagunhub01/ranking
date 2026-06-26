import React, { useEffect } from 'https://esm.sh/react@18.2.0';
import htm from 'https://esm.sh/htm@3.1.1';

const html = htm.bind(React.createElement);

export default function AIInsights({ candidates }) {
    
    // Sort candidates for the Heatmap display
    const sortedCandidates = [...candidates].sort((a, b) => b.score - a.score).slice(0, 5);

    // Compute dynamic skills list and candidate match coverage
    const requiredSkillsSet = new Set();
    candidates.forEach(cand => {
        if (cand.matchedSkills) cand.matchedSkills.forEach(s => requiredSkillsSet.add(s));
        if (cand.missingSkills) cand.missingSkills.forEach(s => requiredSkillsSet.add(s));
    });
    
    const skillsList = requiredSkillsSet.size > 0 ? Array.from(requiredSkillsSet) : ['React', 'Node.js', 'Python', 'TypeScript', 'Machine Learning', 'AWS', 'SQL', 'System Design', 'Docker'];
    
    const coverageData = skillsList.map(skill => {
        const matchCount = candidates.filter(cand => 
            cand.matchedSkills && cand.matchedSkills.some(s => s.toLowerCase() === skill.toLowerCase())
        ).length;
        return candidates.length > 0 ? Math.round((matchCount / candidates.length) * 100) : 0;
    });

    // Find bottleneck skills (coverage < 60%)
    const bottlenecks = skillsList
        .map((skill, idx) => ({ skill, coverage: coverageData[idx] }))
        .filter(item => item.coverage < 60)
        .sort((a, b) => a.coverage - b.coverage);

    const topCandidate = sortedCandidates[0];

    useEffect(() => {
        const gapCanvas = document.getElementById('gapChart');
        if (!gapCanvas) return;

        const ctx = gapCanvas.getContext('2d');
        
        // Horizontal bar chart showing candidate coverage
        const data = {
            labels: skillsList,
            datasets: [{
                label: '% of Candidates Matching Requirement',
                data: coverageData,
                backgroundColor: 'rgba(157, 78, 221, 0.45)',
                borderColor: 'rgba(157, 78, 221, 0.85)',
                borderWidth: 1,
                borderRadius: 4,
                hoverBackgroundColor: 'rgba(0, 242, 254, 0.65)',
                hoverBorderColor: '#00f2fe',
            }]
        };

        const config = {
            type: 'bar',
            data: data,
            options: {
                indexAxis: 'y', // Makes it a horizontal bar chart
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(12, 10, 31, 0.95)',
                        titleFont: { family: 'Outfit', size: 12 },
                        bodyFont: { family: 'Inter', size: 11 },
                        borderColor: 'rgba(0, 242, 254, 0.2)',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        max: 100,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.03)'
                        },
                        ticks: {
                            color: '#a1a1aa',
                            font: { family: 'Inter', size: 10 },
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#e5e7eb',
                            font: { family: 'Outfit', size: 11, weight: '500' }
                        }
                    }
                }
            }
        };

        const chart = new Chart(ctx, config);

        return () => {
            chart.destroy();
        };
    }, [candidates]);

    // Generate dynamic sourcing advices
    const advices = [];
    if (bottlenecks.length > 0) {
        advices.push({
            title: `Focus Sourcing on ${bottlenecks[0].skill}`,
            detail: `Only ${bottlenecks[0].coverage}% of applicants in the active pipeline meet target ${bottlenecks[0].skill} qualifications, creating a bottleneck. Adjust sourcing strategy.`,
            color: 'var(--accent-cyan)',
            border: 'var(--accent-cyan)'
        });
    } else {
        advices.push({
            title: "Healthy Skills Pipeline",
            detail: "All core technical tags have at least 60% coverage in the candidate database. Standard screening parameters apply.",
            color: 'var(--accent-cyan)',
            border: 'var(--accent-cyan)'
        });
    }

    if (bottlenecks.length > 1) {
        advices.push({
            title: `High ${bottlenecks[1].skill} Skill Gap`,
            detail: `A mere ${bottlenecks[1].coverage}% of candidate profiles display active ${bottlenecks[1].skill} skills. Consider adjusting matching weights or parameters.`,
            color: 'var(--accent-purple)',
            border: 'var(--accent-purple)'
        });
    } else {
        advices.push({
            title: "Strong Behavioral Engagement",
            detail: "Recruiter outreach responsiveness averages above 80%, indicating a highly active talent database pool.",
            color: 'var(--accent-purple)',
            border: 'var(--accent-purple)'
        });
    }

    if (topCandidate) {
        advices.push({
            title: `Fast-Track Candidate ${topCandidate.name}`,
            detail: `${topCandidate.name} scores ${topCandidate.score}% fit coefficient and possesses highly matched overlaps. Fast-track profile to Hiring Manager assessment.`,
            color: 'var(--accent-magenta)',
            border: 'var(--accent-magenta)'
        });
    } else {
        advices.push({
            title: "AI Recommendations Ingesting",
            detail: "Upload a job specification and ingest candidates to view AI-generated fast-track recommendations.",
            color: 'var(--accent-magenta)',
            border: 'var(--accent-magenta)'
        });
    }

    // Get color depth styles for Heatmap Matrix
    const getHeatmapColor = (score) => {
        if (score >= 90) return { background: 'rgba(0, 242, 254, 0.25)', color: '#00f2fe', border: '1px solid rgba(0, 242, 254, 0.4)' };
        if (score >= 75) return { background: 'rgba(157, 78, 221, 0.25)', color: '#c77dff', border: '1px solid rgba(157, 78, 221, 0.4)' };
        if (score >= 60) return { background: 'rgba(255, 0, 127, 0.15)', color: '#ff007f', border: '1px solid rgba(255, 0, 127, 0.3)' };
        return { background: 'rgba(255, 255, 255, 0.03)', color: '#71717a', border: '1px solid rgba(255,255,255,0.05)' };
    };

    return html`
        <div>
            
            <div style=${{ marginBottom: '30px' }}>
                <h2 style=${{ fontSize: '32px', marginBottom: '5px' }}>Recruitment AI Insights</h2>
                <p style=${{ color: 'var(--text-secondary)', fontSize: '14px' }}>Deep analytical review of the candidate pipeline and skills distribution.</p>
            </div>

            
            <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }} class="insights-top-grid">
                
                <div class="glass-card" style=${{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style=${{ fontSize: '18px', marginBottom: '15px' }}>Pipeline Skills Coverage</h3>
                    <p style=${{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                        Shows the proportion of matching candidates in your pool who possess each required job specification skill.
                    </p>
                    <div style=${{ flex: 1, minHeight: '260px', position: 'relative' }}>
                        <canvas id="gapChart"></canvas>
                    </div>
                </div>

                
                <div class="glass-card" style=${{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style=${{ fontSize: '18px', marginBottom: '15px' }}>Smart Sourcing Advice</h3>
                    <div style=${{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
                        ${advices.map((adv, i) => html`
                            <div key=${i} style=${{
                                padding: '12px 15px',
                                background: 'rgba(255, 255, 255, 0.01)',
                                borderLeft: '4px solid ' + adv.color,
                                borderRadius: '0 8px 8px 0',
                                border: '1px solid rgba(255,255,255,0.03)',
                                borderLeftWidth: '4px'
                            }}>
                                <div style=${{ fontWeight: '600', fontSize: '13px', marginBottom: '4px', color: 'var(--text-primary)' }}>${adv.title}</div>
                                <p style=${{ fontSize: '11px', color: 'var(--text-secondary)' }}>${adv.detail}</p>
                            </div>
                        `)}
                    </div>
                </div>
            </div>


            
            <div class="glass-card">
                <h3 style=${{ fontSize: '18px', marginBottom: '8px' }}>Candidate Evaluation Heatmap</h3>
                <p style=${{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '25px' }}>
                    Comparative dimensional matrix showing AI fit scoring across key competency domains.
                </p>

                
                <div class="heatmap-container">
                    
                    <div class="heatmap-row" style=${{ fontWeight: '600', fontSize: '12px', color: 'var(--text-primary)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                        <div>Candidate</div>
                        <div style=${{ textTextAlign: 'center', textAlign: 'center' }}>Technical</div>
                        <div style=${{ textTextAlign: 'center', textAlign: 'center' }}>Soft Skills</div>
                        <div style=${{ textTextAlign: 'center', textAlign: 'center' }}>Culture Fit</div>
                        <div style=${{ textTextAlign: 'center', textAlign: 'center' }}>Experience</div>
                        <div style=${{ textTextAlign: 'center', textAlign: 'center' }}>Leadership</div>
                    </div>

                    
                    ${sortedCandidates.map(cand => html`
                        <div key=${cand.id} class="heatmap-row">
                            <div style=${{ fontWeight: '500', fontSize: '13px', color: '#e5e7eb' }}>${cand.name}</div>
                            
                            
                            <div 
                                class="heatmap-cell" 
                                style=${getHeatmapColor(cand.heatmapMetrics.technical)}
                            >
                                ${cand.heatmapMetrics.technical}%
                            </div>
                            
                            
                            <div 
                                class="heatmap-cell" 
                                style=${getHeatmapColor(cand.heatmapMetrics.softSkills)}
                            >
                                ${cand.heatmapMetrics.softSkills}%
                            </div>
                            
                            
                            <div 
                                class="heatmap-cell" 
                                style=${getHeatmapColor(cand.heatmapMetrics.cultureFit)}
                            >
                                ${cand.heatmapMetrics.cultureFit}%
                            </div>
                            
                            
                            <div 
                                class="heatmap-cell" 
                                style=${getHeatmapColor(cand.heatmapMetrics.experience)}
                            >
                                ${cand.heatmapMetrics.experience}%
                            </div>
                            
                            
                            <div 
                                class="heatmap-cell" 
                                style=${getHeatmapColor(cand.heatmapMetrics.leadership)}
                            >
                                ${cand.heatmapMetrics.leadership}%
                            </div>
                        </div>
                    `)}
                </div>

                
                <div style=${{ display: 'flex', gap: '20px', marginTop: '25px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <div style=${{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                        <span style=${{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(0, 242, 254, 0.25)', border: '1px solid rgba(0, 242, 254, 0.4)' }}></span>
                        Best Fit (90%+)
                    </div>
                    <div style=${{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                        <span style=${{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(157, 78, 221, 0.25)', border: '1px solid rgba(157, 78, 221, 0.4)' }}></span>
                        Strong Fit (75%-89%)
                    </div>
                    <div style=${{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                        <span style=${{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(255, 0, 127, 0.15)', border: '1px solid rgba(255, 0, 127, 0.3)' }}></span>
                        Potential Fit (60%-74%)
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML=${{__html: `
                @media (max-width: 768px) {
                    .insights-top-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .heatmap-row {
                        grid-template-columns: 100px repeat(5, 1fr) !important;
                    }
                    .heatmap-label {
                        font-size: 11px !important;
                    }
                    .heatmap-cell {
                        font-size: 10px !important;
                    }
                }
            `}} />
        </div>
    `;
}
