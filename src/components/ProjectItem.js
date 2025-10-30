import React from "react";

const ProjectItem = ({ project, onEdit, onDelete }) => (
  <div className="project-card">
    <h3>{project.projectTitle}</h3>
    <p><b>Student:</b> {project.studentName}</p>
    {project.description && <p>{project.description}</p>}
    {project.date && <p><b>Date:</b> {project.date}</p>}
    {project.link && (
      <p>
        <a href={project.link} target="_blank" rel="noopener noreferrer">
          View Project
        </a>
      </p>
    )}
    <div className="actions">
      <button onClick={() => onEdit(project)}>Edit</button>
      <button onClick={() => onDelete(project.id)} className="delete-btn">
        Delete
      </button>
    </div>
  </div>
);

export default ProjectItem;
