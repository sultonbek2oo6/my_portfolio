import React, { useEffect, useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [contactLinks, setContactLinks] = useState([]);
  const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:5001";

  // Matn konstantalari muharrirda yorqin ko'rinishi uchun:
  const sectionTitle = "Get In Touch";
  const sectionDesc = "I'm always open to new opportunities and collaborations";
  const leftHeading = "Let's work together";
  const leftDesc = "Whether you have a project in mind or just want to chat about tech, I'd love to hear from you!";
  
  const labelName = "Name";
  const labelEmail = "Email";
  const labelSubject = "Subject";
  const labelMsg = "Message";

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${apiBase}/api/settings`);
        const data = await res.json();
        const links = typeof data.contact_links === 'string'
          ? JSON.parse(data.contact_links || '[]')
          : data.contact_links || [];
        setContactLinks(links);
      } catch (err) {
        console.error('Contact settings fetch error:', err);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const response = await fetch(`${apiBase}/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Rahmat, ${formData.name}! Xabaringiz muvaffaqiyatli yuborildi. 🚀`);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        alert(data.error || 'Xabar yuborishda xatolik yuz berdi.');
      }
    } catch (error) {
      console.error('Xatolik:', error);
      alert('Xabar yuborishda internet yoki ulanish xatoligi yuz berdi.');
    } finally {
      setIsSending(false);
    }
  };

  // Ijtimoiy tarmoqlar linkini to'g'ri shakllantiruvchi funksiya
  const formatHref = (label, value) => {
    const cleanValue = value.trim();
    const lowerLabel = label.toLowerCase();

    if (cleanValue.startsWith("http://") || cleanValue.startsWith("https://") || cleanValue.startsWith("mailto:")) {
      return cleanValue;
    }

    if (lowerLabel.includes("email")) {
      return `mailto:${cleanValue}`;
    }
    if (lowerLabel.includes("telegram") || lowerLabel.includes("tg")) {
      return `https://t.me/${cleanValue.replace("@", "")}`;
    }
    if (lowerLabel.includes("instagram") || lowerLabel.includes("insta")) {
      return `https://instagram.com/${cleanValue.replace("@", "")}`;
    }
    if (lowerLabel.includes("github")) {
      return `https://github.com/${cleanValue.replace("@", "")}`;
    }

    return `https://${cleanValue}`;
  };

  // Dinamik kartalar uchun bir xil glassmorphism + hover animatsiya stillari klassi
  const cardClassName = "flex items-center gap-4 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md border border-white/40 dark:border-slate-800/50 p-4 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)] transition-all duration-500 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:bg-white/50 dark:hover:bg-slate-900/50 hover:border-purple-400/60 dark:hover:border-purple-500/50 hover:shadow-[0_20px_30px_-10px_rgba(124,58,237,0.15)] group cursor-pointer";

  return (
    <section id="contact" className="reveal max-w-6xl mx-auto px-4 py-16 border-t border-gray-100/80 dark:border-slate-900 transition-colors duration-300 scroll-mt-28">
      
      {/* Sarlavha qismi */}
      <div className="text-center max-w-xl mx-auto mb-16">
        <h2 className="text-4xl font-extrabold text-gray-950 dark:text-white tracking-tight transition-colors duration-300">
          {sectionTitle}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm transition-colors duration-300">
          {sectionDesc}
        </p>
        <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-3 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* Chap tomondagi ijtimoiy tarmoqlar kartalari */}
        <div className="space-y-6 text-left">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 transition-colors duration-300">
            {leftHeading}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed max-w-md transition-colors duration-300">
            {leftDesc}
          </p>

          <div className="space-y-4 pt-2">
            {contactLinks.length > 0 ? (
              contactLinks.map((link, index) => {
                const href = formatHref(link.label, link.value);
                return (
                  <div key={index} className={cardClassName}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 dark:from-slate-700 dark:to-slate-900 flex items-center justify-center text-white shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                      <span className="text-sm font-bold uppercase">
                        {link.label ? link.label.charAt(0) : "#"}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider transition-colors group-hover:text-purple-500">
                        {link.label || "Contact"}
                      </p>
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-bold text-gray-800 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                      >
                        {link.value}
                      </a>
                    </div>
                  </div>
                );
              })
            ) : (
              /* AGAR API'DAN MA'LUMOT KELMASA, SHU STATIK QISM ISHLAYDI */
              <div className="space-y-4">
                {/* Email */}
                <div className={cardClassName}>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-inner">
                    <span className="text-sm font-bold">E</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider transition-colors group-hover:text-purple-500">Email</p>
                    <a href="mailto:sultonbek6@icloud.com" className="text-sm font-bold text-gray-800 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                      sultonbek6@icloud.com
                    </a>
                  </div>
                </div>

                {/* Telegram */}
                <div className={cardClassName}>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-500 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-inner">
                    <span className="text-sm font-bold">T</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider transition-colors group-hover:text-purple-500">Telegram</p>
                    <a href="https://t.me/sultonbek2oo6" target="_blank" rel="noreferrer" className="text-sm font-bold text-gray-800 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                      @sultonbek2oo6
                    </a>
                  </div>
                </div>

                {/* Instagram */}
                <div className={cardClassName}>
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-inner">
                    <span className="text-sm font-bold">I</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider transition-colors group-hover:text-purple-500">Instagram</p>
                    <a href="https://instagram.com/sultonbek_________" target="_blank" rel="noreferrer" className="text-sm font-bold text-gray-800 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                      @sultonbek_________
                    </a>
                  </div>
                </div>

                {/* GitHub */}
                <div className={cardClassName}>
                  <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm">
                    <span className="text-sm font-bold">G</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider transition-colors group-hover:text-purple-500">GitHub</p>
                    <a href="https://github.com/sultonbek2oo6" target="_blank" rel="noreferrer" className="text-sm font-bold text-gray-800 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                      @sultonbek2oo6
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* O'ng tomondagi Xat yuborish formasi (TEGILMADI) */}
        <div className="bg-[#fffaf2]/45 dark:bg-[#1b1b1b]/65 backdrop-blur-xl border border-[#d7c2a3]/30 dark:border-[#3a3125]/50 p-8 rounded-[32px] shadow-[0_10px_40px_rgba(180,150,100,0.08)] w-full transition-colors duration-300">
          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">{labelName}</label>
              <input 
                type="text" 
                required
                placeholder="Your name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-1 focus:ring-purple-500 dark:focus:ring-purple-400 text-sm bg-slate-50/50 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">{labelEmail}</label>
              <input 
                type="email" 
                required
                placeholder="your@email.com" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-1 focus:ring-purple-500 dark:focus:ring-purple-400 text-sm bg-slate-50/50 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">{labelSubject}</label>
              <input
                type="text"
                required
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-1 focus:ring-purple-500 dark:focus:ring-purple-400 text-sm bg-slate-50/50 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">{labelMsg}</label>
              <textarea 
                rows="4" 
                required
                placeholder="Your message..." 
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-1 focus:ring-purple-500 dark:focus:ring-purple-400 text-sm bg-slate-50/50 dark:bg-slate-950 dark:text-white resize-none"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSending}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md shadow-purple-100 dark:shadow-none transition-all hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSending ? "Sending..." : "Send Message"} 
              <span>➔</span>
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}