const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export function setApiBase(url: string) {
  (window as any).API_BASE = url;
}

function base() {
  return (window as any).API_BASE || API_BASE;
}

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function post(path: string, body: any) {
  const res = await fetch(`${base()}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(body)
  });
  return res;
}

export async function get(path: string) {
  const res = await fetch(`${base()}${path}`, {
    headers: { ...authHeader() }
  });
  return res;
}

export async function put(path: string, body: any) {
  const res = await fetch(`${base()}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(body)
  });
  return res;
}

export async function del(path: string) {
  const res = await fetch(`${base()}${path}`, {
    method: "DELETE",
    headers: { ...authHeader() }
  });
  return res;
}
