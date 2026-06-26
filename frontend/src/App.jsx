import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import Stats from './sections/Stats';
import About from './sections/About';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Education from './sections/Education';
import MyStory from './sections/MyStory';
import Experience from './sections/Experience';
import Contact from './sections/Contact';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProjects from './pages/AdminProjects'; // 🚀 YANGI QO‘SHILDI
import AdminEducation from './pages/AdminEducation';
import AdminMyStory from './pages/AdminMyStory';
import HiddenTrigger from './components/HiddenTrigger';
import ProtectedRoute from './components/ProtectedRoute';
import AdminMessages from "./pages/AdminMessages";
import AdminSkills from "./pages/AdminSkills";
import AdminExperience from "./pages/AdminExperience";
import AdminSettings from "./pages/AdminSettings";
import AdminHero from "./pages/AdminHero";

function PublicSite() {
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    revealElements.forEach((el, index) => {
      el.style.setProperty('--reveal-delay', `${index * 40}ms`);
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="marble-bg min-h-screen font-sans antialiased transition-all duration-500 bg-[#f5eee3] text-[#1f1f1f]">
      <Navbar />

      {/* 🛠️ pt-20 o'rniga pt-6 lg:pt-20 qilindi (Mobilni ko'tarish uchun) */}
      <main className="pt-6 lg:pt-20 relative z-10">
        <Hero />
        <Stats />
        <Projects />
        <Experience />
        <Skills />
        <About />
        <Education />
        <MyStory />
        <Contact />
      </main>

      <footer className="text-center py-5">
        <HiddenTrigger />
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🌐 PUBLIC SITE */}
        <Route path="/" element={<PublicSite />} />

        {/* 🔐 ADMIN LOGIN */}
        <Route path="/admin" element={<AdminLogin />} />

        <Route element={<ProtectedRoute />}>
          {/* 📊 ADMIN DASHBOARD */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* 🚀 ADMIN PROJECTS CRUD */}
          <Route path="/admin/projects" element={<AdminProjects />} />
          <Route path="/admin/education" element={<AdminEducation />} />
          <Route path="/admin/my-story" element={<AdminMyStory />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/skills" element={<AdminSkills />} />
          <Route path="/admin/experience" element={<AdminExperience />} />
          <Route path="/admin/hero" element={<AdminHero />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}