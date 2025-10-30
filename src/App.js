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
  const [darkMode, setDarkMode] = useState(true);
  const [message, setMessage] = useState("");
  const [showResults, setShowResults] = useState(false);
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-10 w-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4 text-slate-800 dark:text-white">
              <div className="size-6 text-primary">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262Z" fill="currentColor" fillRule="evenodd"/>
                </svg>
              </div>
              <h1 className="text-slate-800 dark:text-white text-lg font-bold">Student Portfolio Management</h1>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex cursor-pointer items-center justify-center rounded-lg h-10 w-10 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
            >
              <span className="material-symbols-outlined dark:hidden">dark_mode</span>
              <span className="material-symbols-outlined hidden dark:inline">light_mode</span>
            </button>
          </div>
        </div>
      </header>

              <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col gap-12">
          {/* Form Section */}
          <section className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight">Add New Project</h2>
                <p className="text-slate-500 dark:text-slate-400 text-base">Fill in the details below to add a new project to the portfolio.</p>
              </div>
            </div>
            <ProjectForm
              onSave={handleSave}
              editingProject={editingProject}
              cancelEdit={cancelEdit}
            />
          </section>

          {/* Portfolio Display Section */}
          <section>
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight">Current Portfolios</h2>
                {projects.length > 0 && (
                  <button
                    onClick={() => exportToCSV(projects)}
                    className="px-4 h-10 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">download</span>
                    Export CSV
                  </button>
                )}
              </div>
              <div className="relative w-full sm:w-auto min-w-72 flex gap-2">
                <div className="relative flex-grow">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Search by name or title..."
                    value={search}
                    onChange={handleInputChange}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                    className="form-input flex w-full rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 pl-10 pr-4 text-base"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-6 h-12 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">search</span>
                  Search
                </button>
              </div>
            </div>

            {message && (
              <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg dark:bg-green-800 dark:text-green-100 transition-all duration-500 animate-fade-in">
                {message}
              </div>
            )}

            {showResults ? (
              <ProjectList
                projects={filteredProjects}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : projects.length > 0 ? (
              <ProjectList
                projects={projects}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <div className="sm:col-span-2 lg:col-span-3 flex flex-col items-center justify-center text-center bg-slate-50 dark:bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 p-12">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-3xl text-primary">add</span>
                </div>
                <h3 className="text-slate-900 dark:text-white text-lg font-bold">No projects found</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Add a new project using the form above to get started.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
