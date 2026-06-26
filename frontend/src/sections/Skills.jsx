import React from 'react';

export default function Skills() {
  const skillsData = [
    {
      id: 1,
      title: "Frontend Development",
      proficiency: 95,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 text-blue-600 dark:text-blue-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
        </svg>
      )
    },
    {
      id: 2,
      title: "Backend Development",
      proficiency: 85,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 text-emerald-600 dark:text-emerald-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 0 6h13.5a3 3 0 1 0 0-6m-16.5-3a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3m-19.5 0a3 3 0 0 0 3 3m13.5-3a3 3 0 0 0 3 3m-16.5-3V9.125c0-1.182.902-2.164 2.083-2.222a48.093 48.093 0 0 1 12.334 0c1.181.058 2.083 1.04 2.083 2.222v2.125" />
        </svg>
      )
    },
    {
      id: 3,
      title: "Database Management",
      proficiency: 82,
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 text-orange-600 dark:text-orange-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75m-16.5-3.75v3.75" />
        </svg>
      )
    },
    {
      id: 4,
      title: "Systems Analysis & E-Gov",
      proficiency: 80,
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 text-purple-600 dark:text-purple-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.03 0 1.9.693 2.166 1.638m-7.377 0A48.536 48.536 0 0 1 12 3c1.43 0 2.812.062 4.184.183M12 21.75c-3.11 0-6.136-.363-9.043-1.056c-.144-.034-.243-.16-.243-.307V6.108c0-1.135.845-2.098 1.976-2.192a48.424 48.424 0 0 1 1.123-.08" />
        </svg>
      )
    }
  ];

  return (
    <section id="skills" className="reveal max-w-6xl mx-auto px-4 py-16 border-t border-gray-100/80 dark:border-slate-900 transition-colors duration-300 scroll-mt-28">
      <div className="text-center max-w-xl mx-auto mb-16">
        <h2 className="text-4xl font-extrabold text-gray-950 dark:text-white tracking-tight">
          Skills & Expertise
        </h2>
        <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-3 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {skillsData.map((skill) => (
          <div 
            key={skill.id} 
            className="reveal bg-[#fffaf2]/45 dark:bg-[#1b1b1b]/65 backdrop-blur-xl border border-[#d7c2a3]/30 dark:border-[#3a3125]/50 p-6 rounded-[28px] shadow-[0_10px_40px_rgba(180,150,100,0.08)] hover:shadow-[0_20px_50px_rgba(180,150,100,0.15)] hover:translate-y-[-2px] transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-[#f7efe1]/70 dark:bg-[#2a241d]/80 border border-[#d8c2a0]/20 flex items-center justify-center">
                {skill.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">{skill.title}</h3>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-gray-400 dark:text-gray-500 font-medium">Proficiency</span>
                <span className="text-gray-800 dark:text-slate-200">{skill.proficiency}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${skill.proficiency}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}