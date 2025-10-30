export const loadProjects = () => {
  const data = localStorage.getItem("projects");
  return data ? JSON.parse(data) : [];
};

export const saveProjects = (projects) => {
  localStorage.setItem("projects", JSON.stringify(projects));
};
