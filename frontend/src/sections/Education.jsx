import { useEffect, useState } from "react";
import { apiBase } from "../utils/api";

export default function Education() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const res = await fetch(`${apiBase}/api/education`);
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEducation();
  }, []);

  return (
    <section id="education" className="reveal max-w-6xl mx-auto px-4 py-16 border-t border-gray-100/80 dark:border-slate-900 transition-colors duration-300 scroll-mt-28">
      <div className="text-center max-w-xl mx-auto mb-16">
        <h2 className="text-4xl font-extrabold text-gray-950 dark:text-white tracking-tight transition-colors duration-300">Education</h2>
        <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-3 rounded-full"></div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center justify-items-center">
        {items.map((item) => (
          <article key={item.id} className="w-full bg-[#fffaf2]/50 dark:bg-[#1b1b1b]/65 backdrop-blur-xl border border-[#d7c2a3]/30 dark:border-[#3a3125]/50 rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(139,106,49,0.12)] transition-all duration-300 flex flex-col justify-between">
            <div>
              {item.image && (
                <img 
                  src={item.image} 
                  alt={item.institution_name} 
                  className="w-full h-auto block" 
                />
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-950 dark:text-white">{item.institution_name}</h3>
                <p className="text-cyan-500 mt-2 font-medium">{item.degree}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.field_of_study}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{item.start_year} — {item.end_year || "Present"}</p>
                <p className="text-gray-500 dark:text-gray-400 mt-4 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}