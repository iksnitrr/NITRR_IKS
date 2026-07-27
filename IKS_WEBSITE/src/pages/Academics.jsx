import React, { useEffect, useState } from "react";
import { Book, GraduationCap, CheckCircle, BookOpen, Target, FileText, Layers, Bookmark } from "lucide-react";
import ErrorState from "../components/ErrorState";
import "../css/AcademicsUI.css";

const Academics = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllCourses();
  }, []);

  const getAllCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/academics/getAllCourses`);
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      const data = await response.json();
      setCourses(data.data || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError(err.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <h2>Loading Courses...</h2>
      </div>
    );
  }

  return (
    <div className="academics-page-container">
      {/* Header Section */}
      <div className="page-header">
        <h1>Academic Courses</h1>
        <div className="header-underline"></div>
      </div>

      {/* Main Archive Section */}
      <div className="archive-section">
        <h2 className="archive-title">Course Directory</h2>

        {error ? (
          <ErrorState
            title="Unable to Load Academic Courses"
            onRetry={getAllCourses}
          />
        ) : (
          <div className="courses-list">
            {courses.length === 0 ? (
              <p className="no-data-text">No academic courses available at the moment.</p>
            ) : (
            courses.map((course) => (
              <div key={course._id} className="course-full-card">
                
                {/* Header metadata row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                  <div className="course-badge">
                    {course.courseType ? course.courseType.toUpperCase() : "GENERAL"}
                  </div>
                  <span className={`course-status-pill ${course.isActive !== false ? "active" : "inactive"}`}>
                    {course.isActive !== false ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Course Title */}
                <h2 className="course-title">{course.courseName}</h2>

                {/* Details Grid Box */}
                <div className="course-info-box">
                  <div className="info-item">
                    <Book size={18} className="info-icon" />
                    <span><strong>Code:</strong> {course.courseCode || "N/A"}</span>
                  </div>
                  <div className="info-item">
                    <GraduationCap size={18} className="info-icon" />
                    <span>
                      <strong>Credits (L-T-P-C):</strong> {course.credits?.lecture ?? 0} - {course.credits?.tutorial ?? 0} - {course.credits?.practical ?? 0} - {course.credits?.total ?? 0}
                    </span>
                  </div>
                  <div className="info-item">
                    <CheckCircle size={18} className="info-icon" />
                    <span><strong>Prerequisite:</strong> {course.prerequisite || "None"}</span>
                  </div>
                </div>

                {/* Course Objectives */}
                {course.objectives && course.objectives.length > 0 && (
                  <div className="course-sub-section">
                    <h3 className="section-heading">
                      <Target size={18} /> Course Objectives
                    </h3>
                    <ol className="styled-list">
                      {course.objectives.map((obj, idx) => (
                        <li key={idx} style={{ whiteSpace: "pre-wrap", marginBottom: "8px" }}>
                          {obj}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                <hr className="dotted-divider" />

                {/* Course Content / Units (Full Width Stack) */}
                <div className="course-units-section">
                  <h3 className="section-heading">
                    <Layers size={18} /> Course Content / Units
                  </h3>
                  
                  {course.units && course.units.length > 0 ? (
                    <div className="units-grid">
                      {course.units.map((unit, index) => (
                        <div key={index} className="unit-card">
                          <h4>Unit {index + 1}: {unit.title}</h4>
                          {unit.topics && unit.topics.length > 0 && (
                            <ul>
                              {unit.topics.map((topic, i) => (
                                <li key={i} style={{ whiteSpace: "pre-wrap" }}>{topic}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-data-text">Syllabus units are not uploaded yet.</p>
                  )}
                </div>

                {/* Course Outcomes */}
                {course.outcomes && course.outcomes.length > 0 && (
                  <>
                    <hr className="dotted-divider" />
                    <div className="course-sub-section">
                      <h3 className="section-heading">
                        <FileText size={18} /> Course Outcomes
                      </h3>
                      <ol className="styled-list">
                        {course.outcomes.map((out, idx) => (
                          <li key={idx} style={{ whiteSpace: "pre-wrap", marginBottom: "8px" }}>
                            {out}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </>
                )}

                {/* Textbooks & Reference Books (Stacked Full-Width Sections) */}
                {((course.textbooks && course.textbooks.length > 0) || (course.referenceBooks && course.referenceBooks.length > 0)) && (
                  <>
                    <hr className="dotted-divider" />
                    <div className="books-container">
                      {course.textbooks && course.textbooks.length > 0 && (
                        <div className="book-section-card">
                          <h3 className="section-heading">
                            <Bookmark size={18} /> Textbooks
                          </h3>
                          <ol className="styled-list">
                            {course.textbooks.map((tb, idx) => (
                              <li key={idx} style={{ whiteSpace: "pre-wrap", marginBottom: "8px" }}>
                                {tb}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {course.referenceBooks && course.referenceBooks.length > 0 && (
                        <div className="book-section-card">
                          <h3 className="section-heading">
                            <Bookmark size={18} /> Reference Books
                          </h3>
                          <ol className="styled-list">
                            {course.referenceBooks.map((rb, idx) => (
                              <li key={idx} style={{ whiteSpace: "pre-wrap", marginBottom: "8px" }}>
                                {rb}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  </>
                )}

              </div>
            ))
          )}
        </div>
        )}
      </div>
    </div>
  );
};

export default Academics;