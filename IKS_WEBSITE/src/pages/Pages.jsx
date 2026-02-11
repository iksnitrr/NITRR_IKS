import React from 'react';
import '../css/Pages.css'; // Make sure to create this CSS file below

const PageLayout = ({ title, subtitle, children }) => (
    <div className="container page-content">
        <h1 className="section-title">{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
        {children}
    </div>
);

// Responsive & Theme-Adaptive Component
const Placeholder = ({ text }) => (
    <div className="placeholder-box">
        <p>{text}</p>
    </div>
);

export const Academics = () => (
    <PageLayout title="Academics" subtitle="Courses and Curriculum">
        <Placeholder text="Course and Curriculum details will be added soon." />
    </PageLayout>
);

export const Research = () => (
    <PageLayout title="Research Projects & Labs" subtitle="Ongoing and Completed Gaveshana">
        <Placeholder text="Research Projects and Laboratory details will be added soon." />
    </PageLayout>
);

export const Repository = () => (
    <PageLayout title="Knowledge Repository" subtitle="Digital Library and Manuscripts">
        <Placeholder text="Repository resources will be uploaded soon." />
    </PageLayout>
);

export const News = () => (
    <PageLayout title="Upcoming & In News" subtitle="Events, Workshops, and Announcements">
        <Placeholder text="Upcoming events and news will be updated here." />
    </PageLayout>
);

export const Collaborators = () => (
    <PageLayout title="Collaborators" subtitle="Partner Institutes and Organizations">
        <Placeholder text="List of collaborators and partners will be added soon." />
    </PageLayout>
);