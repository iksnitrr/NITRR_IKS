import React from 'react';
import { ArrowLeft, Construction } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ComingSoon = ({ title }) => {
    const navigate = useNavigate();
    return (
        <div className="center-message-container">
            <div className="icon-badge">
                <Construction size={48} />
            </div>
            <h2 style={{ fontSize: '1.75rem', margin: '0 0 8px 0' }}>{title}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '400px' }}>
                This module is currently under development. You will be able to manage {title.toLowerCase()} data here soon.
            </p>
            <button
                onClick={() => navigate('/')}
                className="btn-link"
                style={{ color: 'var(--primary)', fontWeight: 500 }}
            >
                <ArrowLeft size={18} /> Back to Dashboard
            </button>
        </div>
    );
};

export default ComingSoon;