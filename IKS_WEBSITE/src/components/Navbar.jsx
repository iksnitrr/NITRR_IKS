import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sun, Moon, Menu, X, ChevronDown } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import "../css/Navbar.css";

function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(null);

    const closeMenu = () => {
        setIsMobileMenuOpen(false);
        setDropdownOpen(null);
    };

    const toggleDropdown = (name) => {
        setDropdownOpen(dropdownOpen === name ? null : name);
    };

    return (
        <nav className={`navbar ${theme}`}>
            <div className="navbar-container">

                {/* === ROW 1: HEADER (Logo & Actions) === */}
                <div className="navbar-header-row">

                    {/* Branding Section */}
                    <Link to="/" className="navbar-brand" onClick={closeMenu}>
                        <img src="/nitrr-logo.png" alt="NITRR Logo" className="nit-logo" />
                        <div className="brand-text">
                            <h1 className="main-heading">Center for Indian Knowledge Systems IKS</h1>
                            <h2 className="sub-heading">NATIONAL INSTITUTE OF TECHNOLOGY RAIPUR</h2>
                        </div>
                    </Link>

                    {/* Desktop Theme Toggle (Visible in Top Right) */}
                    <div className="header-actions">
                        <button onClick={toggleTheme} className="theme-toggle-btn desktop-only">
                            {theme === "light" ? <Moon size={22} /> : <Sun size={22} />}
                        </button>

                        {/* Mobile Hamburger (Visible only on small screens) */}
                        <div className="mobile-menu-icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </div>
                    </div>
                </div>

                {/* === ROW 2: NAVIGATION LINKS === */}
                <div className={`navbar-links-row ${isMobileMenuOpen ? "active" : ""}`}>
                    <ul className="nav-menu">

                        <li className="nav-item">
                            <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
                        </li>

                        <li className="nav-item">
                            <Link to="/people" className="nav-link" onClick={closeMenu}>People</Link>
                        </li>

                        <li className="nav-item">
                            <Link to="/academics" className="nav-link" onClick={closeMenu}>Academics</Link>
                        </li>

                        <li className="nav-item dropdown" onClick={() => toggleDropdown('research')}>
                            <span className="nav-link dropdown-toggle">
                                Research <ChevronDown size={14} />
                            </span>
                            <ul className={`dropdown-menu ${dropdownOpen === 'research' ? 'show' : ''}`}>
                                <li><Link to="/research" onClick={closeMenu}>Projects</Link></li>
                                <li><Link to="/research" onClick={closeMenu}>Laboratories</Link></li>
                            </ul>
                        </li>

                        <li className="nav-item">
                            <Link to="/repository" className="nav-link" onClick={closeMenu}>Knowledge Repository</Link>
                        </li>

                        <li className="nav-item">
                            <Link to="/news" className="nav-link" onClick={closeMenu}>Upcoming & In News</Link>
                        </li>

                        <li className="nav-item">
                            <Link to="/collaborators" className="nav-link" onClick={closeMenu}>Collaborators</Link>
                        </li>

                        {/* Mobile Only Theme Toggle (Inside Menu) */}
                        <li className="nav-item mobile-only">
                            <button onClick={toggleTheme} className="theme-btn-mobile">
                                {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
                            </button>
                        </li>
                    </ul>
                </div>

            </div>
        </nav>
    );
}

export default Navbar;