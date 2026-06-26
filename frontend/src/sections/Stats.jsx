import React from 'react';

export default function Stats() {
  const statsData = [
    {
      id: 1,
      number: "50+",
      label: "Projects Completed",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-blue-600 dark:text-blue-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.008 1.24l.885 1.77a2.25 2.25 0 0 0 2.007 1.24h1.98a2.25 2.25 0 0 0 2.007-1.24l.885-1.77a2.25 2.25 0 0 1 2.007-1.24h3.86m-18 0h18a2.25 2.25 0 0 1 2.25 2.25v4.5A2.25 2.25 0 0 1 18 21H6a2.25 2.25 0 0 1-2.25-2.25v-4.5A2.25 2.25 0 0 1 2.25 13.5Z" />
        </svg>
      )
    },
    {
      id: 2,
      number: "30+",
      label: "Happy Clients",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-purple-600 dark:text-purple-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-2.533-3.076l-1.01-.337m-2.222-1.028a4.25 4.25 0 0 0-4.898 0m.002 0a4.25 4.25 0 0 1 4.898 0M9.55 12.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM2.41 14.97a4.214 4.214 0 0 0 2.532 3.076l1.01.337m0 0A9.153 9.153 0 0 0 12 18c1.39 0 2.72-.31 3.916-.865m-11.31-2.165A4.183 4.183 0 0 1 12 12c2.197 0 4.01 1.69 4.183 3.97m-11.31-2.165 1.01-.337m0 0A4.25 4.25 0 0 1 12 12a4.25 4.25 0 0 1 4.086 2.803l1.01.337M9.75 4.75a3.25 3.25 0 1 1-6.5 0 3.25 3.25 0 0 1 6.5 0Z" />
        </svg>
      )
    },
    {
      id: 3,
      number: "5+",
      label: "Years Experience",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-blue-600 dark:text-blue-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-6.75a1.125 1.125 0 0 0-1.125 1.125v3.375m9 0h-9M9 10.5h.008v.008H9V10.5Zm3 0h.008v.008H12V10.5Zm3 0h.008v.008H15V10.5Zm-6 3h.008v.008H9v-.008Zm3 0h.008v.008H12v-.008Zm3 0h.008v.008H15v-.008Zm-3-6h.008v.008H12V7.5Zm3-3h.008v.008H15V4.5Zm-6 0h.008v.008H9V4.5Z" />
        </svg>
      )
    },
    {
      id: 4,
      number: "20+",
      label: "Technologies",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-purple-600 dark:text-purple-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
        </svg>
      )
    }
  ];

  return (
    <section className="reveal max-w-6xl mx-auto px-4 py-8 transition-colors duration-300">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {statsData.map((stat) => (
          <div 
            key={stat.id} 
            className="reveal bg-[#fffaf2]/45 dark:bg-[#1b1b1b]/65 backdrop-blur-xl border border-[#d7c2a3]/30 dark:border-[#3a3125]/50 p-6 rounded-[28px] shadow-[0_10px_40px_rgba(180,150,100,0.08)] flex flex-col items-center text-center group hover:translate-y-[-4px] transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#f7efe1]/70 dark:bg-[#2a241d]/80 border border-[#d8c2a0]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              {stat.icon}
            </div>
            <span className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {stat.number}
            </span>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}