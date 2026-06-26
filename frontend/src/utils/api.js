// Localhost mutlaqo o'chirildi, Render-dagi jonli backend manzili (/api bilan)
export const apiBase = "https://my-portfolio-b5jo.onrender.com/api";

// Rasmlar backend-ning static (uploads) papkasidan to'g'ri ochilishi uchun asosiy manzil
export const imageBase = "https://my-portfolio-b5jo.onrender.com";

export function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function authFetch(path, options = {}) {
  // Agar path / bilan boshlansa va apiBase /api bilan tugasa, chiroyli birlashtiramiz
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = path.startsWith("http") ? path : `${apiBase}${cleanPath}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...authHeaders(),
    },
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/admin";
  }

  return response;
}