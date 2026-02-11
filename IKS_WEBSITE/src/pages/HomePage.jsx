import { ArrowRight, BookOpen, Users, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import "../css/HomePage.css"; // Create this for home-specific styles

function HomePage() {
    return (
        <div className="home-wrapper">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Preserving the Wisdom of <br /> <span className="highlight">Ancient India</span></h1>
                    <p>
                        The Center for Indian Knowledge Systems (IKS) at NIT Raipur is dedicated to
                        research, documentation, and dissemination of India's rich scientific heritage.
                    </p>
                    <div className="hero-btns">
                        <Link to="/about" className="btn-primary">Learn More</Link>
                        <Link to="/news" className="btn-secondary">Latest News</Link>
                    </div>
                </div>
            </section>

            {/* Quick Info Grid */}
            <section className="container info-grid">
                <div className="info-card">
                    <BookOpen className="icon" size={40} />
                    <h3>Academics</h3>
                    <p>Integrating traditional knowledge with modern engineering curriculum.</p>
                </div>
                <div className="info-card">
                    <Globe className="icon" size={40} />
                    <h3>Research</h3>
                    <p>Scientific validation of Vastu, Ayurveda, Metallurgy, and Mathematics.</p>
                </div>
                <div className="info-card">
                    <Users className="icon" size={40} />
                    <h3>Community</h3>
                    <p>Workshops, seminars, and internships for students and scholars.</p>
                </div>
            </section>
        </div>
    );
}

export default HomePage;