const API_BASE = import.meta.env.VITE_API_BASE ||  "https://mini-project-manager-7fsq.onrender.com" ;

export function setApiBase(url: string) {
  (window as any).API_BASE = url;
}

function base() {
  return (window as any).API_BASE || API_BASE;
}

function authHeader(): Record<string, string> {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function post(path: string, body: any) {
  const headers: Record<string, string> = { "Content-Type": "application/json", ...authHeader() };
  const res = await fetch(`${base()}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });
  return res;
}

export async function get(path: string) {
  const headers: Record<string, string> = { ...authHeader() };
  const res = await fetch(`${base()}${path}`, {
    headers
  });
  return res;
}

export async function put(path: string, body: any) {
  const headers: Record<string, string> = { "Content-Type": "application/json", ...authHeader() };
  const res = await fetch(`${base()}${path}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(body)
  });
  return res;
}

export async function del(path: string) {
  const headers: Record<string, string> = { ...authHeader() };
  const res = await fetch(`${base()}${path}`, {
    method: "DELETE",
    headers
  });
  return res;
}
