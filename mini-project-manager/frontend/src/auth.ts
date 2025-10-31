export function saveToken(token: string) {
    localStorage.setItem("token", token);
  }
  export function getToken() {
    return localStorage.getItem("token");
  }
  export function logout() {
    localStorage.removeItem("token");
  }
  
  export function getEmailFromToken(): string | null {
    const token = getToken();
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length < 2) return null;
    try {
      const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
      return payload.email || payload.sub || null;
    } catch {
      return null;
    }
  }
  