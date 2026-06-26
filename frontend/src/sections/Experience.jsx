import React from 'react';

export default function Experience() {
  const experiences = [
    {
      id: 1,
      role: "Full-Stack Developer & Lead Architect",
      company: "Langify / Aura IELTS Project",
      period: "2025 - Present",
      description: "Leading the end-to-end development of an interactive English learning platform. Designing responsive user interfaces with React and Tailwind CSS, while building secure, relational architectures using Node.js and MySQL."
    },
    {
      id: 2,
      role: "Information Technologies & Systems Student",
      company: "Tashkent University of Information Technologies (TUIT)",
      period: "2023 - Present",
      description: "Deepening knowledge in database management systems, advanced web architectures, networks scanning and data structures, while consistently bridging software engineering concepts with practical business logic."
    },
    {
      id: 3,
      role: "Frontend Developer",
      company: "Personal Portfolio & Open Source Collaborations",
      period: "2024 - 2025",
      description: "Crafted various responsive web designs using modern JavaScript ecosystems. Implemented state management, worked on component reusability, and deployed robust, scalable user experiences."
    }
  ];

  return (
    <section id="experience" className="reveal max-w-6xl mx-auto px-4 py-16 border-t border-gray-100/80 dark:border-slate-900 transition-colors duration-300 scroll-mt-28">
      
      {/* Sarlavha qismi qorong'uda oq bo'ladi */}
      <div className="text-center max-w-xl mx-auto mb-16">
        <h2 className="text-4xl font-extrabold text-gray-950 dark:text-white tracking-tight transition-colors duration-300">
          Work Experience
        </h2>
        <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-3 rounded-full"></div>
      </div>

      {/* Xronologiya (Timeline) Konteyneri - Chiziq rangi qorong'uda moslashadi */}
      <div className="relative max-w-3xl mx-auto pl-6 border-l-2 border-purple-100/80 dark:border-purple-950 space-y-12 text-left transition-colors duration-300">
        {experiences.map((exp) => (
          <div key={exp.id} className="relative group reveal">
            
            {/* Timeline chap tomondagi binafsha nuqta - Qorong'u fonda oq chekka bilan ajralib turadi */}
            <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-purple-600 dark:bg-purple-500 border-4 border-white dark:border-slate-950 shadow-sm group-hover:bg-blue-600 dark:group-hover:bg-blue-400 transition-colors duration-300"></div>
            
            {/* Tajriba kartasi - Fon, borderlar va soyalar qorong'u rejimga to'liq integratsiya qilindi */}
            <div className="bg-[#fffaf2]/45 dark:bg-[#1b1b1b]/65 backdrop-blur-xl border border-[#d7c2a3]/30 dark:border-[#3a3125]/50 p-6 rounded-[28px] shadow-[0_10px_40px_rgba(180,150,100,0.08)] hover:shadow-[0_20px_50px_rgba(180,150,100,0.15)] hover:translate-x-1 transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-950 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                    {exp.role}
                  </h3>
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 transition-colors duration-300">
                    {exp.company}
                  </p>
                </div>
                {/* Vaqt ko'rsatkichi (Badge) qorong'uda to'q ko'k rangga kiradi */}
                <span className="inline-block bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold px-3 py-1 rounded-full border border-slate-100 dark:border-slate-700 self-start sm:self-center transition-colors duration-300">
                  {exp.period}
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed transition-colors duration-300">
                {exp.description}
              </p>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}