import React from "react";
import ProjectItem from "./ProjectItem";

const ProjectList = ({ projects, onEdit, onDelete }) => {
  if (projects.length === 0) return <p>No projects found.</p>;

  return (
    <div className="project-list">
      {projects.map((p) => (
        <ProjectItem key={p.id} project={p} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default ProjectList;
