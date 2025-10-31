import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../src/auth";

export default function ProtectedRoute() {
  const [checking, setChecking] = useState(true);
  const token = getToken();

  useEffect(() => {
    const t = setTimeout(() => setChecking(false), 150);
    return () => clearTimeout(t);
  }, []);

  if (checking) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
}
