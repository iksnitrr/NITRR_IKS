import "../css/ResearchCard.css";

function ResearchCard({ title, icon, description }) {
    return (
        <div className="research-card">
            <div className="icon-container">{icon}</div>
            <h3>{title}</h3>
            <p>{description}</p>
            <button className="learn-more">Read More</button>
        </div>
    );
}

export default ResearchCard;