import React, { useState, useEffect } from "react";
import { loadProjects, saveProjects } from "./utils/storage";
import ProjectForm from "./components/ProjectForm";
import ProjectList from "./components/ProjectList";
import "./App.css";

// Function to export data to CSV
const exportToCSV = (data) => {
  const headers = ["Student Name", "Project Title", "Description", "Date", "Link"];
  const csvContent = [
    headers.join(","),
    ...data.map(project => [
      `"${project.studentName}"`,
      `"${project.projectTitle}"`,
      `"${project.description}"`,
      `"${project.date}"`,
      `"${project.link}"`
    ].join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "student_projects.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

function App() {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [search, setSearch] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [message, setMessage] = useState("");
  const [showResults, setShowResults] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const isDark = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    const stored = loadProjects();
    setProjects(stored);
    setFilteredProjects(stored);
  }, []);

  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  const handleSave = (project) => {
    let updated;
    if (project.id) {
      updated = projects.map((p) => (p.id === project.id ? project : p));
      setMessage("✅ Project updated successfully!");
    } else {
      updated = [...projects, { ...project, id: Date.now().toString() }];
      setMessage("✅ Project added successfully!");
    }
    setProjects(updated);
    setFilteredProjects(updated);
    setEditingProject(null);
    setTimeout(() => setMessage(""), 2000);
  };

  const handleEdit = (project) => setEditingProject(project);

  const handleDelete = (id) => {
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    setFilteredProjects(updated);
    setMessage("🗑️ Project deleted successfully!");
    setTimeout(() => setMessage(""), 2000);
  };

  const cancelEdit = () => setEditingProject(null);

  const handleSearch = () => {
    if (!search.trim()) {
      setFilteredProjects([]);
      setShowResults(false);
      return;
    }
    const result = projects.filter(
      (p) =>
        p.studentName.toLowerCase().includes(search.toLowerCase()) ||
        p.projectTitle.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProjects(result);
    setShowResults(true);
  };

  const handleInputChange = (e) => {
    setSearch(e.target.value);
    if (e.target.value.trim() === '') {
      setShowResults(false);
    }
  };

  return (
    <div className={`min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Student Portfolio Management</h1>
          <div className="flex items-center gap-3">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search by name or project..."
                value={search}
                onChange={handleInputChange}
                className="w-64 h-10 px-4 rounded-l-lg border border-gray-300 dark:border-gray-600 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         dark:bg-gray-800 dark:text-white"
              />
              <button
                onClick={handleSearch}
                className="h-10 px-6 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 
                         transition-colors duration-300"
              >
                Search
              </button>
            </div>
            <button
              onClick={() => {
                const newMode = !darkMode;
                setDarkMode(newMode);
                localStorage.setItem("darkMode", newMode);
                document.documentElement.classList.toggle("dark");
              }}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 
                       dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-300"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
            <button
              onClick={() => exportToCSV(projects)}
              className="h-10 flex items-center gap-2 px-4 bg-green-500 text-white rounded-lg 
                       hover:bg-green-600 transition-colors duration-300"
            >
              <span>⬇️</span>
              <span>Download CSV</span>
            </button>
          </div>
        </header>

        {message && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg dark:bg-green-800 
                         dark:text-green-100 transition-all duration-500 transform animate-fade-in">
            {message}
          </div>
        )}

        <ProjectForm
          onSave={handleSave}
          editingProject={editingProject}
          cancelEdit={cancelEdit}
        />

        {showResults && (
          <div className="mt-8">
            <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {filteredProjects.length > 0 
                  ? `Search Results (${filteredProjects.length})`
                  : "No matching projects found"}
              </h2>
            </div>
            <ProjectList
              projects={filteredProjects}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
