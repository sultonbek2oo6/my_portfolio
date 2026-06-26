export const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:5001";

export function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function authFetch(path, options = {}) {
  const url = path.startsWith("http") ? path : `${apiBase}${path}`;
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
