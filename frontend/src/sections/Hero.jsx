import React, { useEffect, useState, useRef } from 'react';

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  if (imagePath.startsWith('/uploads/')) {
    return `http://localhost:5001${imagePath}`;
  }
  
  return imagePath;
};

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [scrollY, setScrollY] = useState(0);
  const [hero, setHero] = useState({
    full_name: "Sultonbek",
    title: "Full-Stack Developer & Systems Analyst",
    description: "Passionate Developer & Systems Analyst with a focus on innovation, building scalable and elegant web experiences using modern technologies.",
    hero_image: "/src/assets/hero.png",
    button1_text: "View My Work",
    button1_link: "#projects",
    button2_text: "Get In Touch",
    button2_link: "#contact",
    availability_text: "Available for Freelance / Projects"
  });
  const [heroLoading, setHeroLoading] = useState(true);
  const tickingRef = useRef(false);

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      console.log("🔄 Fetching hero data...");
      const res = await fetch("/api/hero");
      
      if (!res.ok) {
        console.warn(`⚠️ Hero API returned ${res.status}, using defaults`);
        setHeroLoading(false);
        return;
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("❌ Backend JSON o'rniga HTML qaytardi. Proxy muammosi!");
        setHeroLoading(false);
        return;
      }

      const data = await res.json();
      console.log("✅ Hero data loaded:", data);

      if (data && data.full_name) {
        setHero({
          full_name: data.full_name || "Sultonbek",
          title: data.title || "Full-Stack Developer & Systems Analyst",
          description: data.description || "",
          hero_image: data.hero_image || "/src/assets/hero.png",
          button1_text: data.button1_text || "View My Work",
          button1_link: data.button1_link || "#projects",
          button2_text: data.button2_text || "Get In Touch",
          button2_link: data.button2_link || "#contact",
          availability_text: data.availability_text || "Available for Freelance / Projects",
        });
      }
    } catch (err) {
      console.error("❌ Failed to fetch hero data:", err);
    } finally {
      setHeroLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true;
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          tickingRef.current = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  };

  const transformText = {
    transform: `translate3d(${(mousePos.x - 0.5) * 16}px, ${(mousePos.y - 0.5) * 12}px, 0)`,
  };

  const transformImage = {
    transform: `translate3d(${(mousePos.x - 0.5) * 22}px, ${(mousePos.y - 0.5) * 18}px, 0) rotate(${(mousePos.x - 0.5) * 2.5}deg)`,
  };

  const transformGlow = {
    transform: `translate3d(${(mousePos.x - 0.5) * -24}px, ${(mousePos.y - 0.5) * -20}px, 0)`,
  };

  const heroScroll = {
    transform: `translateY(${Math.min(scrollY * 0.04, 25)}px)`,
  };

  return (
    <section
      id="home"
      /* 🛠️ pt-28 pb-16 o'rniga pt-6 pb-12 lg:pt-28 lg:pb-16 berildi. Mobil ekran o'lchami uchun optimallashdi */
      className="reveal relative min-h-[calc(100vh-120px)] lg:min-h-screen flex items-center max-w-7xl mx-auto px-5 pt-6 pb-12 lg:pt-28 lg:pb-16 overflow-hidden scroll-mt-28"
      onMouseMove={handleMouseMove}
      style={heroScroll}
    >
      {/* GOLD LIGHT EFFECT */}
      <div className="absolute top-20 right-20 w-[500px] h-[500px] rounded-full bg-[#C8A96A] blur-[180px] opacity-10 transition-transform duration-700 ease-out"
        style={transformGlow}
      ></div>

      <div className="grid md:grid-cols-2 gap-12 items-center w-full">

        {/* LEFT TEXT CONTENT */}
        <div className="space-y-6 transition-transform duration-700 ease-out text-center md:text-left z-10" style={transformText}>

          {/* BADGE */}
          <div className="inline-flex items-center gap-2 bg-[#fff7e7] text-[#9E7B3D] dark:bg-[#141f2f] dark:text-[#d7c18c] px-5 py-2 rounded-full text-sm font-semibold border border-[#C8A96A]/30 shadow-sm">
            ⚡ {hero.availability_text}
          </div>

          {/* TITLE */}
          <h1 className="text-4xl md:text-7xl font-black leading-tight text-[#1e1b16] dark:text-white">
            Hi, I'm <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-[#9E7B3D] via-[#D6B979] to-[#7f6128] bg-clip-text text-transparent">
              {hero.full_name}
            </span>
          </h1>

          {/* ROLE */}
          <h2 className="text-xl md:text-2xl font-semibold text-[#9E7B3D]">
            {hero.title}
          </h2>

          {/* DESC */}
          <p className="text-gray-700 dark:text-slate-300 text-base md:text-lg leading-7 md:leading-8 max-w-xl mx-auto md:mx-0">
            {hero.description}
          </p>

          {/* BUTTONS */}
          {/* justify-center md:justify-start qo'shildi - mobil ekranda tugmalar markazda turishi uchun */}
          <div className="flex flex-row justify-center md:justify-start gap-4 pt-2">
            <a
              href={hero.button1_link}
              className="px-6 py-3.5 md:px-8 md:py-4 rounded-2xl text-white font-semibold bg-gradient-to-r from-[#C8A96A] to-[#9E7B3D] hover:scale-105 transition-all duration-300 shadow-[0_10px_30px_rgba(200,169,106,0.35)] text-sm md:text-base whitespace-nowrap"
            >
              {hero.button1_text} →
            </a>

            <a
              href={hero.button2_link}
              className="px-6 py-3.5 md:px-8 md:py-4 rounded-2xl font-semibold border border-[#C8A96A]/30 bg-[#f8f1e5] hover:bg-[#f1e7d6] text-[#8b6a31] transition-all text-sm md:text-base whitespace-nowrap"
            >
              {hero.button2_text}
            </a>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center md:justify-end order-first md:order-last">
          <div className="relative group">
            {/* GOLD GLOW */}
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#C8A96A] to-[#E2C488] blur-xl opacity-30 group-hover:opacity-50 transition duration-500"
              style={transformGlow}
            ></div>

            {/* IMAGE */}
            <div
              className="relative w-full max-w-[260px] md:max-w-[430px] aspect-square rounded-full overflow-hidden border-[5px] md:border-[6px] border-[#e7d6b2] shadow-[0_10px_50px_rgba(200,169,106,0.35)] bg-[#f6f1e7] transition-transform duration-700 ease-out"
              style={transformImage}
            >
              <img
                src={getImageUrl(hero.hero_image)}
                alt={hero.full_name}
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}