import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/api";

const storyCategories = [
  "education",
  "travel",
  "historical_place",
  "personal",
];

export default function AdminMyStory() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    place_name: "",
    city: "",
    country: "",
    description: "",
    image: "",
    visit_date: "",
    category: "education",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await authFetch("/api/my_story");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
    if (!formData.title.trim() || !formData.place_name.trim()) {
      alert("Title and place name are required");
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/my_story/${editingId}` : "/api/my_story";
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
      alert(editingId ? "Story updated" : "Story added");
      setFormData({
        title: "",
        place_name: "",
        city: "",
        country: "",
        description: "",
        image: "",
        visit_date: "",
        category: "education",
      });
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const editPost = (post) => {
    setEditingId(post.id);
    setFormData({
      title: post.title || "",
      place_name: post.place_name || "",
      city: post.city || "",
      country: post.country || "",
      description: post.description || "",
      image: post.image || "",
      visit_date: post.visit_date || "",
      category: post.category || "education",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: "",
      place_name: "",
      city: "",
      country: "",
      description: "",
      image: "",
      visit_date: "",
      category: "education",
    });
  };

  const deletePost = async (id) => {
    if (!window.confirm("Delete this story item?")) return;
    try {
      await authFetch(`/api/my_story/${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-4xl font-bold">My Story Manager</h1>
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl"
        >
          ← Back to Dashboard
        </button>
      </div>

      <form onSubmit={submitForm} className="grid md:grid-cols-2 gap-5 bg-slate-800 p-6 rounded-3xl mb-10">
        <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="bg-slate-700 p-4 rounded-xl outline-none" />
        <input name="place_name" value={formData.place_name} onChange={handleChange} placeholder="Place Name" className="bg-slate-700 p-4 rounded-xl outline-none" />
        <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="bg-slate-700 p-4 rounded-xl outline-none" />
        <input name="country" value={formData.country} onChange={handleChange} placeholder="Country" className="bg-slate-700 p-4 rounded-xl outline-none" />
        <input name="visit_date" value={formData.visit_date} onChange={handleChange} type="date" className="bg-slate-700 p-4 rounded-xl outline-none" />
        <select name="category" value={formData.category} onChange={handleChange} className="bg-slate-700 p-4 rounded-xl outline-none">
          {storyCategories.map((category) => (
            <option key={category} value={category}>{category.replace(/_/g, ' ')}</option>
          ))}
        </select>
        <input name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" className="bg-slate-700 p-4 rounded-xl outline-none" />
        <div className="bg-slate-700 p-4 rounded-xl">
          <label className="block text-sm text-gray-300 mb-2">Upload Image</label>
          <input type="file" accept="image/*" onChange={handleUpload} className="w-full text-sm text-white" />
          {uploading && <p className="text-xs text-gray-400 mt-2">Uploading image...</p>}
        </div>
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="bg-slate-700 p-4 rounded-xl outline-none md:col-span-2 h-32" />
        <button className="bg-cyan-500 hover:bg-cyan-600 p-4 rounded-xl font-bold md:col-span-2">{editingId ? "Save Story" : "Add Story"}</button>
        {editingId && (
          <button type="button" onClick={cancelEdit} className="bg-gray-600 hover:bg-gray-700 p-4 rounded-xl font-bold md:col-span-2">Cancel Edit</button>
        )}
      </form>

      {loading ? (
        <p className="text-gray-400">Loading story items...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-slate-800 rounded-3xl p-5">
              {post.image && <img src={post.image} alt={post.title} className="w-full h-48 object-cover rounded-2xl mb-4" />}
              <h2 className="text-2xl font-bold">{post.title}</h2>
              <p className="text-cyan-400">{post.place_name}, {post.city}, {post.country}</p>
              <p className="text-gray-300 mt-2">Visited: {post.visit_date}</p>
              <p className="text-gray-300 mt-2">Category: {post.category}</p>
              <p className="text-gray-400 mt-3">{post.description}</p>
              <div className="flex flex-wrap gap-3 mt-5">
                <button onClick={() => editPost(post)} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-xl">Edit</button>
                <button onClick={() => deletePost(post.id)} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
