import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/api";

export default function AdminExperience() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [editingExpId, setEditingExpId] = useState(null);

  const [form, setForm] = useState({
    company_name: "",
    position_name: "",
    description: "",
    start_date: "",
    end_date: "",
    is_current: 0,
  });

  const fetchData = async () => {
    const res = await authFetch("/api/experience");
    const data = await res.json();
    setList(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ➕ ADD
  const addExperience = async (e) => {
    e.preventDefault();

    const url = editingExpId ? `/api/experience/${editingExpId}` : "/api/experience";
    const method = editingExpId ? "PUT" : "POST";

    await authFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({
      company_name: "",
      position_name: "",
      description: "",
      start_date: "",
      end_date: "",
      is_current: 0,
    });
    setEditingExpId(null);

    fetchData();
  };

  const handleEditExperience = (experience) => {
    setEditingExpId(experience.id);
    setForm({
      company_name: experience.company_name || "",
      position_name: experience.position_name || "",
      description: experience.description || "",
      start_date: experience.start_date || "",
      end_date: experience.end_date || "",
      is_current: experience.is_current || 0,
    });
  };

  const cancelEdit = () => {
    setEditingExpId(null);
    setForm({
      company_name: "",
      position_name: "",
      description: "",
      start_date: "",
      end_date: "",
      is_current: 0,
    });
  };

  // 🗑 DELETE
  const deleteExp = async (id) => {
    await authFetch(
      `/api/experience/${id}`,
      {
        method: "DELETE",
      }
    );

    fetchData();
  };

  return (
    <div className="p-8 min-h-screen bg-slate-900 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Experience CRUD</h1>
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* FORM */}
      <form
        onSubmit={addExperience}
        className="grid md:grid-cols-2 gap-4 mb-10"
      >
        <input
          name="company_name"
          value={form.company_name}
          onChange={handleChange}
          placeholder="Company"
          className="p-3 bg-slate-800 rounded"
        />

        <input
          name="position_name"
          value={form.position_name}
          onChange={handleChange}
          placeholder="Position"
          className="p-3 bg-slate-800 rounded"
        />

        <input
          name="start_date"
          value={form.start_date}
          onChange={handleChange}
          placeholder="Start Date"
          className="p-3 bg-slate-800 rounded"
        />

        <input
          name="end_date"
          value={form.end_date}
          onChange={handleChange}
          placeholder="End Date"
          className="p-3 bg-slate-800 rounded"
        />

        <input
          name="is_current"
          value={form.is_current}
          onChange={handleChange}
          placeholder="0 or 1 (current job)"
          className="p-3 bg-slate-800 rounded"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="p-3 bg-slate-800 rounded md:col-span-2"
        />

        <button className="bg-cyan-500 p-3 rounded md:col-span-2">
          {editingExpId ? "Save Experience" : "Add Experience"}
        </button>

        {editingExpId && (
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
      <div className="space-y-4">
        {list.map((e) => (
          <div
            key={e.id}
            className="bg-slate-800 p-5 rounded-xl"
          >
            <h2 className="text-xl font-bold">
              {e.company_name}
            </h2>

            <p className="text-cyan-400">
              {e.position_name}
            </p>

            <p className="text-gray-400 mt-2">
              {e.description}
            </p>

            <p className="text-sm mt-2">
              {e.start_date} -{" "}
              {e.is_current ? "Present" : e.end_date}
            </p>

            <div className="flex gap-3 mt-3">
              <button
                onClick={() => handleEditExperience(e)}
                className="bg-blue-500 px-4 py-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => deleteExp(e.id)}
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