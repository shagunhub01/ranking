import React, { useState } from 'https://esm.sh/react@18.2.0';
import htm from 'https://esm.sh/htm@3.1.1';

const html = htm.bind(React.createElement);

export default function ResumeUpload({ candidates, setCandidates, userEmail, addToast, onNext, onTriggerRanking }) {
    const [uploadQueue, setUploadQueue] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [processedCount, setProcessedCount] = useState(candidates.length);

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        await processFiles(files);
    };

    const processFiles = async (files) => {
        setIsUploading(true);
        addToast(`Uploading and parsing ${files.length} resume(s)...`, "info");
        
        // Setup initial queue representation
        const initialQueue = files.map((file, i) => ({
            id: `upload-${Date.now()}-${i}`,
            name: file.name,
            size: `${(file.size / 1024).toFixed(1)} KB`,
            type: file.name.split('.').pop().toUpperCase(),
            progress: 0,
            status: 'queued'
        }));
        setUploadQueue(initialQueue);
        
        try {
            // Read all files asynchronously
            const readPromises = files.map((file, index) => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    
                    reader.onprogress = (event) => {
                        if (event.lengthComputable) {
                            const percent = Math.round((event.loaded / event.total) * 100);
                            setUploadQueue(prev => prev.map((item, idx) => {
                                if (idx === index) {
                                    return { ...item, progress: Math.min(percent, 90), status: 'uploading' };
                                }
                                return item;
                            }));
                        }
                    };

                    reader.onload = () => {
                        let content = reader.result;
                        let encoding = 'text';
                        if (file.name.endsWith('.docx') || file.name.endsWith('.pdf')) {
                            content = reader.result.split(',')[1];
                            encoding = 'base64';
                        }
                        
                        setUploadQueue(prev => prev.map((item, idx) => {
                            if (idx === index) {
                                return { ...item, progress: 95, status: 'processing' };
                            }
                            return item;
                        }));
                        
                        resolve({
                            name: file.name,
                            content,
                            encoding
                        });
                    };
                    
                    if (file.name.endsWith('.docx') || file.name.endsWith('.pdf')) {
                        reader.readAsDataURL(file);
                    } else {
                        reader.readAsText(file);
                    }
                });
            });
            
            const preparedFiles = await Promise.all(readPromises);
            
            // POST request to backend parser API
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: userEmail,
                    files: preparedFiles
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.status === 'success') {
                    setCandidates(data.candidates);
                    setProcessedCount(data.candidates.length);
                    
                    setUploadQueue(prev => prev.map(item => ({
                        ...item,
                        progress: 100,
                        status: 'completed'
                    })));
                    
                    if (onTriggerRanking) {
                        onTriggerRanking();
                    }
                    addToast("Resumes successfully parsed and matching scores calculated! 🎉", "success");
                } else {
                    addToast(data.error || "Parsing failed on server.", "error");
                }
            } else {
                addToast("Failed to upload resumes. Check server logs.", "error");
            }
        } catch (error) {
            console.error("Error uploading resumes", error);
            addToast("Failed to read or upload files.", "error");
        } finally {
            setIsUploading(false);
        }
    };



    const triggerFileSelect = () => {
        if (isUploading) return;
        document.getElementById('file-upload-input').click();
    };

    return html`
        <div>
            
            <div style=${{ marginBottom: '30px' }}>
                <h2 style=${{ fontSize: '32px', marginBottom: '5px' }}>Resume Upload Workspace</h2>
                <p style=${{ color: 'var(--text-secondary)', fontSize: '14px' }}>Feed applicant records to score match coefficients.</p>
            </div>

            <div style=${{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }} class="upload-layout-grid">
                
                <div class="glass-card">
                    <h3 style=${{ fontSize: '18px', marginBottom: '15px' }}>Import Candidate Profiles</h3>
                    
                    <div 
                        class="upload-zone ${isUploading ? 'dragging' : ''}" 
                        onClick=${triggerFileSelect}
                        style=${{ padding: '50px 20px', marginBottom: '20px', cursor: 'pointer', transition: 'all 0.2s ease' }}
                    >
                        <input 
                            type="file" 
                            id="file-upload-input" 
                            multiple 
                            accept=".txt,.docx,.pdf"
                            onChange=${handleFileChange} 
                            style=${{ display: 'none' }} 
                        />
                        <i class="fa-solid fa-folder-open upload-icon" style=${{ color: 'var(--accent-purple)', fontSize: '42px', marginBottom: '15px' }}></i>
                        <h4 style=${{ marginBottom: '8px', fontSize: '16px' }}>Click to Browse or Drag Resumes Here</h4>
                        <p style=${{ color: 'var(--text-secondary)', fontSize: '13px', maxWidth: '320px', margin: '0 auto 10px auto', lineHeight: '1.5' }}>
                            Select multiple candidate files to parse and rank. Supporting text (.txt) and Microsoft Word (.docx) files.
                        </p>
                        <span style=${{ fontSize: '11px', color: 'var(--text-muted)' }}>Files are parsed on the backend in real-time.</span>
                    </div>

                    
                    ${uploadQueue.length > 0 && html`
                        <div style=${{ marginTop: '25px' }}>
                            <h4 style=${{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>Upload Processing Queue</h4>
                            <div style=${{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                ${uploadQueue.map(file => html`
                                    <div key=${file.id} style=${{
                                        padding: '12px 15px',
                                        background: 'rgba(255,255,255,0.02)',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        borderRadius: '10px'
                                    }}>
                                        <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                            <div style=${{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <i class="fa-solid ${file.type === 'TXT' ? 'fa-file-lines' : 'fa-file-word'}" style=${{
                                                    color: file.type === 'TXT' ? 'var(--accent-cyan)' : 'var(--accent-purple)'
                                                }}></i>
                                                <span style=${{ fontSize: '13px', fontWeight: '500', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    ${file.name}
                                                </span>
                                            </div>
                                            <span style=${{ fontSize: '11px', color: file.status === 'completed' ? 'var(--accent-green)' : 'var(--text-muted)' }}>
                                                ${file.status === 'completed' ? 'Parsed & Ranked' : `${file.progress}%`}
                                            </span>
                                        </div>

                                        <div class="progress-bar-container" style=${{ height: '4px', margin: 0 }}>
                                            <div class="progress-bar" style=${{ 
                                                width: `${file.progress}%`,
                                                background: file.status === 'completed' ? 'var(--accent-green)' : 'linear-gradient(to right, var(--accent-cyan), var(--accent-purple))',
                                                boxShadow: file.status === 'completed' ? '0 0 5px var(--accent-green)' : '0 0 5px var(--accent-cyan)'
                                            }}></div>
                                        </div>
                                    </div>
                                `)}
                            </div>
                        </div>
                    `}
                </div>

                
                <div style=${{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    <div class="glass-card" style=${{ textAlign: 'center', padding: '30px 20px' }}>
                        <div style=${{ fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Active Workspace Count</div>
                        <div style=${{ fontSize: '48px', fontWeight: '800', fontFamily: 'var(--font-heading)', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '5px' }}>
                            ${processedCount}
                        </div>
                        <p style=${{ fontSize: '13px', color: 'var(--text-secondary)' }}>All parsed profiles are matched against your job specifications.</p>
                        
                        <button 
                            class="btn btn-primary" 
                            style=${{ width: '100%', marginTop: '25px', padding: '12px' }} 
                            disabled=${isUploading || processedCount === 0} 
                            onClick=${onNext}
                        >
                            View Leaderboard <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>

                    

                </div>
            </div>

            <style dangerouslySetInnerHTML=${{__html: `
                @media (max-width: 900px) {
                    .upload-layout-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}} />
        </div>
    `;
}
