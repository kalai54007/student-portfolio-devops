import React, { useState, useEffect } from "react";

const ProjectForm = ({ onSave, editingProject, cancelEdit }) => {
  const [formData, setFormData] = useState({
    id: null,
    studentName: "",
    projectTitle: "",
    description: "",
    date: "",
    link: "",
  });

  useEffect(() => {
    if (editingProject) setFormData(editingProject);
  }, [editingProject]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.studentName || !formData.projectTitle) return;
    onSave(formData);
    setFormData({
      id: null,
      studentName: "",
      projectTitle: "",
      description: "",
      date: "",
      link: "",
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input
        name="studentName"
        placeholder="Student Name"
        value={formData.studentName}
        onChange={handleChange}
        required
      />
      <input
        name="projectTitle"
        placeholder="Project Title"
        value={formData.projectTitle}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      />
      <input
        name="date"
        type="date"
        value={formData.date}
        onChange={handleChange}
      />
      <input
        name="link"
        placeholder="Project Link"
        value={formData.link}
        onChange={handleChange}
      />
      <button type="submit">
        {editingProject ? "Update Project" : "Add Project"}
      </button>
      {editingProject && (
        <button type="button" onClick={cancelEdit} className="cancel-btn">
          Cancel
        </button>
      )}
    </form>
  );
};

export default ProjectForm;
