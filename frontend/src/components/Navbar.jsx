import React, { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const [active, setActive] = useState('home');
  const [showArrow, setShowArrow] = useState(true); // Strelkani ko'rsatish/yashirish holati
  const scrollContainerRef = useRef(null);

  const navItems = [
    { id: 'home', label: 'home', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg> },
    { id: 'projects', label: 'projects', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9l-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg> },
    { id: 'experience', label: 'experience', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg> },
    { id: 'skills', label: 'skills', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg> },
    { id: 'about', label: 'about', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg> },
    { id: 'education', label: 'education', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path></svg> },
    { id: 'my_story', label: 'story', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg> },
    { id: 'contact', label: 'contact', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L22 8m-9 13a9 9 0 110-18 9 9 0 010 18z"></path></svg> },
  ];

  // Sahifa skrol bo'lganda yuqoridan kuzatish
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 300;
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActive(item.id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 📱 Mobil navbar ichidagi skrolni kuzatish funksiyasi
  const handleNavbarScroll = () => {
    if (scrollContainerRef.current) {
      const currentScroll = scrollContainerRef.current.scrollLeft;
      // Agar foydalanuvchi 15px dan ko'proq yonga skrol qilsa, strelkani butunlay yashiramiz
      if (currentScroll > 15) {
        setShowArrow(false);
      } else {
        setShowArrow(true);
      }
    }
  };

  const handleItemClick = (item) => {
    setActive(item);
  };

  return (
    <>
      {/* 💻 DESKTOP & NOTBUK NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-[#c8a96a]/20 backdrop-blur-xl bg-[#f2e8d8]/70 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 h-20 flex items-center justify-between">
          <div className="text-3xl font-extrabold bg-gradient-to-r from-[#C8A96A] via-[#E2C488] to-[#9E7B3D] bg-clip-text text-transparent cursor-pointer">
            Portfolio
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-8 text-sm font-semibold">
              {['home', 'projects', 'experience', 'skills', 'about', 'education', 'my_story', 'contact'].map((item) => {
                const label = item === 'my_story' ? 'my story' : item;
                return (
                  <a
                    key={item}
                    href={`#${item}`}
                    onClick={() => handleItemClick(item)}
                    className={`relative capitalize transition-all duration-300 ${
                      active === item ? 'text-[#b89245]' : 'text-[#3d3526] hover:text-[#C8A96A]'
                    }`}
                  >
                    {label}
                    {active === item && (
                      <span className="absolute left-0 -bottom-2 w-full h-[2px] bg-[#C8A96A] rounded-full"></span>
                    )}
                  </a>
                );
              })}
            </div>
            <div className="w-12 h-12 rounded-xl border border-[#C8A96A]/30 bg-[#f8f2e6] hover:shadow-[0_0_20px_rgba(200,169,106,0.25)] transition-all flex items-center justify-center cursor-pointer">
              <span className="text-[#C8A96A] text-xl">☀️</span>
            </div>
          </div>
        </div>
      </nav>

      {/* 📱 MOBILE BOTTOM NAVIGATION (FAQAT SMARTFON UCHUN) */}
      <div className="lg:hidden fixed bottom-5 left-1/2 -translate-x-1/2 w-[92%] max-w-md h-16 bg-[#f2e8d8]/85 backdrop-blur-xl border border-[#c8a96a]/25 rounded-2xl z-50 shadow-[0_10px_35px_0_rgba(200,169,106,0.2)] flex items-center overflow-hidden">
        
        {/* SKROL KONTEYNERI */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleNavbarScroll}
          className="flex items-center h-full w-full overflow-x-auto scrollbar-none gap-3 px-4 pr-14 scroll-smooth"
        >
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => handleItemClick(item.id)}
                className="relative flex flex-col items-center justify-center min-w-[60px] h-14 rounded-xl transition-all duration-300 select-none"
              >
                {isActive && (
                  <div className="absolute -top-1 w-8 h-8 bg-[#C8A96A] opacity-30 blur-md rounded-full transition-all duration-500" />
                )}
                <div className={`transition-all duration-300 ${isActive ? 'text-[#b89245] scale-110 -translate-y-0.5' : 'text-[#6e5d43]'}`}>
                  {item.icon}
                </div>
                <span className={`text-[10px] capitalize mt-0.5 transition-colors duration-300 ${isActive ? 'text-[#b89245] font-bold' : 'text-[#6e5d43]'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-1 w-1 h-1 bg-[#b89245] rounded-full" />
                )}
              </a>
            );
          })}
        </div>

        {/* 🌟 GRADIENT PARDA VA ANIMATSIYALI STRELKA (Faqat skrol qilinmaganda ko'rinadi) */}
        <div className={`absolute right-0 top-0 h-full w-14 bg-gradient-to-l from-[#f2e8d8] via-[#f2e8d8]/80 to-transparent pointer-events-none rounded-r-2xl flex items-center justify-end pr-2 transition-opacity duration-300 ${showArrow ? 'opacity-100' : 'opacity-0'}`}>
          {/* Ohista o'ngga qarab sakrab-surilib turuvchi mitti oltin rangli strelka */}
          <svg className="w-5 h-5 text-[#b89245] animate-horizontal-bounce mr-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </div>
      </div>

      {/* Skrol yashirish va Strelka animatsiyasi uchun maxsus stillar */}
      <style jsx="true" global="true">{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Strelkani o'ngga qarab yumshoq qimirlatuvchi animatsiya */
        @keyframes horizontalBounce {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(5px);
          }
        }
        .animate-horizontal-bounce {
          animation: horizontalBounce 1.5s infinite ease-in-out;
        }
      `}</style>
    </>
  );
}