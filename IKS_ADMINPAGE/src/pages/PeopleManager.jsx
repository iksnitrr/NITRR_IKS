import React, { useState, useEffect } from 'react';
import { Plus, Edit2, X, Upload, ArrowLeft, Loader2, Mail, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { peopleService } from '../services/api';
import "../css/People.css"
const PeopleManager = () => {
    const navigate = useNavigate();
    const [people, setPeople] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        role: '',
        email: '',
        alternateEmail: '',
        photo: null
    });
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        fetchPeople();
    }, []);

    const fetchPeople = async () => {
        try {
            const data = await peopleService.getAll();
            if (data.success) {
                setPeople(data.data);
            }
        } catch (error) {
            console.error("Error fetching people", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, photo: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const openModal = (person = null) => {
        if (person) {
            setIsEditing(true);
            setFormData({
                id: person._id,
                name: person.name,
                role: person.role,
                email: person.email,
                alternateEmail: person.alternateEmail || '',
                photo: null
            });
            setPreview(person.photo);
        } else {
            setIsEditing(false);
            setFormData({ name: '', role: '', email: '', alternateEmail: '', photo: null });
            setPreview(null);
        }
        setShowModal(true);
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
            try {
                await peopleService.delete(id);
                setPeople(people.filter(person => person._id !== id));
                alert("Person deleted successfully.");
            } catch (error) {
                console.error("Error deleting person:", error);
                alert("Failed to delete person.");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('role', formData.role);
        data.append('email', formData.email);
        if (formData.alternateEmail) data.append('alternateEmail', formData.alternateEmail);
        if (formData.photo) data.append('photo', formData.photo);

        try {
            if (isEditing) {
                await peopleService.update(formData.id, data);
            } else {
                await peopleService.create(data);
            }
            setShowModal(false);
            fetchPeople();
        } catch (error) {
            alert("Error saving person. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ paddingBottom: '80px' }}>
            {/* Header */}
            <div className="page-header">
                <button onClick={() => navigate('/')} className="btn-link">
                    <ArrowLeft size={20} />
                    <span style={{ fontWeight: 500 }}>Dashboard</span>
                </button>
                <button onClick={() => openModal()} className="btn btn-primary">
                    <Plus size={20} /> Add Person
                </button>
            </div>

            {/* People Grid */}
            {loading ? (
                <div className="loading-container">
                    <Loader2 className="spin" size={30} />
                    <p>Loading...</p>
                </div>
            ) : (
                <div className="people-grid">
                    {people.map((person) => (
                        <div key={person._id} className="person-card">
                            {/* Image Area */}
                            <div className="card-image-wrapper">
                                {person.photo ? (
                                    <img src={person.photo} alt={person.name} className="card-image" />
                                ) : (
                                    <span>No Image</span>
                                )}
                                {/* ACTION BUTTONS */}
                                <div className="card-actions">
                                    <button onClick={() => openModal(person)} className="btn-icon" title="Edit">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(person._id, person.name)} className="btn-icon delete" title="Delete">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Info Area */}
                            <div className="card-info">
                                <h3 className="person-name">{person.name}</h3>
                                <p className="person-role">{person.role}</p>

                                <div className="contact-info">
                                    <div className="contact-row">
                                        <Mail size={14} /> <span>{person.email}</span>
                                    </div>
                                    {person.alternateEmail && (
                                        <div className="contact-row">
                                            <Mail size={14} /> <span>{person.alternateEmail}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Overlay */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{isEditing ? 'Edit Person' : 'New Person'}</h2>
                            <button onClick={() => setShowModal(false)} className="close-btn">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                {/* Upload Widget */}
                                <div className="upload-widget">
                                    <div className="image-preview-box">
                                        {preview ? (
                                            <img src={preview} alt="Preview" />
                                        ) : (
                                            <Upload size={24} style={{ color: '#ccc' }} />
                                        )}
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            className="file-input-hidden"
                                            accept="image/*"
                                        />
                                    </div>
                                    <span className="upload-hint">Tap to upload photo</span>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input
                                        required
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Dr. Jane Doe"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Role / Designation</label>
                                    <input
                                        required
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Professor"
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-col">
                                        <div className="form-group">
                                            <label className="form-label">Primary Email</label>
                                            <input
                                                required
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="form-input"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-col">
                                        <div className="form-group">
                                            <label className="form-label">Alt. Email (Opt)</label>
                                            <input
                                                type="email"
                                                name="alternateEmail"
                                                value={formData.alternateEmail}
                                                onChange={handleChange}
                                                className="form-input"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>
                                    {submitting && <Loader2 className="spin" size={18} />}
                                    {isEditing ? 'Update Person' : 'Create Person'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PeopleManager;