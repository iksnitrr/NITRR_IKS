import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Home, BookOpen, Microscope, Database, Newspaper, Handshake } from 'lucide-react';
import "../css/Dashboard.css"

const Dashboard = () => {
    const navigate = useNavigate();

    const cards = [
        { title: "Home", path: "/home-edit", icon: <Home size={24} />, color: "#2563eb" },
        { title: "People", path: "/people", icon: <Users size={24} />, color: "#4f46e5" },
        { title: "Academics", path: "/academics", icon: <BookOpen size={24} />, color: "#16a34a" },
        { title: "Research", path: "/research", icon: <Microscope size={24} />, color: "#9333ea" },
        { title: "Knowledge Repository", path: "/knowledge-repo", icon: <Database size={24} />, color: "#ea580c" },
        { title: "Upcoming & In News", path: "/news", icon: <Newspaper size={24} />, color: "#db2777" },
        { title: "Collaborators", path: "/collaborators", icon: <Handshake size={24} />, color: "#0d9488" },
    ];

    return (
        <div>
            <div className="dashboard-header">
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Dashboard</h2>
            </div>
            <div className="dashboard-grid">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        onClick={() => navigate(card.path)}
                        className="dashboard-card"
                    >
                        {/* We use inline style for dynamic colors, or you could create specific CSS classes */}
                        <div
                            className="card-icon"
                            style={{
                                color: card.color,
                                backgroundColor: `${card.color}15` // 15 is hex opacity 
                            }}
                        >
                            {card.icon}
                        </div>
                        <h3 style={{ margin: 0, fontWeight: 500, color: '#374151' }}>{card.title}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;