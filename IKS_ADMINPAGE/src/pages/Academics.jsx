import React from 'react';
import { BookOpen, Plus } from 'lucide-react';
import '../css/General.css';

const Academics = () => {
    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Academics Management</h1>
                    <p className="page-subtitle">Manage courses, curriculum, and academic calendars.</p>
                </div>
                <button className="btn-primary">
                    <Plus size={18} /> Add Course
                </button>
            </div>

            {/* Main Content Area */}
            <div className="content-wrapper">
                <BookOpen size={48} className="empty-state-icon" />
                <h3>No Academic Data Found</h3>
                <p>Start by adding a new course or curriculum detail.</p>
            </div>
        </div>
    );
};

export default Academics;