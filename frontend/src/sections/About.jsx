import React from 'react';

export default function About() {
  // Matnlar kod ichida aniq ko'rinishi uchun o'zgaruvchilar
  const sectionTitle = "About Me";
  const mainSubtitle = "Passionate Developer & Systems Analyst with a Focus on Innovation";
  const paragraphOne = "I'm a full-stack developer specializing in building exceptional digital experiences. Currently focused on building accessible, human-centered products with modern web technologies, keeping performance and security as top priorities.";
  const paragraphTwo = "My journey in web development centers around solving real-world complex tasks, structuring robust architectures, and turning challenging requirements into seamless, user-friendly solutions.";
  
  const listOne = "Academic Education";
  const listTwo = "Clean Code Architecture";
  const listThree = "Database Performance";
  const listFour = "E-Gov & Secure Protocols";

  return (
    <section id="about" className="reveal max-w-6xl mx-auto px-4 py-16 border-t border-gray-100/80 dark:border-slate-900 transition-colors duration-300 scroll-mt-28">
      
      {/* Sarlavha qismi */}
      <div className="text-center max-w-xl mx-auto mb-16">
        <h2 className="text-4xl font-extrabold text-gray-950 dark:text-white tracking-tight transition-colors duration-300">
          {sectionTitle}
        </h2>
        <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-3 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Chap tomondagi rasm qismi */}
        <div className="relative group rounded-2xl overflow-hidden shadow-lg shadow-gray-200/80 dark:shadow-none">
          <img 
            src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80" 
            alt="Workspace" 
            className="w-full h-[350px] object-cover transform group-hover:scale-102 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/20 to-transparent"></div>
        </div>

        {/* O'ng tomondagi matnlar qismi */}
        <div className="space-y-6 text-left">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 leading-tight transition-colors duration-300">
            {mainSubtitle}
          </h3>
          
          <p className="text-gray-600 dark:text-slate-400 leading-relaxed text-base transition-colors duration-300">
            {paragraphOne}
          </p>
          
          <p className="text-gray-600 dark:text-slate-400 leading-relaxed text-base transition-colors duration-300">
            {paragraphTwo}
          </p>

          {/* Pastki qisqa ro'yxat matnlari */}
          <div className="grid grid-cols-2 gap-4 pt-2 text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors duration-300">
            <div className="flex items-center gap-2">
              <span className="text-purple-600 dark:text-purple-400">✦</span> {listOne}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-600 dark:text-purple-400">✦</span> {listTwo}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-600 dark:text-purple-400">✦</span> {listThree}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-600 dark:text-purple-400">✦</span> {listFour}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}