import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/api";

export default function AdminProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProjectId, setEditingProjectId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    image: "",
    github_link: "",
    live_link: "",
    live_demo: "",
    featured: 0,
    category: "",
  });
  const [uploading, setUploading] = useState(false);
  const [projectFilter, setProjectFilter] = useState("all");

  // ========================
  // GET PROJECTS
  // ========================
  const fetchProjects = async () => {
    try {
      setLoading(true);

      const res = await authFetch("/api/projects");
      const data = await res.json();

      setProjects(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ========================
  // INPUT HANDLE
  // ========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "featured" ? Number(value) : value,
    }));
  };

  // ========================
  // VALIDATION
  // ========================
  const validateForm = () => {
    if (!formData.title.trim()) return "Title required";
    if (!formData.description.trim()) return "Description required";
    if (!formData.image.trim()) return "Image required";
    return null;
  };

  // ========================
  // ADD PROJECT
  // ========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    try {
      const method = editingProjectId ? "PUT" : "POST";
      const url = editingProjectId
        ? `/api/projects/${editingProjectId}`
        : "/api/projects";

      const res = await authFetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error");
        return;
      }

      alert(editingProjectId ? "Project updated successfully ✅" : "Project added successfully 🚀");

      setFormData({
        title: "",
        description: "",
        technologies: "",
        image: "",
        github_link: "",
        live_link: "",
        live_demo: "",
        featured: 0,
        category: "",
      });
      setEditingProjectId(null);

      fetchProjects();
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formDataToSend = new FormData();
    formDataToSend.append("file", file);

    try {
      setUploading(true);
      const res = await authFetch("/api/upload", {
        method: "POST",
        body: formDataToSend,
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Upload failed");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: data.url,
      }));
      alert("Image uploaded successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleEditProject = (project) => {
    setEditingProjectId(project.id);
    setFormData({
      title: project.title || "",
      description: project.description || "",
      technologies: project.technologies || "",
      image: project.image || "",
      github_link: project.github_link || "",
      live_link: project.live_link || "",
      live_demo: project.live_demo || "",
      featured: Number(project.featured) || 0,
      category: project.category || "",
    });
  };

  const cancelEdit = () => {
    setEditingProjectId(null);
    setFormData({
      title: "",
      description: "",
      technologies: "",
      image: "",
      github_link: "",
      live_link: "",
      live_demo: "",
      featured: 0,
      category: "",
    });
  };

  // ========================
  // DELETE PROJECT
  // ========================
  const deleteProject = async (id) => {
    const ok = window.confirm("Delete this project?");
    if (!ok) return;

    try {
      await authFetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      fetchProjects();
    } catch (error) {
      console.error(error);
    }
  };

  const categories = [
    "all",
    ...new Set(projects.map((p) => p.category || "Uncategorized")),
  ];

  const displayedProjects =
    projectFilter === "all"
      ? projects
      : projects.filter(
          (project) => (project.category || "Uncategorized") === projectFilter
        );

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-4xl font-bold">
          🚀 Projects Manager
        </h1>
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="self-start sm:self-auto bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-6 rounded-3xl mb-10 grid md:grid-cols-2 gap-5"
      >
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Project Title"
          className="bg-slate-700 p-4 rounded-xl outline-none"
        />

        <input
          name="technologies"
          value={formData.technologies}
          onChange={handleChange}
          placeholder="React, Node.js, MySQL"
          className="bg-slate-700 p-4 rounded-xl outline-none"
        />

        <input
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="bg-slate-700 p-4 rounded-xl outline-none"
        />

        <div className="bg-slate-700 p-4 rounded-xl">
          <label className="block text-sm text-gray-300 mb-2">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="w-full text-sm text-white"
          />
          {uploading && (
            <p className="text-xs text-gray-400 mt-2">
              Uploading image...
            </p>
          )}
        </div>

        <input
          name="github_link"
          value={formData.github_link}
          onChange={handleChange}
          placeholder="GitHub Link"
          className="bg-slate-700 p-4 rounded-xl outline-none"
        />

        <input
          name="live_link"
          value={formData.live_link}
          onChange={handleChange}
          placeholder="Live Link"
          className="bg-slate-700 p-4 rounded-xl outline-none"
        />

        <input
          name="live_demo"
          value={formData.live_demo}
          onChange={handleChange}
          placeholder="Live Demo"
          className="bg-slate-700 p-4 rounded-xl outline-none"
        />

        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          className="bg-slate-700 p-4 rounded-xl outline-none"
        />

        {/* FEATURED */}
        <select
          name="featured"
          value={formData.featured}
          onChange={handleChange}
          className="bg-slate-700 p-4 rounded-xl outline-none"
        >
          <option value={0}>Normal</option>
          <option value={1}>Featured</option>
        </select>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Project Description"
          className="bg-slate-700 p-4 rounded-xl outline-none md:col-span-2 h-32"
        />

        <button
          type="submit"
          className="bg-cyan-500 hover:bg-cyan-600 p-4 rounded-xl font-bold md:col-span-2"
        >
          {editingProjectId ? "Save Changes" : "➕ Add Project"}
        </button>

        {editingProjectId && (
          <button
            type="button"
            onClick={cancelEdit}
            className="bg-gray-600 hover:bg-gray-700 p-4 rounded-xl font-bold md:col-span-2"
          >
            Cancel Edit
          </button>
        )}
      </form>

      <div className="flex flex-wrap gap-3 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setProjectFilter(category)}
            className={`px-4 py-2 rounded-full transition ${
              projectFilter === category
                ? "bg-cyan-500 text-black"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* ================= LIST ================= */}
      {loading ? (
        <p className="text-gray-400">Loading projects...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {displayedProjects.map((p) => (
            <div
              key={p.id}
              className="bg-slate-800 rounded-3xl p-5"
            >
              <img
                src={p.image}
                className="w-full h-52 object-cover rounded-2xl mb-4"
              />

              <h2 className="text-2xl font-bold">
                {p.title}
              </h2>

              <p className="text-gray-400 mt-2">
                {p.description}
              </p>

              <p className="mt-3 text-cyan-400">
                {p.technologies}
              </p>

              <p className="text-sm text-yellow-400 mt-2">
                {p.featured === 1 ? "⭐ Featured" : ""}
              </p>

              <div className="flex flex-wrap gap-3 mt-5">
                <button
                  onClick={() => handleEditProject(p)}
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-xl"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteProject(p.id)}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl"
                >
                  Delete
                </button>

                {p.github_link && (
                  <a
                    href={p.github_link}
                    target="_blank"
                    className="bg-gray-700 px-4 py-2 rounded-xl"
                  >
                    GitHub
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}