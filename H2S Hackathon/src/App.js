import React, { useState, useEffect } from 'https://esm.sh/react@18.2.0';
import htm from 'https://esm.sh/htm@3.1.1';
import Sidebar from './components/Sidebar.js';
import LandingPage from './components/LandingPage.js';
import Dashboard from './components/Dashboard.js';
import JobUpload from './components/JobUpload.js';
import ResumeUpload from './components/ResumeUpload.js';
import CandidateRanking from './components/CandidateRanking.js';
import AIInsights from './components/AIInsights.js';
import CandidateModal from './components/CandidateModal.js';
import Toast from './components/Toast.js';
import { mockJobDescriptions } from './data/mockData.js';

const html = htm.bind(React.createElement);

export default function App() {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [currentJD, setCurrentJD] = useState(null);
    const [candidates, setCandidates] = useState([]); // Start Clean (0 candidates)
    const [shortlistedIds, setShortlistedIds] = useState([]); 
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [toasts, setToasts] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    
    // Custom match weights
    const [weights, setWeights] = useState({
        semantic: 40,
        assessment: 20,
        behavioral: 20,
        career: 20
    });

    const addToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3500);
    };

    const fetchRanking = async (jd, currentWeights, activeEmail = null) => {
        if (!jd) return;
        const emailToUse = activeEmail || (user && user.email);
        if (!emailToUse) return;

        try {
            const target_experience = jd.id === 'jd-1' ? 8 : (jd.id === 'jd-2' ? 7 : 6);
            const res = await fetch('/api/rank', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    skills: jd.skills || [],
                    weights: currentWeights,
                    target_experience,
                    email: emailToUse
                })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.status === 'success') {
                    setCandidates(data.candidates);
                }
            }
        } catch (e) {
            console.error("Error communicating with python backend.", e);
        }
    };

    const fetchUserCandidates = async (email, jd) => {
        try {
            const res = await fetch(`/api/candidates?email=${encodeURIComponent(email)}`);
            if (res.ok) {
                const data = await res.json();
                setCandidates(data);
                if (data.length > 0 && jd) {
                    fetchRanking(jd, weights, email);
                }
            }
        } catch (e) {
            console.error("Error loading recruiter candidates database", e);
        }
    };

    // Refetch rankings whenever job specification or matching weights are updated
    useEffect(() => {
        if (currentJD && isAuthenticated && user) {
            fetchRanking(currentJD, weights, user.email);
        }
    }, [currentJD, weights, isAuthenticated, user]);

    // Reset workspace candidates database and shortlist CSV when the user leaves/closes the site
    useEffect(() => {
        const handleReset = () => {
            if (user && user.email) {
                const url = '/api/reset';
                const payload = JSON.stringify({ email: user.email });
                if (navigator.sendBeacon) {
                    navigator.sendBeacon(url, new Blob([payload], { type: 'application/json' }));
                } else {
                    fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: payload,
                        keepalive: true
                    });
                }
            }
        };

        window.addEventListener('beforeunload', handleReset);
        window.addEventListener('pagehide', handleReset);

        return () => {
            window.removeEventListener('beforeunload', handleReset);
            window.removeEventListener('pagehide', handleReset);
        };
    }, [user]);

    const handleSuccessfulLogin = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
        const defaultJD = mockJobDescriptions[0];
        setCurrentJD(defaultJD);
        
        // Pre-fetch candidates specific to this user
        fetchUserCandidates(userData.email, defaultJD);
        
        setCurrentPage('dashboard');
        addToast(`Welcome back, ${userData.name || 'Recruiter'}! 🚀`, "success");
    };

    const toggleShortlist = (candId) => {
        const cand = candidates.find(c => c.id === candId);
        if (!cand) return;

        setShortlistedIds(prev => {
            if (prev.includes(candId)) {
                addToast(`Removed ${cand.name} from shortlist`, 'info');
                return prev.filter(id => id !== candId);
            } else {
                addToast(`Shortlisted ${cand.name}! 🚀`, 'success');
                return [...prev, candId];
            }
        });
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return html`<${Dashboard} 
                    candidates=${candidates}
                    shortlistedIds=${shortlistedIds}
                    onNavigate=${setCurrentPage}
                    addToast=${addToast}
                />`;
            case 'job-upload':
                return html`<${JobUpload} 
                    currentJD=${currentJD}
                    setCurrentJD=${setCurrentJD}
                    addToast=${addToast}
                    onNext=${() => setCurrentPage('resume-upload')}
                />`;
            case 'resume-upload':
                return html`<${ResumeUpload} 
                    candidates=${candidates}
                    setCandidates=${setCandidates}
                    userEmail=${user ? user.email : ''}
                    addToast=${addToast}
                    onNext=${() => setCurrentPage('ranking')}
                    onTriggerRanking=${() => fetchRanking(currentJD, weights, user ? user.email : '')}
                />`;
            case 'ranking':
                return html`<${CandidateRanking} 
                    candidates=${candidates}
                    shortlistedIds=${shortlistedIds}
                    toggleShortlist=${toggleShortlist}
                    onSelectCandidate=${setSelectedCandidate}
                    weights=${weights}
                    setWeights=${setWeights}
                    addToast=${addToast}
                />`;
            case 'insights':
                return html`<${AIInsights} 
                    candidates=${candidates}
                />`;
            default:
                return html`<${Dashboard} 
                    candidates=${candidates}
                    shortlistedIds=${shortlistedIds}
                    onNavigate=${setCurrentPage}
                    addToast=${addToast}
                />`;
        }
    };

    // If NOT authenticated, render full screen secure Login / Signup Portal
    if (!isAuthenticated) {
        return html`
            <div class="landing-container">
                <${LandingPage} onLogin=${handleSuccessfulLogin} />
                <${Toast} toasts=${toasts} />
            </div>
        `;
    }

    return html`
        <div class="app-container">
            <${Sidebar} 
                currentPage=${currentPage} 
                setCurrentPage=${setCurrentPage} 
                collapsed=${sidebarCollapsed}
                setCollapsed=${setSidebarCollapsed}
                user=${user}
                onLogout=${async () => {
                    if (user && user.email) {
                        try {
                            await fetch('/api/reset', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ email: user.email })
                            });
                        } catch (e) {
                            console.error("Error resetting workspace:", e);
                        }
                    }
                    setIsAuthenticated(false);
                    setUser(null);
                    setCandidates([]);
                    setShortlistedIds([]);
                    setCurrentJD(null);
                    addToast("Logged out of session and workspace reset", "info");
                }}
            />
            
            <main class="main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}">
                ${renderPage()}
            </main>

            ${selectedCandidate && html`<${CandidateModal} 
                candidate=${selectedCandidate} 
                isShortlisted=${shortlistedIds.includes(selectedCandidate.id)}
                onClose=${() => setSelectedCandidate(null)} 
                toggleShortlist=${toggleShortlist}
                activeWeights=${weights}
            />`}

            <${Toast} toasts=${toasts} />
        </div>
    `;
}
