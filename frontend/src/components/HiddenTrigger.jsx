import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function HiddenTrigger() {
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Mac uchun ⌘ + Shift + A kombinatsiyasi
      if (e.metaKey && e.shiftKey && e.key.toLowerCase() === "a") {
        navigate("/admin"); // 🔐 Admin login sahifasiga yo‘naltirish
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  const handleClick = () => {
    setClickCount(prev => prev + 1);
    if (clickCount + 1 === 5) {
      navigate("/admin"); // 🔐 faqat 5 marta bosilganda ochiladi
      setClickCount(0);   // qayta bosish uchun hisoblagichni nolga qaytaramiz
    }
  };

  return (
    <span
      onClick={handleClick}
      className="cursor-pointer text-xs opacity-50 hover:opacity-100"
    >
      © Sultonbek
    </span>
  );
}
