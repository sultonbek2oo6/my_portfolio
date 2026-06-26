import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/api";

export default function AdminMessages() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState("all");

  const fetchMessages = async () => {
    const res = await authFetch("/api/contacts");
    const data = await res.json();
    setMessages(data);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // 🗑 DELETE
  const deleteMsg = async (id) => {
    await authFetch(`/api/contacts/${id}`, {
      method: "DELETE",
    });

    fetchMessages();
  };

  // 👁 MARK AS READ
  const markRead = async (id) => {
    await authFetch(
      `/api/contacts/read/${id}`,
      {
        method: "PUT",
      }
    );

    fetchMessages();
  };

  // FILTER
  const filtered = messages.filter((m) => {
    if (filter === "read") return m.is_read === 1;
    if (filter === "unread") return m.is_read === 0;
    return true;
  });

  return (
    <div className="p-8 min-h-screen bg-slate-900 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Messages Center</h1>
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setFilter("all")}
          className="bg-gray-700 px-4 py-2 rounded"
        >
          All
        </button>

        <button
          onClick={() => setFilter("unread")}
          className="bg-red-500 px-4 py-2 rounded"
        >
          Unread
        </button>

        <button
          onClick={() => setFilter("read")}
          className="bg-green-500 px-4 py-2 rounded"
        >
          Read
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {filtered.map((m) => (
          <div
            key={m.id}
            className={`p-5 rounded-2xl border
              ${
                m.is_read
                  ? "bg-slate-800"
                  : "bg-slate-700 border-red-500"
              }`}
          >
            <h2 className="text-xl font-bold">
              {m.full_name}
            </h2>

            <p className="text-gray-400">{m.email}</p>
            <p className="text-sm text-gray-500 mt-1">
              Sent: {new Date(m.created_at).toLocaleString()}
            </p>

            <h3 className="mt-2 font-semibold">
              {m.subject}
            </h3>

            <p className="mt-2">{m.message}</p>

            <div className="flex gap-3 mt-4 flex-wrap">
              <a
                href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`}
                className="bg-blue-500 px-4 py-2 rounded"
              >
                Reply by Email
              </a>

              {!m.is_read && (
                <button
                  onClick={() => markRead(m.id)}
                  className="bg-cyan-500 px-4 py-2 rounded"
                >
                  Mark as Read
                </button>
              )}

              <button
                onClick={() => deleteMsg(m.id)}
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