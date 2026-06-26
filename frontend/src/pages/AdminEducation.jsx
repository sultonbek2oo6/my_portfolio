import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/api";

export default function AdminEducation() {
  const navigate = useNavigate();
  const [educationItems, setEducationItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    institution_name: "",
    degree: "",
    field_of_study: "",
    start_year: "",
    end_year: "",
    description: "",
    image: "",
  });

  const fetchEducation = async () => {
    try {
      setLoading(true);
      const res = await authFetch("/api/education");
      const data = await res.json();
      setEducationItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    try {
      setUploading(true);
      const res = await authFetch("/api/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Upload failed");
        return;
      }
      setFormData((prev) => ({ ...prev, image: data.url }));
      alert("Image uploaded successfully");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!formData.institution_name.trim() || !formData.degree.trim()) {
      alert("Title and degree are required");
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/education/${editingId}` : "/api/education";
      const res = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || data.message || "Save failed");
        return;
      }
      alert(editingId ? "Education updated" : "Education added");
      setFormData({
        institution_name: "",
        degree: "",
        field_of_study: "",
        start_year: "",
        end_year: "",
        description: "",
        image: "",
      });
      setEditingId(null);
      fetchEducation();
    } catch (err) {
      console.error(err);
    }
  };

  const editItem = (item) => {
    setEditingId(item.id);
    setFormData({
      institution_name: item.institution_name || "",
      degree: item.degree || "",
      field_of_study: item.field_of_study || "",
      start_year: item.start_year || "",
      end_year: item.end_year || "",
      description: item.description || "",
      image: item.image || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      institution_name: "",
      degree: "",
      field_of_study: "",
      start_year: "",
      end_year: "",
      description: "",
      image: "",
    });
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this education item?")) return;
    try {
      await authFetch(`/api/education/${id}`, { method: "DELETE" });
      fetchEducation();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-4xl font-bold">Education Manager</h1>
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl"
        >
          ← Back to Dashboard
        </button>
      </div>

      <form onSubmit={submitForm} className="grid md:grid-cols-2 gap-5 bg-slate-800 p-6 rounded-3xl mb-10">
        <input
          name="institution_name"
          value={formData.institution_name}
          onChange={handleChange}
          placeholder="Institution Name"
          className="bg-slate-700 p-4 rounded-xl outline-none"
        />
        <input
          name="degree"
          value={formData.degree}
          onChange={handleChange}
          placeholder="Degree"
          className="bg-slate-700 p-4 rounded-xl outline-none"
        />
        <input
          name="field_of_study"
          value={formData.field_of_study}
          onChange={handleChange}
          placeholder="Field of Study"
          className="bg-slate-700 p-4 rounded-xl outline-none"
        />
        <input
          name="start_year"
          value={formData.start_year}
          onChange={handleChange}
          placeholder="Start Year"
          className="bg-slate-700 p-4 rounded-xl outline-none"
        />
        <input
          name="end_year"
          value={formData.end_year}
          onChange={handleChange}
          placeholder="End Year or leave blank"
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
          <label className="block text-sm text-gray-300 mb-2">Upload Image</label>
          <input type="file" accept="image/*" onChange={handleUpload} className="w-full text-sm text-white" />
          {uploading && <p className="text-xs text-gray-400 mt-2">Uploading image...</p>}
        </div>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="bg-slate-700 p-4 rounded-xl outline-none md:col-span-2 h-32"
        />
        <button className="bg-cyan-500 hover:bg-cyan-600 p-4 rounded-xl font-bold md:col-span-2">
          {editingId ? "Save Education" : "Add Education"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={cancelEdit}
            className="bg-gray-600 hover:bg-gray-700 p-4 rounded-xl font-bold md:col-span-2"
          >
            Cancel Edit
          </button>
        )}
      </form>

      {loading ? (
        <p className="text-gray-400">Loading education items...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {educationItems.map((item) => (
            <div key={item.id} className="bg-slate-800 rounded-3xl p-5">
              {item.image && <img src={item.image} alt={item.institution_name} className="w-full h-48 object-cover rounded-2xl mb-4" />}
              <h2 className="text-2xl font-bold">{item.institution_name}</h2>
              <p className="text-cyan-400">{item.degree} • {item.field_of_study}</p>
              <p className="text-gray-400 mt-2">{item.start_year} — {item.end_year || "Present"}</p>
              <p className="text-gray-300 mt-3">{item.description}</p>
              <div className="flex flex-wrap gap-3 mt-5">
                <button onClick={() => editItem(item)} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-xl">Edit</button>
                <button onClick={() => deleteItem(item.id)} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
