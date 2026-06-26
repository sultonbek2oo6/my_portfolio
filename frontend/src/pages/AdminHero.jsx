import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/api";

export default function AdminHero() {
  const navigate = useNavigate();
  const [hero, setHero] = useState({
    full_name: "",
    title: "",
    description: "",
    hero_image: "",
    resume_file: "",
    button1_text: "",
    button1_link: "",
    button2_text: "",
    button2_link: "",
    availability_text: "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      const res = await authFetch("/api/hero");
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched hero data:", data);
        if (data) {
          setHero(data);
        }
      } else {
        console.warn("Hero fetch not ok, using defaults");
      }
    } catch (err) {
      console.error("Failed to fetch hero data:", err);
      setError("Failed to load hero data");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHero({ ...hero, [name]: value });
    setError("");
    setMessage("");
  };

  const handleImageUpload = async (e, imageType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    setMessage("");
    
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await authFetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        console.log(`✅ File uploaded: ${data.url}`);
        setHero({ ...hero, [imageType]: data.url });
        setMessage(`${imageType === "hero_image" ? "Image" : "File"} uploaded successfully! Now click Save.`);
      } else {
        setError("Upload failed - no URL returned");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Image upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const saveHero = async () => {
    if (!hero.full_name || !hero.title || !hero.description) {
      setError("Full Name, Title, and Description are required!");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const res = await authFetch("/api/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hero),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        console.log("✅ Hero saved successfully");
        setMessage("✅ Hero updated successfully!");
        
        // Refresh to confirm save
        setTimeout(() => {
          fetchHero();
        }, 500);
      } else {
        setError(data.error || "Failed to save hero");
        console.error("Save error response:", data);
      }
    } catch (err) {
      console.error("Save error:", err);
      setError("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteHero = async () => {
    if (!window.confirm("Are you sure you want to delete all hero data? This cannot be undone.")) {
      return;
    }

    setDeleting(true);
    setError("");
    setMessage("");

    try {
      const res = await authFetch("/api/hero", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        console.log("✅ Hero deleted successfully");
        setMessage("✅ Hero data deleted successfully!");
        
        // Reset form
        setTimeout(() => {
          setHero({
            full_name: "",
            title: "",
            description: "",
            hero_image: "",
            resume_file: "",
            button1_text: "",
            button1_link: "",
            button2_text: "",
            button2_link: "",
            availability_text: "",
          });
        }, 1000);
      } else {
        setError(data.error || "Failed to delete hero");
        console.error("Delete error response:", data);
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("Delete failed: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const resetForm = () => {
    setHero({
      full_name: "",
      title: "",
      description: "",
      hero_image: "",
      resume_file: "",
      button1_text: "",
      button1_link: "",
      button2_text: "",
      button2_link: "",
      availability_text: "",
    });
    setError("");
    setMessage("");
  };

  return (
    <div className="p-8 min-h-screen bg-slate-900 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Hero / About</h1>
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Message Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-900/50 border border-red-500 rounded text-red-200">
          ⚠️ {error}
        </div>
      )}

      {message && (
        <div className="mb-4 p-4 bg-green-900/50 border border-green-500 rounded text-green-200">
          {message}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Text Inputs */}
        {Object.keys(hero)
          .filter((key) => key !== "hero_image" && key !== "resume_file")
          .map((key) => (
            <div key={key} className="flex flex-col">
              <label className="text-sm font-semibold mb-2 capitalize">
                {key.replace(/_/g, " ")}
              </label>
              <input
                name={key}
                value={hero[key] || ""}
                onChange={handleChange}
                placeholder={`Enter ${key.replace(/_/g, " ")}`}
                className="p-3 bg-slate-800 rounded border border-slate-700 focus:border-cyan-500 outline-none transition"
              />
            </div>
          ))}

        {/* Hero Image Upload */}
        <div className="bg-slate-800 rounded p-4 border border-slate-700">
          <label className="block text-sm font-semibold mb-2">Hero Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "hero_image")}
            disabled={uploading}
            className="w-full p-2 bg-slate-700 rounded mb-2 cursor-pointer disabled:opacity-50"
          />
          {hero.hero_image && (
            <div className="mt-2">
              <img src={hero.hero_image} alt="Hero" className="w-full h-40 object-cover rounded" />
              <p className="text-xs text-gray-400 mt-1 truncate" title={hero.hero_image}>
                ✓ {hero.hero_image.split("/").pop()}
              </p>
            </div>
          )}
          {uploading && <p className="text-yellow-400 text-sm">⏳ Uploading...</p>}
        </div>

        {/* Resume File Upload */}
        <div className="bg-slate-800 rounded p-4 border border-slate-700">
          <label className="block text-sm font-semibold mb-2">Resume File</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleImageUpload(e, "resume_file")}
            disabled={uploading}
            className="w-full p-2 bg-slate-700 rounded mb-2 cursor-pointer disabled:opacity-50"
          />
          {hero.resume_file && (
            <p className="text-xs text-gray-400 truncate" title={hero.resume_file}>
              ✓ {hero.resume_file.split("/").pop()}
            </p>
          )}
          {uploading && <p className="text-yellow-400 text-sm">⏳ Uploading...</p>}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6 flex-wrap">
        <button
          onClick={saveHero}
          disabled={saving}
          className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-700 disabled:opacity-50 px-8 py-3 rounded-xl font-semibold transition"
        >
          {saving ? "💾 Saving..." : "💾 Save Hero"}
        </button>

        <button
          onClick={resetForm}
          className="bg-gray-600 hover:bg-gray-700 px-8 py-3 rounded-xl font-semibold transition"
        >
          🔄 Reset Form
        </button>

        <button
          onClick={deleteHero}
          disabled={deleting}
          className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:opacity-50 px-8 py-3 rounded-xl font-semibold transition"
        >
          {deleting ? "🗑️ Deleting..." : "🗑️ Delete Hero"}
        </button>
      </div>
    </div>
  );
}