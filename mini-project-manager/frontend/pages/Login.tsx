import { useState } from "react";
import { post } from "../src/api";
import { saveToken } from "../src/auth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";

const inputVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  focus: { scale: 1.02, transition: { duration: 0.2 } },
};

const buttonVariants = {
  hover: { scale: 1.05, boxShadow: "0 10px 25px rgba(99, 102, 241, 0.3)" },
  tap: { scale: 0.98 },
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();
  const location = useLocation();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setIsLoading(true);
    const res = await post("/api/auth/login", { email, password });
    if (res.ok) {
      const d = await res.json();
      saveToken(d.token);
      nav("/dashboard");
    } else {
      const text = await res.text();
      setErr(text || "Login failed");
    }
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-3xl p-8 w-full max-w-md border border-white/70 dark:border-slate-700 shadow-xl ring-1 ring-indigo-100"
        whileHover={{ y: -5 }}
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <LogIn className="mx-auto text-indigo-600" size={48} />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold mt-4 text-gray-800 dark:text-slate-100"
          >
            Welcome Back
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-500 dark:text-slate-300 text-sm mt-2"
          >
            Login to continue managing your projects
          </motion.p>
        </div>

        {((location.state as any)?.registered) && (
          <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl p-3">
            Account created! Please login to continue.
          </div>
        )}

        <motion.form 
          onSubmit={submit} 
          className="space-y-6"
          initial="initial"
          animate="animate"
          variants={{
            initial: { transition: { staggerChildren: 0.1 } },
            animate: { transition: { staggerChildren: 0.1 } },
          }}
        >
          <motion.div
            variants={inputVariants}
            className="relative"
          >
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-gray-50/50 dark:bg-white dark:text-slate-900 transition-all duration-200"
            />
          </motion.div>

          <motion.div
            variants={inputVariants}
            className="relative"
          >
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-gray-50/50 dark:bg-white dark:text-slate-900 transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </motion.div>

          <AnimatePresence>
            {err && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-500 text-sm bg-red-50 p-3 rounded-lg"
              >
                {err}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={isLoading}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white w-full py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Login</span>
            )}
          </motion.button>
        </motion.form>

        <p className="text-sm text-gray-500 text-center mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}