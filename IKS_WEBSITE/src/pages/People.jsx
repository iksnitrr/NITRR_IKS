import React, { useEffect, useState } from "react";
import PersonCard from "../components/PersonCard";
import "../css/People.css";

function People() {
    const [people, setPeople] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPeople = async () => {
            try {
                const baseUrl = import.meta.env.VITE_BACKEND_URL;
                const response = await fetch(`${baseUrl}/person/getpeople`);

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const result = await response.json();

                if (result.success) {
                    setPeople(result.data);
                }
            } catch (err) {
                console.error("Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPeople();
    }, []);

    const chairperson = people.find(p =>
        p.role.toLowerCase().includes("chairperson") ||
        p.role.toLowerCase().includes("director")
    );

    const teamMembers = people.filter(p => p._id !== chairperson?._id);

    return (
        <div className="people-page">
            <div className="people-container">

                {loading && (
                    <div className="people-loader-wrapper">
                        <div className="people-loader"></div>
                        <p className="people-loading-text">Loading Team Data...</p>
                    </div>
                )}

                {error && <div className="people-error-msg">Error: {error}</div>}

                {!loading && !error && (
                    <>
                        {/* 1. CHAIRPERSON SECTION */}
                        {chairperson && (
                            <section className="people-chair-section">
                                <h2 className="people-cat-title">Head of Center</h2>
                                <div className="people-chair-wrapper">
                                    <PersonCard data={chairperson} isChairperson={true} />
                                </div>
                            </section>
                        )}

                        {/* 2. TEAM GRID */}
                        <section className="people-grid-section">
                            <h2 className="people-cat-title">Faculty & Associates</h2>
                            <div className="people-grid">
                                {teamMembers.length > 0 ? (
                                    teamMembers.map((person) => (
                                        <PersonCard key={person._id} data={person} />
                                    ))
                                ) : (
                                    <p>No other members found.</p>
                                )}
                            </div>
                        </section>
                    </>
                )}
            </div>
        </div>
    );
}

export default People;