import React from 'react';
import { User, Mail, Award } from 'lucide-react';
// Changed import from People.css to PersonCard.css
import "../css/PersonCard.css";

function PersonCard({ data, isChairperson = false }) {
    if (!data) return null;

    const { name, role, email, photo, alternateEmail } = data;
    const cleanName = name ? name.replace(/^"|"$/g, '') : "Unknown Name";
    const cleanRole = role ? role.replace(/^"|"$/g, '') : "Member";

    return (
        <div className={`people-card ${isChairperson ? 'chairperson-variant' : ''}`}>
            <div className="p-card-inner">
                <div className="p-card-img-wrapper">
                    {photo ? (
                        <img src={photo} alt={cleanName} className="p-card-img" />
                    ) : (
                        <div className="p-card-placeholder">
                            <User size={isChairperson ? 60 : 40} />
                        </div>
                    )}
                </div>

                <div className="p-card-content">
                    <h3 className="p-card-name">{cleanName}</h3>

                    <div className="p-card-badge-box">
                        <span className="p-card-role">
                            {isChairperson && <Award size={14} style={{ marginRight: '4px' }} />}
                            {cleanRole}
                        </span>
                    </div>

                    <div className="p-card-email-box">
                        {email && email !== "." && (
                            <a href={`mailto:${email}`} className="p-card-email-link">
                                <Mail size={14} /> {email}
                            </a>
                        )}

                        {alternateEmail && alternateEmail.includes('@') && (
                            <a href={`mailto:${alternateEmail}`} className="p-card-email-link p-card-alt-email">
                                <Mail size={14} /> {alternateEmail}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PersonCard;