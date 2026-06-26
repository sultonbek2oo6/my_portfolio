import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiBase } from "../utils/api";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${apiBase}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      console.log("SERVER RESPONSE:", data);

      if (res.ok && data.success) {
        localStorage.setItem("token", data.token);
        alert("Login successful 🚀");
        navigate("/admin/dashboard"); // ✅ React Router orqali yo‘naltirish
      } else {
        alert(data.message || "Username yoki password xato");
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      alert("Backend serverga ulanib bo‘lmadi");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={login} className="bg-white p-8 rounded-xl shadow-md w-[350px]">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
        <input type="text" placeholder="Username" className="w-full p-2 border mb-3 rounded"
          value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full p-2 border mb-5 rounded"
          value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" disabled={loading}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}
