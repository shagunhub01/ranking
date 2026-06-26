import React, { useState } from 'https://esm.sh/react@18.2.0';
import htm from 'https://esm.sh/htm@3.1.1';

const html = htm.bind(React.createElement);

export default function CandidateRanking({ candidates, shortlistedIds, toggleShortlist, onSelectCandidate, weights, setWeights, addToast }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("score-desc");
    const [filterTier, setFilterTier] = useState("all");

    // Filter and Sort candidate lists
    const filteredCandidates = candidates
        .filter(cand => {
            const matchesSearch = cand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cand.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (cand.matchedSkills && cand.matchedSkills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())));
            
            if (filterTier === "all") return matchesSearch;
            if (filterTier === "best") return matchesSearch && cand.score >= 88;
            if (filterTier === "strong") return matchesSearch && cand.score >= 74 && cand.score < 88;
            if (filterTier === "potential") return matchesSearch && cand.score >= 60 && cand.score < 74;
            if (filterTier === "shortlisted") return matchesSearch && shortlistedIds.includes(cand.id);
            return matchesSearch;
        })
        .sort((a, b) => {
            if (sortBy === "score-desc") return b.score - a.score;
            if (sortBy === "score-asc") return a.score - b.score;
            if (sortBy === "exp-desc") return b.experience - a.experience;
            if (sortBy === "name-asc") return a.name.localeCompare(b.name);
            return 0;
        });

    const getRankBadgeClass = (score) => {
        if (score >= 88) return 'rank-1';
        if (score >= 74) return 'rank-2';
        if (score >= 60) return 'rank-3';
        return 'rank-normal';
    };

    const getRankIcon = (score) => {
        if (score >= 88) return '🥇';
        if (score >= 74) return '🥈';
        if (score >= 60) return '🥉';
        return '•';
    };

    const handleWeightChange = (key, value) => {
        const val = parseInt(value, 10);
        if (setWeights) {
            setWeights(prev => ({
                ...prev,
                [key]: val
            }));
        }
    };

    const handleExportCSV = () => {
        if (addToast) {
            addToast("Generating pre-formatted CSV shortlist on filesystem...", "info");
        }
        
        // Open file in new tab or trigger browser save
        const link = document.createElement('a');
        link.href = '/ranked_shortlist.csv';
        link.download = 'ranked_shortlist.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        if (addToast) {
            setTimeout(() => {
                addToast("CSV shortlist downloaded successfully! 🚀", "success");
            }, 1000);
        }
    };

    return html`
        <div>
            
            <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h2 style=${{ fontSize: '32px', marginBottom: '5px' }}>Talent Leaderboard</h2>
                    <p style=${{ color: 'var(--text-secondary)', fontSize: '14px' }}>AI-generated matching leaderboard sorting applicants based on specifications.</p>
                </div>
                <button class="btn btn-primary" onClick=${handleExportCSV} style=${{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', fontSize: '14px' }}>
                    <i class="fa-solid fa-file-csv" style=${{ fontSize: '16px' }}></i> Export Predefined CSV
                </button>
            </div>

            
            ${weights && html`
                <div class="glass-card" style=${{ marginBottom: '30px', padding: '20px' }}>
                    <h3 style=${{ fontSize: '16px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i class="fa-solid fa-sliders" style=${{ color: 'var(--accent-cyan)' }}></i>
                        Interactive Matching Weights Calibration
                    </h3>
                    <p style=${{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '20px' }}>
                        Tune target focus coefficients in real-time. Candidate scores are recomputed live and the export shortlist file is updated automatically.
                    </p>
                    <div style=${{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <div>
                            <div style=${{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                                <span style=${{ fontWeight: '600', color: 'var(--text-primary)' }}>Semantic Stack Fit</span>
                                <span style=${{ color: 'var(--accent-cyan)', fontWeight: '600' }}>${weights.semantic}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" max="100" 
                                value=${weights.semantic} 
                                onChange=${(e) => handleWeightChange('semantic', e.target.value)}
                                style=${{ width: '100%', accentColor: 'var(--accent-cyan)' }}
                            />
                        </div>
                        <div>
                            <div style=${{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                                <span style=${{ fontWeight: '600', color: 'var(--text-primary)' }}>Coding Assessment</span>
                                <span style=${{ color: 'var(--accent-purple)', fontWeight: '600' }}>${weights.assessment}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" max="100" 
                                value=${weights.assessment} 
                                onChange=${(e) => handleWeightChange('assessment', e.target.value)}
                                style=${{ width: '100%', accentColor: 'var(--accent-purple)' }}
                            />
                        </div>
                        <div>
                            <div style=${{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                                <span style=${{ fontWeight: '600', color: 'var(--text-primary)' }}>Behavioral Intent</span>
                                <span style=${{ color: 'var(--accent-magenta)', fontWeight: '600' }}>${weights.behavioral}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" max="100" 
                                value=${weights.behavioral} 
                                onChange=${(e) => handleWeightChange('behavioral', e.target.value)}
                                style=${{ width: '100%', accentColor: 'var(--accent-magenta)' }}
                            />
                        </div>
                        <div>
                            <div style=${{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                                <span style=${{ fontWeight: '600', color: 'var(--text-primary)' }}>Tenure & Stability</span>
                                <span style=${{ color: 'var(--accent-green)', fontWeight: '600' }}>${weights.career}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" max="100" 
                                value=${weights.career} 
                                onChange=${(e) => handleWeightChange('career', e.target.value)}
                                style=${{ width: '100%', accentColor: 'var(--accent-green)' }}
                            />
                        </div>
                    </div>
                </div>
            `}

            
            <div class="search-bar-wrapper">
                <div class="search-input-container">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input 
                        type="text" 
                        class="search-input" 
                        placeholder="Search by candidate name, title, or skills..." 
                        value=${searchTerm}
                        onChange=${(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select 
                    class="filter-select" 
                    value=${filterTier}
                    onChange=${(e) => setFilterTier(e.target.value)}
                >
                    <option value="all">All Match Levels</option>
                    <option value="best">🥇 Best Matches (88%+)</option>
                    <option value="strong">🥈 Strong Matches (74%-87%)</option>
                    <option value="potential">🥉 Potential Matches (60%-73%)</option>
                    <option value="shortlisted">⭐ Shortlisted Only</option>
                </select>

                <select 
                    class="filter-select" 
                    value=${sortBy}
                    onChange=${(e) => setSortBy(e.target.value)}
                >
                    <option value="score-desc">Sort: Highest Match Score</option>
                    <option value="score-asc">Sort: Lowest Match Score</option>
                    <option value="exp-desc">Sort: Years of Experience</option>
                    <option value="name-asc">Sort: Alphabetical (A-Z)</option>
                </select>
            </div>

            
            <div class="candidate-list">
                ${filteredCandidates.length === 0 ? html`
                    <div class="glass-card" style=${{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-secondary)' }}>
                        <i class="fa-solid fa-folder-open" style=${{ fontSize: '36px', color: 'var(--accent-purple)', marginBottom: '15px' }}></i>
                        <h4>No Candidates Found</h4>
                        <p style=${{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '5px' }}>Try adjusting your filters or importing more resumes.</p>
                    </div>
                ` : filteredCandidates.map((cand, index) => {
                    const isShortlisted = shortlistedIds.includes(cand.id);
                    return html`
                        <div 
                            key=${cand.id} 
                            class="glass-card candidate-card neon-cyan-hover"
                            style=${{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                            onClick=${() => onSelectCandidate(cand)}
                        >
                            
                            <div class="ranking-badge ${getRankBadgeClass(cand.score)}" style=${{ margin: '0 auto' }}>
                                ${getRankIcon(cand.score)}
                            </div>

                            
                            <div>
                                <h4 style=${{ fontSize: '16px', fontWeight: '700', marginBottom: '3px' }}>${cand.name}</h4>
                                <div style=${{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>${cand.title}</div>
                                ${cand.behavioralSignals && html`
                                    <div style=${{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '6px' }}>
                                        ${cand.behavioralSignals.assessmentScore >= 90 && html`
                                            <span class="skill-tag" style=${{ background: 'rgba(0, 255, 136, 0.05)', color: 'var(--accent-green)', borderColor: 'rgba(0,255,136,0.15)', fontSize: '8px', padding: '1px 5px', borderRadius: '4px', textTransform: 'uppercase' }}>
                                                🏆 Code Champ
                                            </span>
                                        `}
                                        ${cand.behavioralSignals.responsiveness >= 90 && html`
                                            <span class="skill-tag" style=${{ background: 'rgba(0, 242, 254, 0.05)', color: 'var(--accent-cyan)', borderColor: 'rgba(0,242,254,0.15)', fontSize: '8px', padding: '1px 5px', borderRadius: '4px', textTransform: 'uppercase' }}>
                                                ⚡ Responsive
                                            </span>
                                        `}
                                        ${cand.behavioralSignals.searchIntent === "Active" && html`
                                            <span class="skill-tag" style=${{ background: 'rgba(255, 0, 127, 0.05)', color: 'var(--accent-magenta)', borderColor: 'rgba(255,0,127,0.15)', fontSize: '8px', padding: '1px 5px', borderRadius: '4px', textTransform: 'uppercase' }}>
                                                🚀 Active
                                            </span>
                                        `}
                                    </div>
                                `}
                            </div>

                            
                            <div style=${{ display: 'flex', flexWrap: 'wrap', gap: '5px' }} class="skills-cell">
                                ${(cand.matchedSkills || cand.skills || []).slice(0, 3).map(skill => html`
                                    <span key=${skill} class="skill-tag" style=${{ padding: '2px 8px', fontSize: '10px', background: 'rgba(0, 242, 254, 0.05)', color: 'var(--text-cyan)', borderColor: 'rgba(0,242,254,0.15)' }}>
                                        ${skill}
                                    </span>
                                `)}
                                ${(cand.matchedSkills || cand.skills || []).length > 3 && html`
                                    <span class="skill-tag" style=${{ padding: '2px 8px', fontSize: '10px' }}>
                                        +${(cand.matchedSkills || cand.skills || []).length - 3}
                                    </span>
                                `}
                            </div>

                            
                            <div style=${{ fontSize: '13px' }} class="experience-cell">
                                <div><strong>${cand.experience} Years</strong></div>
                                <div style=${{ fontSize: '11px', color: 'var(--text-muted)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '160px' }}>
                                    ${cand.education.split(' - ')[1] || cand.education}
                                </div>
                            </div>

                            
                            <div style=${{ textAlign: 'center' }} class="score-cell">
                                <div class="score-meter-mini">
                                    <span class="score-text">${cand.score}%</span>
                                </div>
                                <div style=${{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Match
                                </div>
                            </div>

                            
                            <div style=${{ display: 'flex', gap: '8px', justifyContent: 'center' }} onClick=${(e) => e.stopPropagation()}>
                                <button 
                                    class="btn ${isShortlisted ? 'btn-accent' : 'btn-secondary'}" 
                                    style=${{ padding: '8px 12px', fontSize: '12px' }}
                                    onClick=${() => toggleShortlist(cand.id)}
                                    title=${isShortlisted ? 'Remove shortlist' : 'Add to shortlist'}
                                >
                                    <i class="fa-${isShortlisted ? 'solid' : 'regular'} fa-star"></i>
                                </button>
                                <button 
                                    class="btn btn-primary" 
                                    style=${{ padding: '8px 12px', fontSize: '12px' }}
                                    onClick=${() => onSelectCandidate(cand)}
                                >
                                    Details
                                </button>
                            </div>
                        </div>
                    `;
                })}
            </div>

            
            <style dangerouslySetInnerHTML=${{__html: `
                @media (max-width: 900px) {
                    .skills-cell, .experience-cell, .score-cell {
                        display: none !important;
                    }
                    .candidate-card {
                        grid-template-columns: 50px 1fr 120px !important;
                    }
                }
            `}} />
        </div>
    `;
}
