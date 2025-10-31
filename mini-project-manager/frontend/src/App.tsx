import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { Moon, Sun, FolderKanban, HelpCircle, LogIn, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { getToken, logout, getEmailFromToken } from "./auth";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProjectPage from "../pages/ProjectPage";
import Welcome from "../pages/Welcome";
import ProtectedRoute from "../components/ProtectedRoute";
import Modal from "../components/ui/Modal";

export default function App() {
  const token = getToken();
  const [dark, setDark] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // Close profile dropdown on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!profileOpen) return;
      const el = profileRef.current;
      if (el && !el.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [profileOpen]);

  // Global shortcuts: g then d (Dashboard), g then w (Welcome)
  useEffect(() => {
    let lastKey = "";
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (lastKey === "g" && (k === "d" || k === "w")) {
        if (k === "d") navigate("/dashboard");
        if (k === "w") navigate("/");
        lastKey = "";
        return;
      }
      lastKey = k;
      setTimeout(() => { lastKey = ""; }, 900);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background layer */}
      <div className="bg-animated-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="blob blob-bl"></div>
        <div className="blob blob-br"></div>
      </div>

      {/* NAVBAR */}
      <header className="relative z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="relative flex justify-between items-center rounded-2xl border border-white/60 dark:border-slate-700 bg-gradient-to-b from-white/75 to-white/40 dark:from-slate-900/70 dark:to-slate-900/40 backdrop-blur-xl backdrop-saturate-150 shadow-[0_8px_30px_rgba(0,0,0,0.12)] ring-1 ring-white/40 dark:ring-white/10 px-4 py-3">
            <div className="absolute inset-0 rounded-2xl -z-10 bg-gradient-to-b from-white/50 to-transparent dark:from-white/10"></div>
            {/* Subtle animated highlight */}
            <div className="pointer-events-none absolute inset-x-6 top-px h-[2px] rounded-full bg-gradient-to-r from-transparent via-indigo-300/60 to-transparent dark:via-indigo-400/40"></div>
          <Link
            to="/"
            className="flex items-center gap-2 text-indigo-600 dark:text-white font-extrabold text-xl"
          >
            <FolderKanban className="text-indigo-600 dark:text-white" /> PlanCraft
          </Link>

            {/* Header actions (all screens) */}
            <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setDark(!dark)}
                className="p-2 rounded-full bg-white/30 dark:bg-slate-700/40 hover:scale-110 transition-transform hover:ring-2 hover:ring-indigo-200/60 dark:hover:ring-indigo-400/30"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={() => setHelpOpen(true)}
                className="flex items-center gap-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:scale-105 transition"
              aria-label="Help"
              title="Help"
            >
              <HelpCircle size={20} />
              <span className="hidden sm:inline">Help</span>
            </button>


              {token ? (
                <div className="relative" ref={profileRef}>
                  {/* Profile avatar with initial */}
                  <button
                    onClick={() => setProfileOpen(v => !v)}
                    className="relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-indigo-600 text-white font-bold shadow-sm hover:ring-2 hover:ring-indigo-300/60"
                    aria-haspopup="menu"
                    aria-expanded={profileOpen}
                    title="Account"
                  >
                    {(() => {
                      const email = getEmailFromToken();
                      const initial = email ? String(email).trim().charAt(0).toUpperCase() : 'U';
                      return initial;
                    })()}
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 top-12 z-50 w-44 rounded-xl border border-white/60 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg ring-1 ring-indigo-100 p-1">
                      <button
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-700/50"
                        onClick={() => { setProfileOpen(false); navigate('/dashboard'); }}
                      >
                        Dashboard
                      </button>
                      <button
                        className="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-slate-700/50"
                        onClick={() => {
                          setProfileOpen(false);
                          // Navigate to Welcome first to avoid protected-route redirect to /login
                          navigate("/", { replace: true });
                          setTimeout(() => {
                            logout();
                          }, 0);
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition shadow-sm"
                  >
                    <LogIn size={16} />
                    <span className="hidden sm:inline">Login</span>
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/50 dark:bg-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-700/70 text-slate-800 dark:text-slate-100 transition shadow-sm"
                  >
                    <UserPlus size={16} />
                    <span className="hidden sm:inline">Register</span>
                  </button>
                </>
              )}
            </div>

            {/* No separate mobile bar; icons above are responsive */}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <AnimatePresence mode="wait">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/projects/:id" element={<ProjectPage />} />
              </Route>
            </Routes>
          </motion.main>
        </div>
      </AnimatePresence>

      <footer className="text-center text-sm text-gray-500 dark:text-gray-400 py-3">
        © {new Date().getFullYear()} PlanCraft · Developed by Manav Rai
      </footer>

      <Modal
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        title="PlanCraft – Quick Guide"
        actions={
          <button
            onClick={() => setHelpOpen(false)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Close
          </button>
        }
      >
        <div className="space-y-4 text-sm text-slate-700">
          <p>PlanCraft helps you plan and manage with a soothing, professional UI.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><span className="font-semibold">Responsive app shell</span>: sidebar on desktop, streamlined layout on mobile.</li>
            <li><span className="font-semibold">Dashboard</span>: create projects, search, export JSON, bulk add, inline edit, duplicate protection.</li>
            <li><span className="font-semibold">Projects</span>: progress bar, task filters (All/Active/Completed), search, sort by Due/Created.</li>
            <li><span className="font-semibold">Smart Scheduler</span>: generates recommended task order using your current tasks only. Note: it will not run if there are duplicate task titles.</li>
            <li><span className="font-semibold">Auth</span>: JWT-based login/register; logout button in header; success banner after registration.</li>
            <li><span className="font-semibold">Shortcuts</span>: press <code>g</code> then <code>d</code> for Dashboard, <code>g</code> then <code>w</code> for Welcome.</li>
            <li><span className="font-semibold">Theme</span>: light/dark toggle with high-contrast inputs and cards.</li>
          </ul>
          <p className="text-slate-600">Tip: Use the Help button anytime to revisit this guide.</p>
        </div>
      </Modal>
    </div>
  );
}
