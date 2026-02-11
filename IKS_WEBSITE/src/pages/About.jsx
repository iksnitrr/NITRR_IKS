import Navbar from "../components/Navbar";
import { Target, Lightbulb, Users, History } from "lucide-react";
import "../css/About.css"; // We will create this CSS below

function About({ theme, setTheme }) {
    return (
        <div className={`about-page ${theme}`}>
            <div className="container">
                {/* Header Section */}
                <div className="about-header">
                    <h1>About the Center</h1>
                    <p className="sanskrit-quote">"Vasudhaiva Kutumbakam"</p>
                    <p className="subtitle">Integrating ancient wisdom with modern scientific temperament.</p>
                </div>

                {/* Vision & Mission Grid */}
                <div className="mission-grid">
                    <div className="mission-card">
                        <Target className="icon" size={40} />
                        <h2>Our Mission</h2>
                        <p>
                            To explore, document, and scientifically validate Indian Knowledge Systems
                            and integrate them into contemporary engineering education.
                        </p>
                    </div>

                    <div className="mission-card">
                        <Lightbulb className="icon" size={40} />
                        <h2>Our Vision</h2>
                        <p>
                            To become a global center of excellence for research in ancient Indian
                            science, technology, architecture, and mathematics.
                        </p>
                    </div>
                </div>

                {/* History / Background Section */}
                <div className="history-section">
                    <div className="history-text">
                        <h3><History className="inline-icon" /> Historical Context</h3>
                        <p>
                            NIT Raipur (formerly GEC Raipur) has long stood as a beacon of technical education.
                            The IKS Center was established to reconnect students with the rich scientific heritage
                            of India, ranging from the metallurgical marvels of Chhattisgarh to the architectural
                            precision of ancient temples.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;