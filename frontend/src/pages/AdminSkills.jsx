import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/api";

export default function AdminSkills() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [editingSkillId, setEditingSkillId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    percentage: "",
    icon: "",
    skill_level: "",
    category: "",
    sort_order: "",
  });

  const fetchSkills = async () => {
    const res = await authFetch("/api/skills");
    const data = await res.json();
    setSkills(data);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ➕ ADD
  const addSkill = async (e) => {
    e.preventDefault();

    const url = editingSkillId ? `/api/skills/${editingSkillId}` : "/api/skills";
    const method = editingSkillId ? "PUT" : "POST";

    await authFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({
      name: "",
      percentage: "",
      icon: "",
      skill_level: "",
      category: "",
      sort_order: "",
    });
    setEditingSkillId(null);

    fetchSkills();
  };

  const handleEditSkill = (skill) => {
    setEditingSkillId(skill.id);
    setForm({
      name: skill.name || "",
      percentage: skill.percentage || "",
      icon: skill.icon || "",
      skill_level: skill.skill_level || "",
      category: skill.category || "",
      sort_order: skill.sort_order || "",
    });
  };

  const cancelEdit = () => {
    setEditingSkillId(null);
    setForm({
      name: "",
      percentage: "",
      icon: "",
      skill_level: "",
      category: "",
      sort_order: "",
    });
  };

  // 🗑 DELETE
  const deleteSkill = async (id) => {
    await authFetch(`/api/skills/${id}`, {
      method: "DELETE",
    });

    fetchSkills();
  };

  return (
    <div className="p-8 min-h-screen bg-slate-900 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Skills CRUD</h1>
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* FORM */}
      <form
        onSubmit={addSkill}
        className="grid md:grid-cols-2 gap-4 mb-10"
      >
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Skill name"
          className="p-3 bg-slate-800 rounded"
        />

        <input
          name="percentage"
          value={form.percentage}
          onChange={handleChange}
          placeholder="Percentage"
          className="p-3 bg-slate-800 rounded"
        />

        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="p-3 bg-slate-800 rounded"
        />

        <input
          name="skill_level"
          value={form.skill_level}
          onChange={handleChange}
          placeholder="Level"
          className="p-3 bg-slate-800 rounded"
        />

        <input
          name="icon"
          value={form.icon}
          onChange={handleChange}
          placeholder="Icon"
          className="p-3 bg-slate-800 rounded"
        />

        <button className="bg-cyan-500 p-3 rounded md:col-span-2">
          {editingSkillId ? "Save Skill" : "Add Skill"}
        </button>

        {editingSkillId && (
          <button
            type="button"
            onClick={cancelEdit}
            className="bg-gray-600 p-3 rounded md:col-span-2"
          >
            Cancel Edit
          </button>
        )}
      </form>

      {/* LIST */}
      <div className="grid md:grid-cols-2 gap-4">
        {skills.map((s) => (
          <div
            key={s.id}
            className="bg-slate-800 p-5 rounded-xl"
          >
            <h2 className="text-xl font-bold">{s.name}</h2>

            <p>{s.percentage}%</p>
            <p className="text-gray-400">{s.skill_level}</p>
            <p className="text-gray-400">{s.category}</p>

            <div className="flex gap-3 mt-3">
              <button
                onClick={() => handleEditSkill(s)}
                className="bg-blue-500 px-4 py-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => deleteSkill(s.id)}
                className="bg-red-500 px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}