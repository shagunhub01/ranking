import React from 'https://esm.sh/react@18.2.0';
import htm from 'https://esm.sh/htm@3.1.1';

const html = htm.bind(React.createElement);

export default function Toast({ toasts }) {
    if (toasts.length === 0) return null;

    const getToastIcon = (type) => {
        switch (type) {
            case 'success':
                return 'fa-solid fa-circle-check';
            case 'warning':
                return 'fa-solid fa-triangle-exclamation';
            case 'info':
            default:
                return 'fa-solid fa-circle-info';
        }
    };

    const getToastClass = (type) => {
        switch (type) {
            case 'success':
                return 'toast-success';
            case 'warning':
                return 'toast-warning';
            case 'info':
            default:
                return 'toast-info';
        }
    };

    return html`
        <div class="toast-container">
            ${toasts.map(toast => html`
                <div 
                    key=${toast.id} 
                    class="toast ${getToastClass(toast.type)}"
                >
                    <i class=${getToastIcon(toast.type)}></i>
                    <span style=${{ fontSize: '13px', fontWeight: '500' }}>${toast.message}</span>
                </div>
            `)}
        </div>
    `;
}
