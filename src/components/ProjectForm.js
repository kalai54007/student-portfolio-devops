import React, { useState, useEffect } from "react";

function ProjectForm({ onSave, editingProject, cancelEdit }) {
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
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          name="studentName"
          placeholder="Student Name"
          value={formData.studentName}
          onChange={handleChange}
          required
          className="form-input rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
        <input
          name="projectTitle"
          placeholder="Project Title"
          value={formData.projectTitle}
          onChange={handleChange}
          required
          className="form-input rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
      </div>
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="form-textarea rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 min-h-[120px] placeholder:text-slate-400 dark:placeholder:text-slate-500"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          className="form-input rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 h-12"
        />
        <input
          name="link"
          placeholder="Project Link"
          value={formData.link}
          onChange={handleChange}
          className="form-input rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
      </div>
      <div className="flex gap-2 justify-end mt-4">
        {editingProject && (
          <button 
            type="button" 
            onClick={cancelEdit} 
            className="px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
        )}
        <button 
          type="submit"
          className="px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          {editingProject ? "Update Project" : "Add Project"}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
