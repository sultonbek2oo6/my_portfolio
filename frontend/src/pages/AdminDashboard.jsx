import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/api";
import {
  FaBars,
  FaTachometerAlt,
  FaUser,
  FaBook,
  FaHistory,
  FaCode,
  FaProjectDiagram,
  FaEnvelope,
  FaCog,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    projects: 0,
    messages: 0,
    skills: 0,
    experience: 0,
    education: 0,
    my_story: 0,
  });
  const [sectionFilter, setSectionFilter] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // =========================
  // AUTH CHECK + LOAD STATS
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/admin";
      return;
    }

    fetchStats();
  }, []);

  // =========================
  // FETCH STATS
  // =========================
  const fetchStats = async () => {
    try {
      const res = await authFetch("/api/admin/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Stats error:", err);
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/admin";
  };

  // =========================
  // CARDS
  // =========================
  const cards = [
    {
      title: "Projects",
      value: stats.projects,
      desc: "Manage portfolio projects",
      color: "from-blue-500 to-cyan-500",
      onClick: () => navigate("/admin/projects"),
    },
    {
      title: "Messages",
      value: stats.messages,
      desc: "Contact form messages",
      color: "from-green-500 to-emerald-500",
      onClick: () => navigate("/admin/messages"),
    },
    {
      title: "Skills",
      value: stats.skills,
      desc: "Manage skills section",
      color: "from-purple-500 to-pink-500",
      onClick: () => navigate("/admin/skills"),
    },
    {
      title: "Experience",
      value: stats.experience,
      desc: "Work experience data",
      color: "from-orange-500 to-red-500",
      onClick: () => navigate("/admin/experience"),
    },
    {
      title: "Education",
      value: stats.education,
      desc: "Manage education entries",
      color: "from-sky-500 to-blue-500",
      onClick: () => navigate("/admin/education"),
    },
    {
      title: "My Story",
      value: stats.my_story,
      desc: "Manage My Story posts",
      color: "from-emerald-500 to-lime-500",
      onClick: () => navigate("/admin/my-story"),
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-72 bg-[#111827] border-r border-gray-800 p-6 hidden md:block">
        <h1 className="text-3xl font-bold text-cyan-400 mb-10">
          Admin Panel
        </h1>

        <nav className="space-y-2">
          <SidebarItem icon={<FaTachometerAlt />} text="Dashboard" active />

          <div
            onClick={() => navigate("/admin/projects")}
            className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer hover:bg-gray-800"
          >
            <FaProjectDiagram />
            <span>Projects</span>
          </div>
          
          <div
            onClick={() => navigate("/admin/hero")}
            className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer hover:bg-gray-800"
          >
            <FaUser />
            <span>Hero / About</span>
          </div>
          
          <div
            onClick={() => navigate("/admin/messages")}
            className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer hover:bg-gray-800"
          >
            <FaEnvelope />
            <span>Messages</span>
          </div>

          <div
            onClick={() => navigate("/admin/skills")}
            className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer hover:bg-gray-800"
          >
            <FaCode />
            <span>Skills</span>
          </div>

          <div
            onClick={() => navigate("/admin/experience")}
            className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer hover:bg-gray-800"
          >
            <FaUser />
            <span>Experience</span>
          </div>

          <div
            onClick={() => navigate("/admin/education")}
            className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer hover:bg-gray-800"
          >
            <FaBook />
            <span>Education</span>
          </div>

          <div
            onClick={() => navigate("/admin/my-story")}
            className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer hover:bg-gray-800"
          >
            <FaHistory />
            <span>My Story</span>
          </div>

          <div
            onClick={() => navigate("/admin/settings")}
            className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer hover:bg-gray-800"
          >
            <FaCog />
            <span>Settings</span>
          </div>
        </nav>

        <button
          onClick={logout}
          className="mt-10 flex items-center gap-3 text-red-400 hover:text-red-300"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1">
        {/* HEADER */}
        <header className="bg-[#111827] border-b border-gray-800 px-6 py-5 flex justify-between items-center gap-4 md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden bg-slate-800 p-3 rounded-2xl text-cyan-400 hover:bg-slate-700 transition"
            >
              <FaBars />
            </button>
            <h2 className="text-2xl font-bold">Dashboard</h2>
          </div>

          <img
            src="https://i.pravatar.cc/100"
            className="w-12 h-12 rounded-full border-2 border-cyan-400"
          />
        </header>

        {isSidebarOpen && (
          <aside className="fixed inset-0 z-50 bg-slate-950/95 p-6 md:hidden">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-cyan-400">Admin Panel</h1>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="bg-slate-800 p-3 rounded-2xl text-white hover:bg-slate-700 transition"
              >
                <FaTimes />
              </button>
            </div>

            <nav className="space-y-3">
              <SidebarItem icon={<FaTachometerAlt />} text="Dashboard" active />

              <div
                onClick={() => {
                  navigate("/admin/projects");
                  setIsSidebarOpen(false);
                }}
                className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer hover:bg-gray-800"
              >
                <FaProjectDiagram />
                <span>Projects</span>
              </div>

              <div
                onClick={() => {
                  navigate("/admin/hero");
                  setIsSidebarOpen(false);
                }}
                className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer hover:bg-gray-800"
              >
                <FaUser />
                <span>Hero / About</span>
              </div>

              <div
                onClick={() => {
                  navigate("/admin/messages");
                  setIsSidebarOpen(false);
                }}
                className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer hover:bg-gray-800"
              >
                <FaEnvelope />
                <span>Messages</span>
              </div>

              <div
                onClick={() => {
                  navigate("/admin/skills");
                  setIsSidebarOpen(false);
                }}
                className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer hover:bg-gray-800"
              >
                <FaCode />
                <span>Skills</span>
              </div>

              <div
                onClick={() => {
                  navigate("/admin/experience");
                  setIsSidebarOpen(false);
                }}
                className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer hover:bg-gray-800"
              >
                <FaUser />
                <span>Experience</span>
              </div>

              <div
                onClick={() => {
                  navigate("/admin/education");
                  setIsSidebarOpen(false);
                }}
                className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer hover:bg-gray-800"
              >
                <FaBook />
                <span>Education</span>
              </div>

              <div
                onClick={() => {
                  navigate("/admin/my-story");
                  setIsSidebarOpen(false);
                }}
                className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer hover:bg-gray-800"
              >
                <FaHistory />
                <span>My Story</span>
              </div>

              <div
                onClick={() => {
                  navigate("/admin/settings");
                  setIsSidebarOpen(false);
                }}
                className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer hover:bg-gray-800"
              >
                <FaCog />
                <span>Settings</span>
              </div>

              <button
                onClick={() => {
                  logout();
                  setIsSidebarOpen(false);
                }}
                className="mt-6 flex items-center gap-3 text-red-400 hover:text-red-300"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </nav>
          </aside>
        )}

        {/* CONTENT */}
        <div className="p-8">
          <h3 className="text-3xl font-bold mb-8">
            Overview
          </h3>

          {/* CARDS */}
          <div className="flex flex-wrap gap-3 mb-6">
            {[
              { id: "all", label: "All" },
              { id: "Projects", label: "Projects" },
              { id: "Messages", label: "Messages" },
              { id: "Skills", label: "Skills" },
              { id: "Experience", label: "Experience" },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSectionFilter(filter.id)}
                className={`px-4 py-2 rounded-full transition ${
                  sectionFilter === filter.id
                    ? "bg-cyan-500 text-black"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {cards
              .filter(
                (c) =>
                  sectionFilter === "all" || c.title === sectionFilter
              )
              .map((c, i) => (
                <div
                  key={i}
                  onClick={c.onClick}
                  className={`cursor-pointer bg-gradient-to-r ${c.color}
                  rounded-3xl p-6 shadow-xl hover:scale-105 transition`}
                >
                <h4 className="text-lg font-semibold">
                  {c.title}
                </h4>

                <h2 className="text-4xl font-bold mt-4">
                  {c.value}
                </h2>

                <p className="text-sm opacity-90 mt-2">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>

          {/* QUICK ACTIONS */}
          <div className="mt-10 grid lg:grid-cols-2 gap-6">
            <div className="bg-[#1e293b] p-6 rounded-3xl">
              <h2 className="text-xl font-bold mb-4">
                Quick Actions
              </h2>

              <button
                onClick={() => navigate("/admin/projects")}
                className="bg-cyan-500 px-4 py-3 rounded-xl w-full mb-3"
              >
                Add Project
              </button>

              <button
                onClick={() => navigate("/admin/education")}
                className="bg-sky-500 px-4 py-3 rounded-xl w-full mb-3"
              >
                Manage Education
              </button>

              <button
                onClick={() => navigate("/admin/my-story")}
                className="bg-emerald-500 px-4 py-3 rounded-xl w-full mb-3"
              >
                Manage My Story
              </button>

              <button
                onClick={() => navigate("/admin/messages")}
                className="bg-green-500 px-4 py-3 rounded-xl w-full mb-3"
              >
                View Messages
              </button>
            </div>

            <div className="bg-[#1e293b] p-6 rounded-3xl">
              <h2 className="text-xl font-bold mb-4">
                System Status
              </h2>

              <p className="text-gray-400">
                Backend: Connected ✅
              </p>
              <p className="text-gray-400">
                Database: MySQL Connected ✅
              </p>
              <p className="text-gray-400">
                API: Working 🚀
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ================= SIDEBAR ITEM =================
function SidebarItem({ icon, text, active }) {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition
      ${
        active
          ? "bg-cyan-500 text-black font-bold"
          : "hover:bg-gray-800 text-gray-300"
      }`}
    >
      {icon}
      <span>{text}</span>
    </div>
  );
}