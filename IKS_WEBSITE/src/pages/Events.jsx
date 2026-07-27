import React, { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, User, FileText, ImageIcon, BookOpen, ChevronLeft, ChevronRight, X } from "lucide-react";
import ErrorState from "../components/ErrorState";
import "../css/People.css";
import "../css/PublicEvents.css";

function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Lightbox State
    const [lightbox, setLightbox] = useState({ isOpen: false, images: [], index: 0 });

    const fetchEvents = async () => {
        setLoading(true);
        setError(null);
        try {
            const baseUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${baseUrl}/event/getevents`);

            if (!response.ok) throw new Error("Failed to fetch events data");

            const result = await response.json();
            if (result.success) {
                setEvents(result.data);
            }
        } catch (err) {
            console.error("Error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const upcomingEvents = events.filter(e => e.status === "upcoming");
    const completedEvents = events.filter(e => e.status === "completed");

    const getUrl = (file) => file.url || file;
    const getName = (file, fallback) => file.name || fallback;

    // --- Lightbox Controls ---
    const openLightbox = (images, index) => setLightbox({ isOpen: true, images, index });
    const closeLightbox = () => setLightbox(prev => ({ ...prev, isOpen: false }));

    const nextPhoto = (e) => {
        if (e) e.stopPropagation();
        setLightbox(prev => ({ ...prev, index: prev.index === prev.images.length - 1 ? 0 : prev.index + 1 }));
    };

    const prevPhoto = (e) => {
        if (e) e.stopPropagation();
        setLightbox(prev => ({ ...prev, index: prev.index === 0 ? prev.images.length - 1 : prev.index - 1 }));
    };

    // --- NEW: Keyboard Navigation for Lightbox ---
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!lightbox.isOpen) return;

            if (e.key === "ArrowRight") {
                nextPhoto();
            } else if (e.key === "ArrowLeft") {
                prevPhoto();
            } else if (e.key === "Escape") {
                closeLightbox();
            }
        };

        if (lightbox.isOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightbox.isOpen]);
    // ---------------------------------------------

    // --- UPDATED EVENT CARD: Added Limits and State ---
    const EventCard = ({ event }) => {
        const [isExpanded, setIsExpanded] = useState(false);
        const CHAR_LIMIT = 280;
        const IMAGE_LIMIT = 4;

        return (
            <div className="public-event-card">
                <div className="event-card-header">
                    <span className={`event-status-badge badge-${event.status}`}>
                        {event.status}
                    </span>
                </div>

                <h3 className="public-event-title">{event.title}</h3>

                <div className="event-details-box">
                    <div className="event-detail-item">
                        <Calendar size={20} />
                        <span>{new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    {event.time && (
                        <div className="event-detail-item">
                            <Clock size={20} />
                            <span>{event.time}</span>
                        </div>
                    )}
                    {event.venue && (
                        <div className="event-detail-item">
                            <MapPin size={20} />
                            <span>{event.venue}</span>
                        </div>
                    )}
                    {event.speaker && (
                        <div className="event-detail-item">
                            <User size={20} />
                            <span>{event.speaker}</span>
                        </div>
                    )}
                </div>

                {/* --- Read More / Show Less Logic --- */}
                {event.description && (
                    <div className="event-description-wrapper">
                        <p className="public-event-desc">
                            {isExpanded
                                ? event.description
                                : `${event.description.substring(0, CHAR_LIMIT)}${event.description.length > CHAR_LIMIT ? '...' : ''}`
                            }
                        </p>
                        {event.description.length > CHAR_LIMIT && (
                            <button
                                className="read-more-btn"
                                onClick={() => setIsExpanded(!isExpanded)}
                            >
                                {isExpanded ? "Show Less" : "Read More"}
                            </button>
                        )}
                    </div>
                )}

                {(event.noticePdfs?.length > 0 || event.images?.length > 0) && (
                    <div className="event-media-section">

                        {/* Notice PDFs */}
                        {event.noticePdfs && event.noticePdfs.length > 0 && (
                            <div>
                                <div className="media-label"><BookOpen size={20} /> Event Documents & Notices</div>
                                <div className="pdf-links-wrapper">
                                    {event.noticePdfs.map((pdf, idx) => (
                                        <a
                                            key={idx}
                                            href={getUrl(pdf)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="pdf-link-btn"
                                        >
                                            <FileText size={18} />
                                            {getName(pdf, `Notice Document ${idx + 1}`)}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* --- Smart Event Gallery Logic --- */}
                        {event.images && event.images.length > 0 && (
                            <div style={{ marginTop: '20px' }}>
                                <div className="media-label"><ImageIcon size={20} /> Event Gallery</div>
                                <div className="photo-gallery-grid">
                                    {event.images.slice(0, IMAGE_LIMIT).map((img, idx) => (
                                        <div
                                            key={idx}
                                            onClick={(e) => { e.preventDefault(); openLightbox(event.images, idx); }}
                                            className="photo-thumb-container"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <img
                                                src={getUrl(img)}
                                                alt={`Event snap ${idx + 1}`}
                                                className="photo-thumb"
                                                loading="lazy"
                                            />
                                            {/* Show overlay on the last allowed image if there are hidden ones */}
                                            {idx === IMAGE_LIMIT - 1 && event.images.length > IMAGE_LIMIT && (
                                                <div className="more-photos-overlay">
                                                    +{event.images.length - IMAGE_LIMIT} More
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="events-page">
            <div className="events-container">

                <div className="people-header">
                    <h1 className="people-main-title">Events & Sessions</h1>
                </div>

                {loading && <div className="events-loader">Loading events schedule...</div>}
                {error && (
                    <ErrorState
                        title="Unable to Load Events Schedule"
                        onRetry={fetchEvents}
                    />
                )}

                {!loading && !error && (
                    <>
                        {upcomingEvents.length > 0 && (
                            <section>
                                <h2 className="events-section-title">Upcoming Activities</h2>
                                <div className="events-list-stack">
                                    {upcomingEvents.map(event => <EventCard key={event._id} event={event} />)}
                                </div>
                            </section>
                        )}

                        {completedEvents.length > 0 && (
                            <section style={{ marginTop: upcomingEvents.length > 0 ? '80px' : '0' }}>
                                <h2 className="events-section-title">Past Events Archive</h2>
                                <div className="events-list-stack">
                                    {completedEvents.map(event => <EventCard key={event._id} event={event} />)}
                                </div>
                            </section>
                        )}

                        {events.length === 0 && (
                            <div className="placeholder-box">
                                <p>No events found. Check back soon!</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* --- TOP LEVEL LIGHTBOX RENDER --- */}
            {lightbox.isOpen && (
                <div className="lightbox-overlay" onClick={closeLightbox}>
                    <button className="lightbox-close" onClick={closeLightbox}>
                        <X size={36} />
                    </button>

                    {lightbox.images.length > 1 && (
                        <button className="lightbox-btn lightbox-prev" onClick={prevPhoto}>
                            <ChevronLeft size={40} />
                        </button>
                    )}

                    <img
                        src={getUrl(lightbox.images[lightbox.index])}
                        alt={`Gallery view ${lightbox.index + 1}`}
                        className="lightbox-img"
                        onClick={(e) => e.stopPropagation()}
                    />

                    {lightbox.images.length > 1 && (
                        <button className="lightbox-btn lightbox-next" onClick={nextPhoto}>
                            <ChevronRight size={40} />
                        </button>
                    )}

                    {lightbox.images.length > 1 && (
                        <div className="lightbox-counter">
                            {lightbox.index + 1} / {lightbox.images.length}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Events;