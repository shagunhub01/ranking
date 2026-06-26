import React, { useEffect, useRef } from 'https://esm.sh/react@18.2.0';
import htm from 'https://esm.sh/htm@3.1.1';
import { mockDashboardStats, mockWeeklyUploads } from '../data/mockData.js';

const html = htm.bind(React.createElement);

export default function Dashboard({ candidates, shortlistedIds, onNavigate, addToast }) {
    const chartRef = useRef(null);

    // Calculate dynamic stats
    const dynamicTotal = candidates.length + 137; // Base offset for styling
    const topMatchesCount = candidates.filter(c => c.score >= 85).length;
    const averageScore = Math.round(candidates.reduce((acc, c) => acc + c.score, 0) / candidates.length);

    useEffect(() => {
        if (!chartRef.current) return;

        const ctx = chartRef.current.getContext('2d');
        
        // Create custom gradient for line fill
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(0, 242, 254, 0.25)');
        gradient.addColorStop(1, 'rgba(157, 78, 221, 0.01)');

        const data = {
            labels: mockWeeklyUploads.map(d => d.label),
            datasets: [{
                label: 'Resumes Scanned',
                data: mockWeeklyUploads.map(d => d.count),
                borderColor: '#00f2fe',
                borderWidth: 3,
                pointBackgroundColor: '#9d4edd',
                pointBorderColor: '#00f2fe',
                pointHoverRadius: 7,
                pointRadius: 4,
                backgroundColor: gradient,
                fill: true,
                tension: 0.4
            }]
        };

        const config = {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(12, 10, 31, 0.95)',
                        titleFont: { family: 'Outfit', size: 13 },
                        bodyFont: { family: 'Inter', size: 12 },
                        borderColor: 'rgba(0, 242, 254, 0.2)',
                        borderWidth: 1,
                        displayColors: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.03)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#a1a1aa',
                            font: { family: 'Inter', size: 11 }
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.03)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#a1a1aa',
                            font: { family: 'Inter', size: 11 }
                        }
                    }
                }
            }
        };

        const chart = new Chart(ctx, config);

        return () => {
            chart.destroy();
        };
    }, []);

    // Get candidate match cards list
    const topCandidates = [...candidates]
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

    return html`
        <div>
            
            <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h2 style=${{ fontSize: '32px', marginBottom: '5px' }}>Recruitment Workspace</h2>
                    <p style=${{ color: 'var(--text-secondary)', fontSize: '14px' }}>Welcome back. Here is the AI matching progress overview.</p>
                </div>
                <div style=${{ display: 'flex', gap: '12px' }}>
                    <button class="btn btn-secondary" onClick=${() => {
                        addToast("Refreshing data logs...", "info");
                    }}>
                        <i class="fa-solid fa-rotate"></i> Sync Data
                    </button>
                    <button class="btn btn-primary" onClick=${() => onNavigate('resume-upload')}>
                        <i class="fa-solid fa-file-arrow-up"></i> Upload Resumes
                    </button>
                </div>
            </div>

            
            <div class="dashboard-grid">
                <div class="glass-card stat-card">
                    <div class="stat-icon cyan">
                        <i class="fa-solid fa-users"></i>
                    </div>
                    <div class="stat-info">
                        <div class="stat-value">${dynamicTotal}</div>
                        <div class="stat-label">Total Candidates</div>
                        <div class="stat-trend positive">
                            <i class="fa-solid fa-arrow-trend-up"></i> +12% this wk
                        </div>
                    </div>
                </div>

                <div class="glass-card stat-card">
                    <div class="stat-icon purple">
                        <i class="fa-solid fa-circle-check"></i>
                    </div>
                    <div class="stat-info">
                        <div class="stat-value">${topMatchesCount}</div>
                        <div class="stat-label">Top Matches</div>
                        <div class="stat-trend positive">
                            <i class="fa-solid fa-arrow-trend-up"></i> 85%+ Match
                        </div>
                    </div>
                </div>

                <div class="glass-card stat-card">
                    <div class="stat-icon magenta">
                        <i class="fa-solid fa-bolt"></i>
                    </div>
                    <div class="stat-info">
                        <div class="stat-value">${averageScore}%</div>
                        <div class="stat-label">Average Match Score</div>
                        <div class="stat-trend positive" style=${{ background: 'rgba(0, 242, 254, 0.08)', color: 'var(--accent-cyan)' }}>
                            High Quality
                        </div>
                    </div>
                </div>

                <div class="glass-card stat-card">
                    <div class="stat-icon cyan" style=${{ color: 'var(--accent-purple)', borderColor: 'rgba(157,78,221,0.2)' }}>
                        <i class="fa-solid fa-file-pdf"></i>
                    </div>
                    <div class="stat-info">
                        <div class="stat-value">${mockDashboardStats.uploadedResumes}</div>
                        <div class="stat-label">Uploaded Resumes</div>
                        <div class="stat-trend positive" style=${{ background: 'rgba(0, 255, 136, 0.08)', color: 'var(--accent-green)' }}>
                            Processed
                        </div>
                    </div>
                </div>
            </div>

            
            <div class="charts-grid">
                
                <div class="glass-card" style=${{ display: 'flex', flexDirection: 'column' }}>
                    <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style=${{ fontSize: '18px' }}>Resume Sourcing Velocity</h3>
                        <span style=${{ fontSize: '12px', color: 'var(--text-muted)' }}>Last 7 Days</span>
                    </div>
                    <div style=${{ flex: 1, minHeight: '260px', position: 'relative' }}>
                        <canvas ref=${chartRef}></canvas>
                    </div>
                </div>

                
                <div class="glass-card" style=${{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style=${{ fontSize: '18px', marginBottom: '15px' }}>Current Shortlist</h3>
                    <div style=${{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                        ${shortlistedIds.length === 0 ? html`
                            <div style=${{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text-muted)', fontSize: '13px' }}>
                                <i class="fa-solid fa-user-minus" style=${{ fontSize: '24px', marginBottom: '8px' }}></i>
                                No candidates shortlisted yet.
                            </div>
                        ` : shortlistedIds.map(id => {
                            const cand = candidates.find(c => c.id === id);
                            if (!cand) return null;
                            return html`
                                <div key=${cand.id} style=${{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '10px 12px',
                                    background: 'rgba(255,255,255,0.02)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    borderRadius: '8px'
                                }}>
                                    <div style=${{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        color: 'var(--bg-deep)'
                                    }}>
                                        ${cand.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div style=${{ flex: 1, overflow: 'hidden' }}>
                                        <div style=${{ fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>${cand.name}</div>
                                        <div style=${{ fontSize: '11px', color: 'var(--text-cyan)', fontWeight: '600' }}>Score: ${cand.score}%</div>
                                    </div>
                                    <i class="fa-solid fa-circle-check" style=${{ color: 'var(--accent-green)', fontSize: '16px' }}></i>
                                </div>
                            `;
                        })}
                        <button class="btn btn-secondary" style=${{ width: '100%', marginTop: 'auto', padding: '8px', fontSize: '12px' }} onClick=${() => onNavigate('ranking')}>
                            Go to Leaderboard <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>

            
            <div class="glass-card">
                <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style=${{ fontSize: '18px' }}>Top AI-Recommended Matches</h3>
                    <button class="btn btn-secondary" style=${{ padding: '6px 12px', fontSize: '12px' }} onClick=${() => onNavigate('ranking')}>
                        View All
                    </button>
                </div>
                <div style=${{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    ${topCandidates.map(cand => html`
                        <div key=${cand.id} style=${{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 18px',
                            background: 'rgba(255,255,255,0.01)',
                            border: '1px solid rgba(255,255,255,0.04)',
                            borderRadius: '10px',
                            transition: 'all var(--transition-fast)'
                        }} class="dashboard-row">
                            <div style=${{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style=${{
                                    width: '38px',
                                    height: '38px',
                                    borderRadius: '50%',
                                    background: 'rgba(157, 78, 221, 0.1)',
                                    border: '1px solid rgba(157, 78, 221, 0.25)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '700',
                                    color: 'var(--text-purple)'
                                }}>
                                    ${cand.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <div style=${{ fontSize: '14px', fontWeight: '600' }}>${cand.name}</div>
                                    <div style=${{ fontSize: '12px', color: 'var(--text-secondary)' }}>${cand.title} • ${cand.experience} yrs exp</div>
                                </div>
                            </div>
                            <div style=${{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style=${{ textAlign: 'right' }}>
                                    <div class="score-meter-mini">
                                        <span class="score-text">${cand.score}%</span>
                                    </div>
                                    <div style=${{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Match Rate</div>
                                </div>
                                <span style=${{
                                    padding: '4px 10px',
                                    borderRadius: '20px',
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    background: cand.score >= 90 ? 'rgba(0, 255, 136, 0.1)' : 'rgba(0, 242, 254, 0.1)',
                                    color: cand.score >= 90 ? 'var(--accent-green)' : 'var(--accent-cyan)',
                                    border: cand.score >= 90 ? '1px solid rgba(0,255,136,0.2)' : '1px solid rgba(0,242,254,0.2)'
                                }}>
                                    ${cand.matchLevel}
                                </span>
                            </div>
                        </div>
                    `)}
                </div>
            </div>

            
            <style dangerouslySetInnerHTML=${{__html: `
                .dashboard-row:hover {
                    background: rgba(255,255,255,0.03) !important;
                    border-color: rgba(0,242,254,0.15) !important;
                    transform: translateX(4px);
                }
            `}} />
        </div>
    `;
}
