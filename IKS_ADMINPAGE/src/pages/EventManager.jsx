import React, { useState, useEffect } from 'react';
import { Plus, Edit2, X, Upload, ArrowLeft, Loader2, Trash2, Calendar, MapPin, User, Clock, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../services/api';
import "../css/People.css";
import "../css/Events.css";

const EventManager = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null, title: '' });

    const [formData, setFormData] = useState({
        id: '', title: '', speaker: '', date: '', time: '', venue: '', description: '', status: 'upcoming',
        existingNoticePdfs: [], existingImages: [],
        newNoticePdfs: [], newImages: []
    });

    useEffect(() => { fetchEvents(); }, []);

    const fetchEvents = async () => {
        try {
            const data = await eventService.getAll();
            if (data.success) setEvents(data.data);
        } catch (error) { console.error("Error fetching events", error); }
        finally { setLoading(false); }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleFileChange = (e, type) => {
        const files = Array.from(e.target.files);
        if (type === 'images') {
            setFormData(prev => ({ ...prev, newImages: [...prev.newImages, ...files] }));
        } else {
            setFormData(prev => ({ ...prev, newNoticePdfs: [...prev.newNoticePdfs, ...files] }));
        }
    };

    const removeExistingImage = (index) => setFormData(prev => ({ ...prev, existingImages: prev.existingImages.filter((_, i) => i !== index) }));
    const removeExistingPdf = (index) => setFormData(prev => ({ ...prev, existingNoticePdfs: prev.existingNoticePdfs.filter((_, i) => i !== index) }));
    const removeNewImage = (index) => setFormData(prev => ({ ...prev, newImages: prev.newImages.filter((_, i) => i !== index) }));
    const removeNewPdf = (index) => setFormData(prev => ({ ...prev, newNoticePdfs: prev.newNoticePdfs.filter((_, i) => i !== index) }));

    const openModal = (eventItem = null) => {
        if (eventItem) {
            setIsEditing(true);
            const formatExisting = (items) => items.map(item => typeof item === 'string' ? { url: item, name: 'Existing File' } : item);

            setFormData({
                id: eventItem._id,
                title: eventItem.title,
                speaker: eventItem.speaker || '',
                date: new Date(eventItem.date).toISOString().split('T')[0],
                time: eventItem.time || '',
                venue: eventItem.venue || '',
                description: eventItem.description || '',
                status: eventItem.status || 'upcoming',
                existingNoticePdfs: eventItem.noticePdfs ? formatExisting(eventItem.noticePdfs) : [],
                existingImages: eventItem.images ? formatExisting(eventItem.images) : [],
                newNoticePdfs: [], newImages: []
            });
        } else {
            setIsEditing(false);
            setFormData({
                id: '', title: '', speaker: '', date: '', time: '', venue: '', description: '', status: 'upcoming',
                existingNoticePdfs: [], existingImages: [], newNoticePdfs: [], newImages: []
            });
        }
        setShowModal(true);
    };

    const triggerDelete = (id, title) => setDeleteModal({ show: true, id, title });

    const confirmDelete = async () => {
        try {
            await eventService.delete(deleteModal.id);
            setEvents(events.filter(e => e._id !== deleteModal.id));
            setDeleteModal({ show: false, id: null, title: '' });
        } catch (error) { alert("Failed to delete event."); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('speaker', formData.speaker);
        data.append('date', formData.date);
        data.append('time', formData.time);
        data.append('venue', formData.venue);
        data.append('description', formData.description);
        data.append('status', formData.status);

        formData.existingImages.forEach(img => data.append('existingImages', JSON.stringify(img)));
        formData.existingNoticePdfs.forEach(pdf => data.append('existingNoticePdfs', JSON.stringify(pdf)));

        formData.newImages.forEach(file => data.append('images', file));
        formData.newNoticePdfs.forEach(file => data.append('noticePdfs', file));

        try {
            if (isEditing) await eventService.update(formData.id, data);
            else await eventService.create(data);

            setShowModal(false);
            fetchEvents();
        } catch (error) {
            alert("Error saving event. Please try again.");
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ paddingBottom: '80px' }}>
            <div className="page-header">
                <button onClick={() => navigate('/')} className="btn-link">
                    <ArrowLeft size={20} /> <span style={{ fontWeight: 500 }}>Dashboard</span>
                </button>
                <button onClick={() => openModal()} className="btn btn-primary">
                    <Plus size={20} /> Add Event
                </button>
            </div>

            {loading ? (
                <div className="loading-container"><Loader2 className="spin" size={30} /><p>Loading...</p></div>
            ) : (
                <div className="dashboard-grid">
                    {events.map((ev) => (
                        <div key={ev._id} className="event-card">
                            <div className="event-actions">
                                <button onClick={() => openModal(ev)} className="btn-icon" title="Edit"><Edit2 size={16} /></button>
                                <button onClick={() => triggerDelete(ev._id, ev.title)} className="btn-icon delete" title="Delete"><Trash2 size={16} /></button>
                            </div>
                            <h3 className="event-title" title={ev.title}>{ev.title}</h3>
                            <span className={`event-status status-${ev.status}`}>{ev.status}</span>
                            <div className="event-detail-row"><Calendar size={14} /> {new Date(ev.date).toLocaleDateString()}</div>
                            {ev.time && <div className="event-detail-row"><Clock size={14} /> {ev.time}</div>}
                            {ev.venue && <div className="event-detail-row"><MapPin size={14} /> {ev.venue}</div>}
                            {ev.speaker && <div className="event-detail-row"><User size={14} /> {ev.speaker}</div>}
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{isEditing ? 'Edit Event' : 'New Event'}</h2>
                            <button onClick={() => setShowModal(false)} className="close-btn"><X size={24} /></button>
                        </div>

                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Event Title*</label>
                                    <input required name="title" value={formData.title} onChange={handleChange} className="form-input" />
                                </div>

                                <div className="form-row">
                                    <div className="form-col">
                                        <div className="form-group">
                                            <label className="form-label">Date*</label>
                                            <input required type="date" name="date" value={formData.date} onChange={handleChange} className="form-input" />
                                        </div>
                                    </div>
                                    <div className="form-col">
                                        <div className="form-group">
                                            <label className="form-label">Status</label>
                                            <select name="status" value={formData.status} onChange={handleChange} className="form-input">
                                                <option value="upcoming">Upcoming</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-col">
                                        <div className="form-group">
                                            <label className="form-label">Time</label>
                                            <input name="time" value={formData.time} onChange={handleChange} className="form-input" placeholder="e.g. 4:00 PM - 5:15 PM" />
                                        </div>
                                    </div>
                                    <div className="form-col">
                                        <div className="form-group">
                                            <label className="form-label">Venue</label>
                                            <input name="venue" value={formData.venue} onChange={handleChange} className="form-input" />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Speaker</label>
                                    <input name="speaker" value={formData.speaker} onChange={handleChange} className="form-input" />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange} className="form-input" rows="3"></textarea>
                                </div>

                                {/* PDF Upload Section */}
                                <div className="form-group" style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                                    <label className="form-label">Notice PDFs (English, Hindi, etc.)</label>
                                    <label className="file-upload-btn">
                                        <Upload size={16} /> Add PDFs
                                        <input type="file" multiple accept=".pdf" className="file-input-hidden" onChange={(e) => handleFileChange(e, 'pdfs')} />
                                    </label>
                                    <div className="file-preview-grid">

                                        {formData.existingNoticePdfs.map((pdf, i) => (
                                            <div key={i} className="file-preview-item pdf-item">
                                                <a href={pdf.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: 'inherit', width: '100%', cursor: 'pointer' }}>
                                                    <FileText size={20} />
                                                    <span className="file-name-text" title={pdf.name}>{pdf.name}</span>
                                                </a>
                                                <button type="button" onClick={(e) => { e.preventDefault(); removeExistingPdf(i); }} className="remove-file-btn">
                                                    <X size={15} strokeWidth={2.5} />
                                                </button>
                                            </div>
                                        ))}

                                        {formData.newNoticePdfs.map((file, i) => (
                                            <div key={i} className="file-preview-item pdf-item" style={{ borderColor: 'var(--primary)' }}>
                                                <a href={URL.createObjectURL(file)} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: 'inherit', width: '100%', cursor: 'pointer' }}>
                                                    <FileText size={20} color="var(--primary)" />
                                                    <span className="file-name-text" title={file.name}>{file.name}</span>
                                                </a>
                                                <button type="button" onClick={(e) => { e.preventDefault(); removeNewPdf(i); }} className="remove-file-btn">
                                                    <X size={15} strokeWidth={2.5} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Image Upload Section */}
                                <div className="form-group" style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                                    <label className="form-label">Event Photos</label>
                                    <label className="file-upload-btn">
                                        <Upload size={16} /> Add Photos
                                        <input type="file" multiple accept="image/*" className="file-input-hidden" onChange={(e) => handleFileChange(e, 'images')} />
                                    </label>
                                    <div className="file-preview-grid">

                                        {formData.existingImages.map((img, i) => (
                                            <div key={i} className="file-preview-item">
                                                <a href={img.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', height: '100%', cursor: 'pointer' }}>
                                                    <img src={img.url} alt={img.name} title={img.name} />
                                                </a>
                                                <button type="button" onClick={(e) => { e.preventDefault(); removeExistingImage(i); }} className="remove-file-btn">
                                                    <X size={15} strokeWidth={2.5} />
                                                </button>
                                            </div>
                                        ))}

                                        {formData.newImages.map((file, i) => (
                                            <div key={i} className="file-preview-item" style={{ borderColor: 'var(--primary)' }}>
                                                <a href={URL.createObjectURL(file)} target="_blank" rel="noopener noreferrer" style={{ display: 'block', height: '100%', cursor: 'pointer' }}>
                                                    <img src={URL.createObjectURL(file)} alt={file.name} title={file.name} />
                                                </a>
                                                <button type="button" onClick={(e) => { e.preventDefault(); removeNewImage(i); }} className="remove-file-btn">
                                                    <X size={15} strokeWidth={2.5} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>
                                    {submitting && <Loader2 className="spin" size={18} />}
                                    {isEditing ? 'Update Event' : 'Create Event'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {deleteModal.show && (
                <div className="modal-overlay">
                    <div className="modal-content delete-modal-content">
                        <div style={{ color: 'var(--danger)', marginBottom: '16px' }}>
                            <Trash2 size={48} />
                        </div>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Delete Event?</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                            Are you sure you want to delete <strong>"{deleteModal.title}"</strong>? This will permanently remove all associated PDFs and photos.
                        </p>
                        <div className="delete-modal-actions">
                            <button onClick={() => setDeleteModal({ show: false, id: null, title: '' })} className="btn" style={{ background: '#e5e7eb', color: '#374151' }}>
                                Cancel
                            </button>
                            <button onClick={confirmDelete} className="btn" style={{ background: 'var(--danger)', color: 'white' }}>
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventManager;