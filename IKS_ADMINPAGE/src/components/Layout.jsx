import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import '../css/Layout.css';

const logoSrc = '/nitrr-logo.png';

const Layout = ({ children }) => {
    const navigate = useNavigate();

    return (
        <div className="app-shell">
            <nav className="navbar">
                <div className="navbar-content">

                    {/* Left Side: Always Branding (Clickable to go Home) */}
                    <div className="navbar-left">
                        <div
                            className="brand"
                            onClick={() => navigate('/')}
                            style={{ cursor: 'pointer' }}
                            title="Go to Dashboard"
                        >
                            <img
                                src={logoSrc}
                                alt="IKS Logo"
                                className="brand-logo"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                            <h1 className="brand-title">IKS Admin</h1>
                        </div>
                    </div>

                    {/* Right Side: User Profile */}
                    <div className="navbar-right">
                        <span className="user-badge">Admin</span>
                    </div>
                </div>
            </nav>

            <main className="main-content">
                <div className="content-container">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;