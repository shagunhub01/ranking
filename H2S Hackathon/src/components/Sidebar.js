import React from 'https://esm.sh/react@18.2.0';
import htm from 'https://esm.sh/htm@3.1.1';

const html = htm.bind(React.createElement);

export default function Sidebar({ currentPage, setCurrentPage, collapsed, setCollapsed, user, onLogout }) {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'fa-solid fa-chart-pie' },
        { id: 'job-upload', label: 'Job Specification', icon: 'fa-solid fa-file-invoice' },
        { id: 'resume-upload', label: 'Upload Resumes', icon: 'fa-solid fa-file-upload' },
        { id: 'ranking', label: 'Talent Leaderboard', icon: 'fa-solid fa-ranking-star' },
        { id: 'insights', label: 'AI Analytics', icon: 'fa-solid fa-brain' }
    ];

    const getInitials = (name) => {
        if (!name) return "HR";
        const parts = name.split(" ");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    const name = user ? user.name : "Sarah Jenkins";
    const company = user ? user.company || "SkillMatch" : "SkillMatch";
    const initials = getInitials(name);

    return html`
        <aside class="sidebar ${collapsed ? 'collapsed' : ''}">
            
            <a href="#" class="sidebar-logo" onClick=${(e) => { e.preventDefault(); setCurrentPage('dashboard'); }}>
                <div class="logo-icon">
                    <i class="fa-solid fa-bolt"></i>
                </div>
                <span class="logo-text">SkillMatch</span>
                <span class="logo-badge">v1.2</span>
            </a>

            <nav class="sidebar-nav">
                ${navItems.map(item => {
                    const isActive = currentPage === item.id;
                    return html`
                        <a 
                            key=${item.id}
                            href="#" 
                            class="nav-item ${isActive ? 'active' : ''}"
                            onClick=${(e) => { e.preventDefault(); setCurrentPage(item.id); }}
                            title=${item.label}
                        >
                            <i class=${item.icon}></i>
                            <span class="nav-text">${item.label}</span>
                        </a>
                    `;
                })}
            </nav>

            <div style=${{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div 
                    class="nav-item"
                    onClick=${() => setCollapsed(!collapsed)}
                    title=${collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    style=${{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px', borderRadius: 0, cursor: 'pointer' }}
                >
                    <i class="fa-solid ${collapsed ? 'fa-angles-right' : 'fa-angles-left'}"></i>
                    <span class="nav-text">Collapse Menu</span>
                </div>

                <div 
                    class="nav-item"
                    onClick=${onLogout}
                    title="Logout Session"
                    style=${{ color: 'var(--accent-magenta)', cursor: 'pointer' }}
                >
                    <i class="fa-solid fa-arrow-right-from-bracket"></i>
                    <span class="nav-text">Sign Out</span>
                </div>

                <div style=${{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    padding: '10px 5px',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    display: collapsed ? 'none' : 'flex'
                }}>
                    <div style=${{ 
                        width: '38px', 
                        height: '38px', 
                        borderRadius: '50%', 
                        background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        color: 'var(--bg-deep)',
                        fontSize: '14px'
                    }}>
                        ${initials}
                    </div>
                    <div style=${{ overflow: 'hidden' }}>
                        <div style=${{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>${name}</div>
                        <div style=${{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>${company}</div>
                    </div>
                </div>
            </div>
        </aside>
    `;
}
