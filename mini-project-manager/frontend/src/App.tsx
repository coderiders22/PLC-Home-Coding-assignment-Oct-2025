import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { Moon, Sun, FolderKanban, LogOut, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { getToken, logout } from "./auth";
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
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

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

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center rounded-2xl border border-white/60 dark:border-slate-700 bg-white/70 dark:bg-slate-900/50 backdrop-blur-md shadow-sm ring-1 ring-indigo-100 px-4 py-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-indigo-600 dark:text-white font-extrabold text-xl"
          >
            <FolderKanban className="text-indigo-600 dark:text-white" /> PlanCraft
          </Link>

            {/* Desktop actions */}
            <div className="hidden sm:flex items-center gap-4">
            <button
              onClick={() => setDark(!dark)}
              className="p-2 rounded-full bg-white/30 dark:bg-slate-700/40 hover:scale-110 transition-transform"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={() => setHelpOpen(true)}
              className="flex items-center gap-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              aria-label="Help"
              title="Help"
            >
              <HelpCircle size={20} />
              <span className="hidden sm:inline">Help</span>
            </button>


              {token ? (
                <>
                  <Link
                    to="/dashboard"
                    className="font-medium hover:text-accent transition"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/login", { replace: true });
                    }}
                    className="p-2 rounded-full bg-white/40 dark:bg-slate-700/40 text-red-500 hover:text-red-600 hover:scale-110 transition"
                    aria-label="Logout"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-accent">Login</Link>
                  <Link to="/register" className="hover:text-accent">Register</Link>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              className="sm:hidden inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/40 dark:bg-slate-700/40 text-slate-700 dark:text-slate-200"
              onClick={() => setNavOpen((v) => !v)}
              aria-expanded={navOpen}
              aria-controls="mobile-nav"
            >
              <span className="text-sm font-medium">Menu</span>
              {/* simple hamburger */}
              <span className="relative block w-4 h-3">
                <span className={`absolute inset-x-0 top-0 h-0.5 rounded bg-current transition-transform ${navOpen ? 'translate-y-1.5 rotate-45' : ''}`}></span>
                <span className={`absolute inset-x-0 top-1.5 h-0.5 rounded bg-current transition-opacity ${navOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`absolute inset-x-0 bottom-0 h-0.5 rounded bg-current transition-transform ${navOpen ? '-translate-y-1.5 -rotate-45' : ''}`}></span>
              </span>
            </button>
          </div>

          {/* Mobile menu */}
          {navOpen && (
            <div id="mobile-nav" className="sm:hidden mt-2 rounded-2xl border border-white/60 dark:border-slate-700 bg-white/80 dark:bg-slate-900/70 backdrop-blur-md shadow-sm ring-1 ring-indigo-100 px-4 py-3">
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setDark(!dark)}
                  className="self-start px-3 py-2 rounded-lg bg-white/60 dark:bg-slate-700/50 text-sm"
                >
                  {dark ? 'Light mode' : 'Dark mode'}
                </button>
                <button
                  onClick={() => setHelpOpen(true)}
                  className="self-start px-3 py-2 rounded-lg bg-white/60 dark:bg-slate-700/50 text-sm text-red-600 dark:text-red-400"
                >
                  Help
                </button>
                {token ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setNavOpen(false)}
                      className="px-3 py-2 rounded-lg bg-indigo-50 dark:bg-slate-700/50 text-indigo-700 dark:text-slate-100"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setNavOpen(false);
                        navigate("/login", { replace: true });
                      }}
                      className="px-3 py-2 rounded-lg bg-white/60 dark:bg-slate-700/50 text-red-600"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setNavOpen(false)} className="px-3 py-2 rounded-lg bg-white/60 dark:bg-slate-700/50">Login</Link>
                    <Link to="/register" onClick={() => setNavOpen(false)} className="px-3 py-2 rounded-lg bg-white/60 dark:bg-slate-700/50">Register</Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <AnimatePresence mode="wait">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 grid md:grid-cols-[220px_1fr] gap-4 sm:gap-6">
          {/* Sidebar (md+) */}
          <aside className="hidden md:block sticky top-20 h-max">
            <div className="rounded-2xl border border-white/60 dark:border-slate-700 bg-white/80 dark:bg-slate-800/70 backdrop-blur-md p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-3">Navigation</p>
              <nav className="space-y-2">
                <Link to="/" className={`block px-3 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-700/50 ${location.pathname === '/' ? 'bg-indigo-50 text-indigo-700' : ''}`}>Welcome</Link>
                <Link to="/dashboard" className={`block px-3 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-700/50 ${location.pathname.startsWith('/dashboard') ? 'bg-indigo-50 text-indigo-700' : ''}`}>Dashboard</Link>
                {!token && (
                  <>
                    <Link to="/login" className="block px-3 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-700/50">Login</Link>
                    <Link to="/register" className="block px-3 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-700/50">Register</Link>
                  </>
                )}
              </nav>
              <div className="mt-4 text-xs text-slate-500">
                Tip: Click Help in the header anytime.
              </div>
            </div>
          </aside>

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
        © {new Date().getFullYear()} · Developed by Manav Rai
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
