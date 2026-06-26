import { useEffect, useState } from "react";
import { apiBase } from "../utils/api";

export default function MyStory() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch(`${apiBase}/api/my_story`);
        const data = await res.json();
        setStories(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStories();
  }, []);

  return (
    <section
      id="my_story"
      className="reveal max-w-7xl mx-auto px-4 py-20 scroll-mt-28"
    >
      {/* Title */}
      <div className="text-center max-w-xl mx-auto mb-16">
        <h2 className="text-5xl font-extrabold text-gray-950 dark:text-white tracking-tight">
          My Story
        </h2>
        <div className="w-14 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* GRID WRAPPER - TO'G'RILANGAN */}
      <div className="w-full">
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center">

          {stories.map((story) => (
            <article
              key={story.id}
              className="w-full max-w-sm bg-[#fffaf2]/70 dark:bg-[#1b1b1b]/65 backdrop-blur-xl border border-[#d7c2a3]/30 dark:border-[#3a3125]/50 rounded-[30px] overflow-hidden shadow-[0_10px_30px_rgba(139,106,49,0.12)] hover:scale-[1.02] transition-all duration-300"
            >
              {/* Image */}
              {story.image && (
                <div className="w-full flex justify-center bg-transparent pt-4">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="max-h-[350px] w-auto object-contain rounded-xl"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                <h3 className="text-3xl font-bold text-gray-950 dark:text-white leading-tight">
                  {story.title}
                </h3>
                <p className="text-cyan-500 mt-3 font-medium">
                  {story.place_name}, {story.city}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 capitalize">
                  {story.country} •{" "}
                  {story.category?.replace(/_/g, " ")}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                  Visited:{" "}
                  {story.visit_date
                    ? new Date(story.visit_date).toLocaleDateString()
                    : "N/A"}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mt-4 text-sm leading-7">
                  {story.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}