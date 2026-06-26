import React, { useState } from 'https://esm.sh/react@18.2.0';
import htm from 'https://esm.sh/htm@3.1.1';

const html = htm.bind(React.createElement);

export default function LandingPage({ onLogin }) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [username, setUsername] = useState('recruiter@talentiq.ai');
    const [password, setPassword] = useState('admin123');
    const [name, setName] = useState('');
    const [company, setCompany] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');
        setLoading(true);
        
        if (isSignUp) {
            // HR Registration Flow
            try {
                const res = await fetch('/api/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: username.trim(),
                        password,
                        name: name.trim(),
                        company: company.trim()
                    })
                });
                const data = await res.json();
                if (res.ok && data.status === 'success') {
                    setSuccessMsg("Account created successfully! Please Sign In below.");
                    setIsSignUp(false);
                    setName('');
                    setCompany('');
                    setPassword('');
                } else {
                    setErrorMsg(data.error || "Signup failed. Try again.");
                }
            } catch (err) {
                setErrorMsg("Server communication error. Please try again.");
            } finally {
                setLoading(false);
            }
        } else {
            // HR Login Flow
            try {
                const res = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: username.trim(),
                        password
                    })
                });
                const data = await res.json();
                if (res.ok && data.status === 'success') {
                    if (onLogin) {
                        onLogin(data.user);
                    }
                } else {
                    setErrorMsg(data.error || "Invalid credentials. Use system default credentials or sign up.");
                }
            } catch (err) {
                setErrorMsg("Server communication error. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    return html`
        <div style=${{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '40px 20px',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1
        }}>
            
            <header style=${{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '25px 50px',
                zIndex: 10
            }}>
                <div style=${{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div class="logo-icon" style=${{ width: '36px', height: '36px', fontSize: '18px' }}>
                        <i class="fa-solid fa-bolt"></i>
                    </div>
                    <span style=${{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: '800',
                        fontSize: '22px',
                        background: 'linear-gradient(to right, var(--accent-cyan), var(--accent-purple))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>SkillMatch</span>
                </div>
                <div style=${{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
                    SECURE HR PORTAL v2.0
                </div>
            </header>

            <div style=${{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: '50px',
                maxWidth: '1200px',
                width: '100%',
                alignItems: 'center',
                marginTop: '60px',
                textAlign: 'left'
            }} class="hero-grid">
                
                <div>
                    <div style=${{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(157, 78, 221, 0.08)',
                        border: '1px solid rgba(157, 78, 221, 0.25)',
                        color: 'var(--text-purple)',
                        padding: '6px 14px',
                        borderRadius: '30px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '20px'
                    }}>
                        <i class="fa-solid fa-lock"></i> Recruiter Registration & Entry
                    </div>

                    <h1 style=${{
                        fontSize: '44px',
                        lineHeight: '1.15',
                        fontWeight: '800',
                        marginBottom: '15px',
                        background: 'linear-gradient(to right, #ffffff, #d8b4fe, #a5f3fc)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        AI-Powered Predictive Ranking Brain
                    </h1>

                    <p style=${{
                        fontSize: '14px',
                        color: 'var(--text-secondary)',
                        marginBottom: '25px',
                        lineHeight: '1.6',
                        maxWidth: '480px'
                    }}>
                        Welcome to SkillMatch. Log in with your corporate recruiter credentials, or register a new HR workspace account to upload and rank resumes.
                    </p>

                    <form onSubmit=${handleSubmit} class="glass-card" style=${{
                        padding: '30px',
                        maxWidth: '440px',
                        border: '1px solid var(--glass-border)',
                        background: 'rgba(15, 12, 38, 0.6)',
                        boxShadow: 'var(--glass-shadow)',
                        borderRadius: '16px'
                    }}>
                        
                        <div style=${{ display: 'flex', borderBottom: '1px solid var(--glass-border)', marginBottom: '20px' }}>
                            <button 
                                type="button" 
                                onClick=${() => { setIsSignUp(false); setErrorMsg(''); setSuccessMsg(''); }}
                                style=${{
                                    flex: 1,
                                    padding: '10px',
                                    background: 'none',
                                    border: 'none',
                                    borderBottom: !isSignUp ? '2px solid var(--accent-cyan)' : 'none',
                                    color: !isSignUp ? 'var(--text-primary)' : 'var(--text-muted)',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    outline: 'none'
                                }}
                            >Sign In</button>
                            <button 
                                type="button" 
                                onClick=${() => { setIsSignUp(true); setErrorMsg(''); setSuccessMsg(''); }}
                                style=${{
                                    flex: 1,
                                    padding: '10px',
                                    background: 'none',
                                    border: 'none',
                                    borderBottom: isSignUp ? '2px solid var(--accent-purple)' : 'none',
                                    color: isSignUp ? 'var(--text-primary)' : 'var(--text-muted)',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    outline: 'none'
                                }}
                            >Sign Up</button>
                        </div>

                        ${errorMsg && html`
                            <div style=${{
                                padding: '10px 15px',
                                background: 'rgba(255, 0, 127, 0.1)',
                                border: '1px solid rgba(255, 0, 127, 0.25)',
                                color: 'var(--accent-magenta)',
                                fontSize: '12px',
                                borderRadius: '8px',
                                marginBottom: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <i class="fa-solid fa-circle-exclamation"></i>
                                <span>${errorMsg}</span>
                            </div>
                        `}

                        ${successMsg && html`
                            <div style=${{
                                padding: '10px 15px',
                                background: 'rgba(0, 255, 136, 0.1)',
                                border: '1px solid rgba(0, 255, 136, 0.25)',
                                color: 'var(--accent-green)',
                                fontSize: '12px',
                                borderRadius: '8px',
                                marginBottom: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <i class="fa-solid fa-circle-check"></i>
                                <span>${successMsg}</span>
                            </div>
                        `}

                        ${isSignUp && html`
                            <div style=${{ marginBottom: '15px' }}>
                                <label style=${{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: '600' }}>
                                    Full Name
                                </label>
                                <input 
                                    type="text" 
                                    required
                                    value=${name}
                                    onChange=${(e) => setName(e.target.value)}
                                    placeholder="e.g. Sarah Jenkins"
                                    style=${{
                                        width: '100%',
                                        background: 'rgba(255,255,255,0.02)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '8px',
                                        padding: '10px 12px',
                                        color: 'var(--text-primary)',
                                        fontFamily: 'var(--font-body)',
                                        fontSize: '13px',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            <div style=${{ marginBottom: '15px' }}>
                                <label style=${{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: '600' }}>
                                    Company Name
                                </label>
                                <input 
                                    type="text" 
                                    value=${company}
                                    onChange=${(e) => setCompany(e.target.value)}
                                    placeholder="e.g. Google"
                                    style=${{
                                        width: '100%',
                                        background: 'rgba(255,255,255,0.02)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '8px',
                                        padding: '10px 12px',
                                        color: 'var(--text-primary)',
                                        fontFamily: 'var(--font-body)',
                                        fontSize: '13px',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                        `}

                        <div style=${{ marginBottom: '15px' }}>
                            <label style=${{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: '600' }}>
                                Corporate Email
                            </label>
                            <input 
                                type="email" 
                                required
                                value=${username}
                                onChange=${(e) => setUsername(e.target.value)}
                                placeholder="email@company.com"
                                style=${{
                                    width: '100%',
                                    background: 'rgba(255,255,255,0.02)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '8px',
                                    padding: '10px 12px',
                                    color: 'var(--text-primary)',
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '13px',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        <div style=${{ marginBottom: '20px' }}>
                            <label style=${{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: '600' }}>
                                Access Password
                            </label>
                            <input 
                                type="password" 
                                required
                                value=${password}
                                onChange=${(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style=${{
                                    width: '100%',
                                    background: 'rgba(255,255,255,0.02)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '8px',
                                    padding: '10px 12px',
                                    color: 'var(--text-primary)',
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '13px',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        <button 
                            type="submit" 
                            class="btn btn-primary" 
                            disabled=${loading}
                            style=${{ width: '100%', padding: '12px', fontSize: '14px', fontWeight: '600' }}
                        >
                            <i class=${loading ? "fa-solid fa-spinner fa-spin" : isSignUp ? "fa-solid fa-user-plus" : "fa-solid fa-unlock-keyhole"} style=${{ marginRight: '8px' }}></i> 
                            ${loading ? "Loading..." : isSignUp ? "Create Recruiter Account" : "Enter Recruitment Portal"}
                        </button>
                        
                        <div style=${{ marginTop: '15px', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
                            System Default: <span style=${{ color: 'var(--accent-cyan)' }}>recruiter@talentiq.ai</span> / <span style=${{ color: 'var(--accent-cyan)' }}>admin123</span>
                        </div>
                    </form>
                </div>

                <div style=${{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                    <div class="glass-card" style=${{
                        width: '100%',
                        maxWidth: '460px',
                        height: '460px',
                        borderRadius: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '10px',
                        background: 'rgba(15, 12, 38, 0.35)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,242,254,0.05)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        
                        <div class="rotating-ring ring-1"></div>
                        <div class="rotating-ring ring-2"></div>
                        
                        <svg width="400" height="400" viewBox="0 0 400 400" style=${{ zIndex: 2 }}>
                            <defs>
                                <linearGradient id="cyan-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stop-color="var(--accent-cyan)" />
                                    <stop offset="100%" stop-color="var(--accent-purple)" />
                                </linearGradient>
                                <linearGradient id="purple-magenta" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stop-color="var(--accent-purple)" />
                                    <stop offset="100%" stop-color="var(--accent-magenta)" />
                                </linearGradient>
                                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="4" result="blur" />
                                    <feMerge>
                                        <feMergeNode in="blur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

                            <g stroke="rgba(157, 78, 221, 0.15)" stroke-width="1.5">
                                <line x1="200" y1="200" x2="80" y2="120" />
                                <line x1="200" y1="200" x2="320" y2="120" />
                                <line x1="200" y1="200" x2="80" y2="280" />
                                <line x1="200" y1="200" x2="320" y2="280" />
                                <line x1="200" y1="200" x2="200" y2="60" />
                                <line x1="200" y1="200" x2="200" y2="340" />

                                <line x1="80" y1="120" x2="200" y2="60" />
                                <line x1="320" y1="120" x2="200" y2="60" />
                                <line x1="80" y1="280" x2="200" y2="340" />
                                <line x1="320" y1="280" x2="200" y2="340" />
                                <line x1="80" y1="120" x2="80" y2="280" />
                                <line x1="320" y1="120" x2="320" y2="280" />
                            </g>

                            <circle r="4" fill="var(--accent-cyan)" filter="url(#glow)">
                                <animateMotion dur="4s" repeatCount="indefinite" path="M 200,200 L 80,120" />
                            </circle>
                            <circle r="4" fill="var(--accent-magenta)" filter="url(#glow)">
                                <animateMotion dur="5s" repeatCount="indefinite" path="M 320,280 L 200,200" />
                            </circle>
                            <circle r="4" fill="var(--accent-purple)" filter="url(#glow)">
                                <animateMotion dur="6s" repeatCount="indefinite" path="M 200,60 L 320,120" />
                            </circle>

                            <circle cx="200" cy="200" r="28" fill="url(#cyan-purple)" filter="url(#glow)" style=${{ animation: 'pulseCore 4s infinite alternate' }} />
                            <text x="200" y="205" font-family="Outfit" font-size="12" font-weight="700" fill="var(--bg-deep)" text-anchor="middle">AI</text>

                            <circle cx="80" cy="120" r="14" fill="rgba(10, 8, 25, 0.9)" stroke="var(--accent-cyan)" stroke-width="2" filter="url(#glow)" />
                            <circle cx="320" cy="120" r="14" fill="rgba(10, 8, 25, 0.9)" stroke="var(--accent-purple)" stroke-width="2" filter="url(#glow)" />
                            <circle cx="80" cy="280" r="14" fill="rgba(10, 8, 25, 0.9)" stroke="var(--accent-magenta)" stroke-width="2" filter="url(#glow)" />
                            <circle cx="320" cy="280" r="14" fill="rgba(10, 8, 25, 0.9)" stroke="var(--accent-cyan)" stroke-width="2" filter="url(#glow)" />
                            
                            <circle cx="200" cy="60" r="16" fill="rgba(10, 8, 25, 0.9)" stroke="var(--accent-purple)" stroke-width="2" filter="url(#glow)" />
                            <circle cx="200" cy="340" r="16" fill="rgba(10, 8, 25, 0.9)" stroke="var(--accent-magenta)" stroke-width="2" filter="url(#glow)" />

                            <text x="80" y="124" font-family="FontAwesome" font-size="12" fill="var(--accent-cyan)" text-anchor="middle">&#xf121;</text> 
                            <text x="320" y="124" font-family="FontAwesome" font-size="12" fill="var(--accent-purple)" text-anchor="middle">&#xf560;</text> 
                            <text x="80" y="284" font-family="FontAwesome" font-size="12" fill="var(--accent-magenta)" text-anchor="middle">&#xf15c;</text> 
                            <text x="320" y="284" font-family="FontAwesome" font-size="12" fill="var(--accent-cyan)" text-anchor="middle">&#xf00c;</text> 
                            <text x="200" y="64" font-family="FontAwesome" font-size="12" fill="var(--accent-purple)" text-anchor="middle">&#xf0c2;</text> 
                            <text x="200" y="344" font-family="FontAwesome" font-size="12" fill="var(--accent-magenta)" text-anchor="middle">&#xf007;</text> 
                        </svg>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML=${{__html: `
                .hero-grid {
                    grid-template-columns: 1.2fr 1fr;
                }
                @media (max-width: 900px) {
                    .hero-grid {
                        grid-template-columns: 1fr !important;
                        text-align: center !important;
                    }
                    .hero-grid > div {
                        text-align: center !important;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    .hero-grid p {
                        margin-left: auto;
                        margin-right: auto;
                    }
                }
                .rotating-ring {
                    position: absolute;
                    border: 1px dashed rgba(0, 242, 254, 0.15);
                    border-radius: 50%;
                    pointer-events: none;
                }
                .ring-1 {
                    width: 320px;
                    height: 320px;
                    animation: rotateCW 30s infinite linear;
                }
                .ring-2 {
                    width: 250px;
                    height: 250px;
                    border-color: rgba(157, 78, 221, 0.15);
                    animation: rotateCCW 20s infinite linear;
                }
                @keyframes rotateCW {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes rotateCCW {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }
                @keyframes pulseCore {
                    0% { transform: scale(1) translate(0px, 0px); filter: drop-shadow(0 0 10px rgba(0, 242, 254, 0.3)); }
                    100% { transform: scale(1.08) translate(0px, 0px); filter: drop-shadow(0 0 25px rgba(157, 78, 221, 0.6)); }
                }
            `}} />
        </div>
    `;
}
