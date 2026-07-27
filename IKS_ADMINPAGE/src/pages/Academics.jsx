import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  ArrowLeft,
  Loader2,
  BookOpen,
  GraduationCap,
  Target,
  FileText,
  Layers,
  X,
  Check
} from "lucide-react";  
import { useNavigate } from "react-router-dom";
import "../css/Academics.css";

const Academics = () => {
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState(null);
  
  // Full schema state mapping with proper array structures
  const [formData, setFormData] = useState({
    courseName: "",
    courseCode: "",
    courseType: "",
    prerequisite: "",
    creditsLecture: 0,
    creditsTutorial: 0,
    creditsPractical: 0,
    creditsTotal: 0,
    objectives: [],
    units: [],
    outcomes: [],
    textbooks: [],
    referenceBooks: [],
    isActive: true,
  });

  // Temporary inputs for dynamic list additions
  const [tempInput, setTempInput] = useState({
    objective: "",
    unit: "",
    outcome: "",
    textbook: "",
    referenceBook: "",
  });

  // Editing state for individual dynamic items
  const [editingIndex, setEditingIndex] = useState({ field: null, index: null });
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    getAllCourses();
  }, []);

  const getAllCourses = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/academics/getAllCourses`);
      const result = await response.json();
      if (response.ok) {
        setCourses(result.data || []);
      } else {
        setCourses([]);
      }
    } catch (err) {
      console.error("Error pulling course directory:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTempInputChange = (e) => {
    const { name, value } = e.target;
    setTempInput((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Ctrl + Enter for multi-line insertion in textareas
  const handleTextareaKeyDown = (e, keyName) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      const target = e.target;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const value = tempInput[keyName];

      const newValue = value.substring(0, start) + "\n" + value.substring(end);
      setTempInput((prev) => ({ ...prev, [keyName]: newValue }));

      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 1;
      }, 0);
    }
  };

  // Dynamic Array Management Handlers
  const addItem = (field, keyName) => {
    const val = tempInput[keyName].trim();
    if (!val) return;

    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], field === "units" ? { title: val, topics: [] } : val],
    }));

    setTempInput((prev) => ({ ...prev, [keyName]: "" }));
  };

  const removeItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const startEditingItem = (field, index, currentVal) => {
    setEditingIndex({ field, index });
    setEditValue(field === "units" ? currentVal.title : currentVal);
  };

  const saveEditingItem = (field, index) => {
    if (!editValue.trim()) return;
    setFormData((prev) => {
      const updated = [...prev[field]];
      if (field === "units") {
        updated[index] = { ...updated[index], title: editValue.trim() };
      } else {
        updated[index] = editValue.trim();
      }
      return { ...prev, [field]: updated };
    });
    setEditingIndex({ field: null, index: null });
    setEditValue("");
  };

  const resetForm = () => {
    setFormData({
      courseName: "",
      courseCode: "",
      courseType: "",
      prerequisite: "",
      creditsLecture: 0,
      creditsTutorial: 0,
      creditsPractical: 0,
      creditsTotal: 0,
      objectives: [],
      units: [],
      outcomes: [],
      textbooks: [],
      referenceBooks: [],
      isActive: true,
    });
    setTempInput({ objective: "", unit: "", outcome: "", textbook: "", referenceBook: "" });
    setEditingIndex({ field: null, index: null });
    setSelectedCourse(null);
  };

  const handleAddCourseClick = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const submitAddCourse = async (e) => {
    e.preventDefault();
    if (!formData.courseName.trim()) return alert("Course Name is required!");

    setSubmitLoading(true);
    try {
      const payload = {
        courseName: formData.courseName.trim(),
        courseCode: formData.courseCode.trim(),
        courseType: formData.courseType.trim(),
        prerequisite: formData.prerequisite.trim(),
        credits: {
          lecture: Number(formData.creditsLecture) || 0,
          tutorial: Number(formData.creditsTutorial) || 0,
          practical: Number(formData.creditsPractical) || 0,
          total: Number(formData.creditsTotal) || 0,
        },
        objectives: formData.objectives,
        units: formData.units,
        outcomes: formData.outcomes,
        textbooks: formData.textbooks,
        referenceBooks: formData.referenceBooks,
        isActive: Boolean(formData.isActive),
      };

      const response = await fetch(`${BACKEND_URL}/academics/addCourse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        setIsAddModalOpen(false);
        resetForm();
        getAllCourses();
      } else {
        alert(result.message || "Failed to create course.");
      }
    } catch (err) {
      console.error(err);
      alert("Network exception encountered while adding course.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditClick = (course) => {
    setSelectedCourse(course);
    setFormData({
      courseName: course.courseName || "",
      courseCode: course.courseCode || "",
      courseType: course.courseType || "",
      prerequisite: course.prerequisite || "",
      creditsLecture: course.credits?.lecture || 0,
      creditsTutorial: course.credits?.tutorial || 0,
      creditsPractical: course.credits?.practical || 0,
      creditsTotal: course.credits?.total || 0,
      objectives: course.objectives || [],
      units: course.units || [],
      outcomes: course.outcomes || [],
      textbooks: course.textbooks || [],
      referenceBooks: course.referenceBooks || [],
      isActive: course.isActive !== undefined ? course.isActive : true,
    });
    setIsEditModalOpen(true);
  };

  const submitEditCourse = async (e) => {
    e.preventDefault();
    if (!selectedCourse) return;

    setSubmitLoading(true);
    try {
      const payload = {
        courseName: formData.courseName.trim(),
        courseCode: formData.courseCode.trim(),
        courseType: formData.courseType.trim(),
        prerequisite: formData.prerequisite.trim(),
        credits: {
          lecture: Number(formData.creditsLecture) || 0,
          tutorial: Number(formData.creditsTutorial) || 0,
          practical: Number(formData.creditsPractical) || 0,
          total: Number(formData.creditsTotal) || 0,
        },
        objectives: formData.objectives,
        units: formData.units,
        outcomes: formData.outcomes,
        textbooks: formData.textbooks,
        referenceBooks: formData.referenceBooks,
        isActive: Boolean(formData.isActive),
      };

      const response = await fetch(`${BACKEND_URL}/academics/updateCourse/${selectedCourse._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        setIsEditModalOpen(false);
        resetForm();
        getAllCourses();
      } else {
        alert(result.message || "Failed to update course.");
      }
    } catch (err) {
      console.error(err);
      alert("Network exception encountered while updating course.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    const match = courses.find((c) => c._id === id);
    setSelectedCourse(match);
    setIsDeleteModalOpen(true);
  };

  const submitDeleteCourse = async () => {
    if (!selectedCourse) return;

    setSubmitLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/academics/deleteCourse/${selectedCourse._id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (response.ok) {
        setIsDeleteModalOpen(false);
        setSelectedCourse(null);
        getAllCourses();
      } else {
        alert(result.message || "Failed to delete course.");
      }
    } catch (err) {
      console.error(err);
      alert("Network exception encountered while removing course.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    resetForm();
  };

  return (
    <div className="academics-admin-container" style={{ paddingBottom: "80px" }}>
      {/* --- Page Header Layout Area --- */}
      <div className="page-header">
        <button onClick={() => navigate("/")} className="btn-link">
          <ArrowLeft size={20} />
          <span style={{ fontWeight: 500 }}>Dashboard</span>
        </button>

        <button className="btn btn-primary" onClick={handleAddCourseClick}>
          <Plus size={20} />
          Add Course
        </button>
      </div>

      {/* --- Grid / Async State Renderer --- */}
      {loading ? (
        <div className="loading-container">
          <Loader2 className="spin" size={30} />
          <p>Loading Courses...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="loading-container">
          <BookOpen size={60} />
          <h3>No Courses Found</h3>
          <p>Click "Add Course" to create one.</p>
        </div>
      ) : (
        <div className="dashboard-grid">
          {courses.map((course) => (
            <div key={course._id} className="event-card">
              
              <div className="event-actions">
                <button className="btn-icon" onClick={() => handleEditClick(course)} title="Edit Course">
                  <Edit2 size={16} />
                </button>
                <button className="btn-icon delete" onClick={() => handleDeleteClick(course._id)} title="Delete Course">
                  <Trash2 size={16} />
                </button>
              </div>

              <h3 className="event-title" title={course.courseName}>
                {course.courseName}
              </h3>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
                <span className="event-status">{course.courseType || "General"}</span>
                <span className={`event-status ${course.isActive ? "active" : "inactive"}`}>
                  {course.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="event-detail-row">
                <BookOpen size={15} />
                <span>Code: {course.courseCode || "N/A"}</span>
              </div>

              <div className="event-detail-row">
                <FileText size={15} />
                <span>Prerequisite: {course.prerequisite || "None"}</span>
              </div>

              <div className="event-detail-row">
                <GraduationCap size={15} />
                <span>
                  Credits (L-T-P-C): {course.credits?.lecture ?? 0} - {course.credits?.tutorial ?? 0} - {course.credits?.practical ?? 0} - <strong>{course.credits?.total ?? 0}</strong>
                </span>
              </div>

              <div className="event-detail-row">
                <Layers size={15} />
                <span>Units: {course.units?.length ?? 0} | Objectives: {course.objectives?.length ?? 0}</span>
              </div>

              <div className="event-detail-row">
                <Target size={15} />
                <span>Outcomes: {course.outcomes?.length ?? 0} | Books: {(course.textbooks?.length ?? 0) + (course.referenceBooks?.length ?? 0)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- Addition & Modification Portal Overlay --- */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{isAddModalOpen ? "Add New Course" : "Edit Course Details"}</h2>
              <button className="btn-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={isAddModalOpen ? submitAddCourse : submitEditCourse}>
              <div className="form-group">
                <label>Course Name *</label>
                <input
                  type="text"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Quantum Computing Basics"
                />
              </div>

              <div style={{ display: "flex", gap: "15px" }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Course Code</label>
                  <input
                    type="text"
                    name="courseCode"
                    value={formData.courseCode}
                    onChange={handleInputChange}
                    placeholder="e.g., QC-401"
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Course Type</label>
                  <input
                    type="text"
                    name="courseType"
                    value={formData.courseType}
                    onChange={handleInputChange}
                    placeholder="e.g., Core / Elective"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Prerequisite</label>
                <input
                  type="text"
                  name="prerequisite"
                  value={formData.prerequisite}
                  onChange={handleInputChange}
                  placeholder="e.g., Linear Algebra"
                />
              </div>

              {/* Credits Breakdown Group */}
              <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#334155", display: "block", marginBottom: "8px" }}>
                  Credits Breakdown
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                  <div className="form-group">
                    <label style={{ fontSize: "0.75rem" }}>Lecture</label>
                    <input
                      type="number"
                      name="creditsLecture"
                      value={formData.creditsLecture}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: "0.75rem" }}>Tutorial</label>
                    <input
                      type="number"
                      name="creditsTutorial"
                      value={formData.creditsTutorial}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: "0.75rem" }}>Practical</label>
                    <input
                      type="number"
                      name="creditsPractical"
                      value={formData.creditsPractical}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: "0.75rem" }}>Total</label>
                    <input
                      type="number"
                      name="creditsTotal"
                      value={formData.creditsTotal}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* --- UNITS MANAGER --- */}
              <div className="form-group" style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <label>Units</label>
                <div style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "flex-start" }}>
                  <textarea
                    name="unit"
                    value={tempInput.unit}
                    onChange={handleTempInputChange}
                    onKeyDown={(e) => handleTextareaKeyDown(e, "unit")}
                    placeholder="Enter unit description or title... (Ctrl + Enter for new line)"
                    rows={2}
                  />
                  <button type="button" className="btn btn-primary" onClick={() => addItem("units", "unit")} style={{ alignSelf: "flex-start" }}>
                    <Plus size={16} /> Add
                  </button>
                </div>
                <div className="dynamic-list-container">
                  {formData.units.length === 0 ? (
                    <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0 }}>No units added yet.</p>
                  ) : (
                    formData.units.map((u, idx) => (
                      <div key={idx} className="dynamic-list-item" style={{ alignItems: "flex-start" }}>
                        {editingIndex.field === "units" && editingIndex.index === idx ? (
                          <>
                            <textarea
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              rows={2}
                              style={{ flex: 1, padding: "6px 10px", fontSize: "0.85rem", borderRadius: "6px", border: "1px solid #cbd5e1", resize: "vertical", fontFamily: "inherit" }}
                            />
                            <button type="button" className="btn-icon" onClick={() => saveEditingItem("units", idx)} style={{ alignSelf: "flex-start" }}>
                              <Check size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <span style={{ flex: 1, fontSize: "0.875rem", color: "#334155", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{u.title}</span>
                            <button type="button" className="btn-icon" onClick={() => startEditingItem("units", idx, u)}>
                              <Edit2 size={14} />
                            </button>
                            <button type="button" className="btn-icon delete" onClick={() => removeItem("units", idx)}>
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* --- OBJECTIVES MANAGER --- */}
              <div className="form-group" style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <label>Objectives</label>
                <div style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "flex-start" }}>
                  <textarea
                    name="objective"
                    value={tempInput.objective}
                    onChange={handleTempInputChange}
                    onKeyDown={(e) => handleTextareaKeyDown(e, "objective")}
                    placeholder="Enter objective... (Ctrl + Enter for new line)"
                    rows={2}
                  />
                  <button type="button" className="btn btn-primary" onClick={() => addItem("objectives", "objective")} style={{ alignSelf: "flex-start" }}>
                    <Plus size={16} /> Add
                  </button>
                </div>
                <div className="dynamic-list-container">
                  {formData.objectives.length === 0 ? (
                    <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0 }}>No objectives added yet.</p>
                  ) : (
                    formData.objectives.map((obj, idx) => (
                      <div key={idx} className="dynamic-list-item" style={{ alignItems: "flex-start" }}>
                        {editingIndex.field === "objectives" && editingIndex.index === idx ? (
                          <>
                            <textarea
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              rows={2}
                              style={{ flex: 1, padding: "6px 10px", fontSize: "0.85rem", borderRadius: "6px", border: "1px solid #cbd5e1", resize: "vertical", fontFamily: "inherit" }}
                            />
                            <button type="button" className="btn-icon" onClick={() => saveEditingItem("objectives", idx)} style={{ alignSelf: "flex-start" }}>
                              <Check size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <span style={{ flex: 1, fontSize: "0.875rem", color: "#334155", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{obj}</span>
                            <button type="button" className="btn-icon" onClick={() => startEditingItem("objectives", idx, obj)}>
                              <Edit2 size={14} />
                            </button>
                            <button type="button" className="btn-icon delete" onClick={() => removeItem("objectives", idx)}>
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* --- OUTCOMES MANAGER --- */}
              <div className="form-group" style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <label>Outcomes</label>
                <div style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "flex-start" }}>
                  <textarea
                    name="outcome"
                    value={tempInput.outcome}
                    onChange={handleTempInputChange}
                    onKeyDown={(e) => handleTextareaKeyDown(e, "outcome")}
                    placeholder="Enter outcome... (Ctrl + Enter for new line)"
                    rows={2}
                  />
                  <button type="button" className="btn btn-primary" onClick={() => addItem("outcomes", "outcome")} style={{ alignSelf: "flex-start" }}>
                    <Plus size={16} /> Add
                  </button>
                </div>
                <div className="dynamic-list-container">
                  {formData.outcomes.length === 0 ? (
                    <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0 }}>No outcomes added yet.</p>
                  ) : (
                    formData.outcomes.map((out, idx) => (
                      <div key={idx} className="dynamic-list-item" style={{ alignItems: "flex-start" }}>
                        {editingIndex.field === "outcomes" && editingIndex.index === idx ? (
                          <>
                            <textarea
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              rows={2}
                              style={{ flex: 1, padding: "6px 10px", fontSize: "0.85rem", borderRadius: "6px", border: "1px solid #cbd5e1", resize: "vertical", fontFamily: "inherit" }}
                            />
                            <button type="button" className="btn-icon" onClick={() => saveEditingItem("outcomes", idx)} style={{ alignSelf: "flex-start" }}>
                              <Check size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <span style={{ flex: 1, fontSize: "0.875rem", color: "#334155", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{out}</span>
                            <button type="button" className="btn-icon" onClick={() => startEditingItem("outcomes", idx, out)}>
                              <Edit2 size={14} />
                            </button>
                            <button type="button" className="btn-icon delete" onClick={() => removeItem("outcomes", idx)}>
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* --- TEXTBOOKS MANAGER --- */}
              <div className="form-group" style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <label>Textbooks</label>
                <div style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "flex-start" }}>
                  <textarea
                    name="textbook"
                    value={tempInput.textbook}
                    onChange={handleTempInputChange}
                    onKeyDown={(e) => handleTextareaKeyDown(e, "textbook")}
                    placeholder="Enter textbook... (Ctrl + Enter for new line)"
                    rows={2}
                  />
                  <button type="button" className="btn btn-primary" onClick={() => addItem("textbooks", "textbook")} style={{ alignSelf: "flex-start" }}>
                    <Plus size={16} /> Add
                  </button>
                </div>
                <div className="dynamic-list-container">
                  {formData.textbooks.length === 0 ? (
                    <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0 }}>No textbooks added yet.</p>
                  ) : (
                    formData.textbooks.map((tb, idx) => (
                      <div key={idx} className="dynamic-list-item" style={{ alignItems: "flex-start" }}>
                        {editingIndex.field === "textbooks" && editingIndex.index === idx ? (
                          <>
                            <textarea
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              rows={2}
                              style={{ flex: 1, padding: "6px 10px", fontSize: "0.85rem", borderRadius: "6px", border: "1px solid #cbd5e1", resize: "vertical", fontFamily: "inherit" }}
                            />
                            <button type="button" className="btn-icon" onClick={() => saveEditingItem("textbooks", idx)} style={{ alignSelf: "flex-start" }}>
                              <Check size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <span style={{ flex: 1, fontSize: "0.875rem", color: "#334155", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{tb}</span>
                            <button type="button" className="btn-icon" onClick={() => startEditingItem("textbooks", idx, tb)}>
                              <Edit2 size={14} />
                            </button>
                            <button type="button" className="btn-icon delete" onClick={() => removeItem("textbooks", idx)}>
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* --- REFERENCE BOOKS MANAGER --- */}
              <div className="form-group" style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <label>Reference Books</label>
                <div style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "flex-start" }}>
                  <textarea
                    name="referenceBook"
                    value={tempInput.referenceBook}
                    onChange={handleTempInputChange}
                    onKeyDown={(e) => handleTextareaKeyDown(e, "referenceBook")}
                    placeholder="Enter reference book... (Ctrl + Enter for new line)"
                    rows={2}
                  />
                  <button type="button" className="btn btn-primary" onClick={() => addItem("referenceBooks", "referenceBook")} style={{ alignSelf: "flex-start" }}>
                    <Plus size={16} /> Add
                  </button>
                </div>
                <div className="dynamic-list-container">
                  {formData.referenceBooks.length === 0 ? (
                    <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0 }}>No reference books added yet.</p>
                  ) : (
                    formData.referenceBooks.map((rb, idx) => (
                      <div key={idx} className="dynamic-list-item" style={{ alignItems: "flex-start" }}>
                        {editingIndex.field === "referenceBooks" && editingIndex.index === idx ? (
                          <>
                            <textarea
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              rows={2}
                              style={{ flex: 1, padding: "6px 10px", fontSize: "0.85rem", borderRadius: "6px", border: "1px solid #cbd5e1", resize: "vertical", fontFamily: "inherit" }}
                            />
                            <button type="button" className="btn-icon" onClick={() => saveEditingItem("referenceBooks", idx)} style={{ alignSelf: "flex-start" }}>
                              <Check size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <span style={{ flex: 1, fontSize: "0.875rem", color: "#334155", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{rb}</span>
                            <button type="button" className="btn-icon" onClick={() => startEditingItem("referenceBooks", idx, rb)}>
                              <Edit2 size={14} />
                            </button>
                            <button type="button" className="btn-icon delete" onClick={() => removeItem("referenceBooks", idx)}>
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="form-group" style={{ flexDirection: "row", alignItems: "center", gap: "10px", marginTop: "4px" }}>
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActiveCheck"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
                <label htmlFor="isActiveCheck" style={{ cursor: "pointer", margin: 0 }}>Is Course Active?</label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitLoading}>
                  {submitLoading ? <Loader2 className="spin" size={16} /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Destructive Warning / Safety Modal --- */}
      {isDeleteModalOpen && selectedCourse && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Confirm Deletion</h2>
              <button className="btn-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <p style={{ margin: "16px 0", color: "#475569", lineHeight: "1.5" }}>
              Are you sure you want to permanently drop <strong>{selectedCourse.courseName}</strong>? This will clear its record from database collections.
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={submitDeleteCourse} disabled={submitLoading}>
                {submitLoading ? <Loader2 className="spin" size={16} /> : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Academics;