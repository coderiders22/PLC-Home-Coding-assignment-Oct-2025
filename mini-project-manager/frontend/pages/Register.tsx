import { useState } from "react";
import { post } from "../src/api";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, User } from "lucide-react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    
    if (password !== confirmPassword) {
      setErr("Passwords do not match");
      return;
    }

    setLoading(true);
    const res = await post("/api/auth/register", { email, password });
    setLoading(false);
    
    if (res.ok) {
      // After successful registration, redirect to login with success state
      nav("/login", { state: { registered: true } });
    } else {
      const text = await res.text();
      setErr(text || "Registration failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Link
          to="/"
          className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold mb-6 flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-3xl p-8 border border-white/70 dark:border-slate-700 shadow-xl ring-1 ring-indigo-100">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-purple-100 rounded-2xl mb-4">
              <User className="text-purple-600" size={28} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-slate-100 mb-2">Create Account</h2>
            <p className="text-gray-500 dark:text-slate-300">Join us to get started</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-100 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-indigo-400" size={20} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 text-gray-800 dark:bg-white dark:text-slate-900 rounded-xl focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-100 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-indigo-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border-2 border-gray-200 text-gray-800 dark:bg-white dark:text-slate-900 rounded-xl focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-indigo-400 hover:text-indigo-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-100 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-indigo-400" size={20} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 text-gray-800 dark:bg-white dark:text-slate-900 rounded-xl focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            {err && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{err}</p>}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </motion.button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-gray-400 text-sm">OR</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}