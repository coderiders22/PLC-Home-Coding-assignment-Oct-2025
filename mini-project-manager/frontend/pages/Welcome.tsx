import { } from "react";
import { motion } from "framer-motion";
import { FolderKanban, ArrowRight, CheckCircle2, Zap, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-hidden relative flex items-center justify-center">

      <div className="relative z-10 text-center max-w-2xl px-6">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8 inline-block"
        >
          <div className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-xl">
            <FolderKanban size={56} className="text-white" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent mb-4"
        >
          PlanCraft
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-slate-700 dark:text-slate-200 mb-12"
        >
          Organize, manage, and collaborate on your projects effortlessly
        </motion.p>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-12"
        >
          {[
            { icon: CheckCircle2, title: "Organized", desc: "Projects, tasks, progress" },
            { icon: Zap, title: "Productive", desc: "Bulk add, export, inline edit" },
            { icon: Shield, title: "Secure", desc: "JWT auth, protected routes" },
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="p-4 rounded-2xl bg-white shadow-md border border-purple-100 hover:border-indigo-300 transition-all"
            >
              <feature.icon className="text-indigo-600 mx-auto mb-2" size={28} />
              <p className="text-slate-800 dark:text-slate-900 font-semibold text-sm">{feature.title}</p>
              <p className="text-slate-500 dark:text-slate-700 text-xs">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="max-w-2xl mx-auto text-left text-sm text-slate-700 dark:text-slate-200 space-y-3 mb-10">
          <p className="font-semibold">Highlights</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><span className="font-semibold">Dashboard</span>: create projects, search, live stats (Total, This week, Today), bulk add, export to JSON, inline title edit with duplicate protection.</li>
            <li><span className="font-semibold">Projects</span>: add tasks with due dates, toggle completion, filters (All/Active/Completed), search, sort by Due/Created, progress bar, warning for overdue/soon tasks.</li>
            <li><span className="font-semibold">Smart Scheduler</span>: plans work using your current tasks only. Note: duplicate task titles will block scheduling.</li>
            <li><span className="font-semibold">UX</span>: responsive layout for mobile/tablet/desktop, accessible forms, clear containers in light/dark themes.</li>
            <li><span className="font-semibold">Shortcuts</span>: g then d → Dashboard, g then w → Welcome.</li>
          </ul>
        </div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05, boxShadow: "0 20px 50px rgba(99, 102, 241, 0.3)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/login")}
          className="w-full sm:w-auto px-8 sm:px-10 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl transition-all flex items-center justify-center gap-3 mx-auto"
        >
          Get Started <ArrowRight size={20} />
        </motion.button>
      </div>
    </div>
  );
}
