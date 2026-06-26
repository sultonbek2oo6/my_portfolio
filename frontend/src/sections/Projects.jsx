import { useEffect, useState } from "react";
// apiBase (backend /api manzili) va imageBase (backend asosiy manzili) import qilamiz
import { apiBase, imageBase } from "../utils/api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // 🛠️ BUG FIX: apiBase o'zida /api bo'lgani uchun bu yerda faqat /projects yoziladi
        const res = await fetch(`${apiBase}/projects`);

        if (!res.ok) {
          throw new Error("Projects fetch failed");
        }

        const data = await res.json();

        console.log("PROJECT DATA:", data);

        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("PROJECT ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section
      id="projects"
      className="max-w-7xl mx-auto px-4 py-20 scroll-mt-28"
    >
      {/* TITLE */}
      <h2 className="text-4xl font-bold text-center mb-14 text-gray-900 dark:text-white">
        My Projects
      </h2>

      {/* LOADING */}
      {loading && (
        <p className="text-center text-gray-500">
          Loading projects...
        </p>
      )}

      {/* EMPTY */}
      {!loading && projects.length === 0 && (
        <p className="text-center text-red-500">
          No projects found
        </p>
      )}

      {/* PROJECTS */}
      <div className="flex flex-wrap justify-center gap-8">
        {projects.map((p) => (
          <div
            key={p.id}
            className="w-full sm:w-[420px] bg-white dark:bg-[#1c1c1c] rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
          >
            {/* IMAGE */}
            {/* 🛠️ BUG FIX: Rasm nomini Render backenddagi uploads papkasiga bog'laymiz */}
            <img
              src={`${imageBase}/uploads/${p.image}`}
              alt={p.title}
              className="w-full h-56 object-cover"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/600x400?text=Project+Image";
              }}
            />

            {/* CONTENT */}
            <div className="p-6">
              {/* CATEGORY */}
              {p.category && (
                <span className="inline-block mb-4 px-3 py-1 text-xs rounded-full bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300">
                  {p.category}
                </span>
              )}

              {/* TITLE */}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {p.title}
              </h3>

              {/* DESCRIPTION */}
              <p className="text-gray-600 dark:text-gray-400 mt-3 text-sm leading-6">
                {p.description}
              </p>

              {/* TECHNOLOGIES */}
              <div className="mt-5 flex flex-wrap gap-2">
                {p.technologies
                  ?.split(",")
                  .map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      {tech.trim()}
                    </span>
                  ))}
              </div>

              {/* BUTTONS */}
              <div className="flex gap-3 mt-6">
                {p.github_link && (
                  <a
                    href={p.github_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center bg-gray-900 text-white py-3 rounded-xl hover:opacity-90 transition"
                  >
                    GitHub
                  </a>
                )}

                {p.live_link && (
                  <a
                    href={p.live_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center bg-cyan-500 text-white py-3 rounded-xl hover:opacity-90 transition"
                  >
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}