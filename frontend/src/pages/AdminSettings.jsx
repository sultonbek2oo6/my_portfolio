import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/api";

export default function AdminSettings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    site_name: "",
    site_logo: "",
    favicon: "",
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
    theme_mode: "",
    contact_links: [],
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const res = await authFetch("/api/settings");
    const data = await res.json();
    setSettings({
      ...data,
      contact_links: typeof data.contact_links === "string"
        ? JSON.parse(data.contact_links || "[]")
        : data.contact_links || [],
    });
  };

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const saveSettings = async () => {
    await authFetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    alert("Settings updated ✅");
  };

  const handleLinkChange = (index, field, value) => {
    const updated = settings.contact_links.map((link, idx) =>
      idx === index ? { ...link, [field]: value } : link
    );
    setSettings({ ...settings, contact_links: updated });
  };

  const addContactLink = () => {
    setSettings({
      ...settings,
      contact_links: [...settings.contact_links, { label: "", value: "" }],
    });
  };

  const removeContactLink = (index) => {
    setSettings({
      ...settings,
      contact_links: settings.contact_links.filter((_, idx) => idx !== index),
    });
  };

  return (
    <div className="p-8 min-h-screen bg-slate-900 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {Object.entries(settings)
          .filter(([key]) => key !== "contact_links")
          .map(([key, value]) => (
            <input
              key={key}
              name={key}
              value={value || ""}
              onChange={handleChange}
              placeholder={key}
              className="bg-slate-800 p-4 rounded-xl"
            />
          ))}
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Contact Links</h2>
            <p className="text-sm text-gray-300">
              Add or edit contact items such as Instagram, email, Telegram, etc.
            </p>
          </div>
          <button
            onClick={addContactLink}
            className="bg-cyan-500 px-4 py-2 rounded-xl"
          >
            Add Contact Item
          </button>
        </div>

        <div className="space-y-4">
          {settings.contact_links.map((link, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-3 bg-slate-800 p-4 rounded-2xl"
            >
              <input
                value={link.label}
                onChange={(e) => handleLinkChange(index, "label", e.target.value)}
                placeholder="Label (Instagram, Email, Telegram)"
                className="bg-slate-900 p-3 rounded-xl"
              />
              <input
                value={link.value}
                onChange={(e) => handleLinkChange(index, "value", e.target.value)}
                placeholder="URL or value"
                className="bg-slate-900 p-3 rounded-xl"
              />
              <button
                onClick={() => removeContactLink(index)}
                className="bg-red-500 px-4 py-3 rounded-xl"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={saveSettings}
        className="mt-6 bg-cyan-500 px-6 py-3 rounded-xl"
      >
        Save Settings
      </button>
    </div>
  );
}