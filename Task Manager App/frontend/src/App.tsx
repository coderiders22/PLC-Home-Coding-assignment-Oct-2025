import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Trash2, Plus, Sun, Moon, Calendar, Sparkles, Zap, Award, Edit2, Clock, TrendingUp, Bolt, Download, Upload, HelpCircle, X, Filter, AlertTriangle } from "lucide-react";

interface Task {
  id: number;
  title: string; // Main task text (required)
  description?: string; // Optional notes/description
  isCompleted: boolean;
  dueDate?: string;
}

interface Notification {
  id: string;
  type: "create" | "update" | "delete" | "overdue" | "error";
  message: string;
  taskName?: string;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskIds, setTaskIds] = useState<number[]>([]);
  const [title, setTitle] = useState(""); // Renamed from desc
  const [notes, setNotes] = useState(""); // New: for description/notes
  const [due, setDue] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed" | "overdue">("all");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState(""); // Renamed
  const [editNotes, setEditNotes] = useState(""); // New
  const [editDue, setEditDue] = useState("");
  const [showWelcome, setShowWelcome] = useState(false); // Always show on mount
  const [showHelp, setShowHelp] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showImport, setShowImport] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false); // Not used now
  const inputRef = useRef<HTMLInputElement>(null);
  const editRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null); // New ref for notes
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Export/Import (full backup)
  const exportTasks = () => {
    const dataStr = JSON.stringify({ tasks, theme, filter }, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `taskforge-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    addNotification("update", "Backup exported!");
  };

  const importTasks = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const { tasks: importedTasks, theme: importedTheme, filter: importedFilter } = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedTasks)) {
          // Clear existing
          localStorage.removeItem("tasks_ids_v1");
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith("task_")) {
              localStorage.removeItem(key);
            }
          });
          // Save new (handle old format if needed, but assume updated)
          const newIds = importedTasks.map((t: Task) => t.id).sort((a, b) => a - b);
          setTaskIds(newIds);
          localStorage.setItem("tasks_ids_v1", JSON.stringify(newIds));
          importedTasks.forEach((t: Task) => {
            localStorage.setItem(`task_${t.id}_v1`, JSON.stringify(t));
          });
          setTasks(importedTasks);
          if (importedTheme) setTheme(importedTheme as "light" | "dark");
          if (importedFilter) setFilter(importedFilter as "all" | "active" | "completed" | "overdue");
          addNotification("create", "Backup imported!");
        }
      } catch (err) {
        console.error("Import error:", err);
        addNotification("delete", "Invalid backup file.");
      }
    };
    reader.readAsText(file);
    setShowImport(false);
    event.target.value = "";
  };

  // Add notification (updated for error type)
  const addNotification = (type: "create" | "update" | "delete" | "overdue" | "error", taskName?: string) => {
    const id = Date.now().toString();
    const messages = {
      create: `Task "${taskName}" created successfully!`,
      update: `Task "${taskName}" updated!`,
      delete: `Task "${taskName}" deleted!`,
      overdue: `Task "${taskName}" is overdue!`,
      error: `Task title is required! Please add a title to create the task.`
    };

    setNotifications(prev => [...prev, { id, type, message: messages[type], taskName }]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  // Save single task
  const saveTask = useCallback((task: Task) => {
    try {
      localStorage.setItem(`task_${task.id}_v1`, JSON.stringify(task));
      console.log(`Saved task ${task.id} to localStorage:`, task);
    } catch (e) {
      console.error(`Save task ${task.id} error:`, e);
    }
  }, []);

  // Save task IDs list
  const saveTaskIds = useCallback((ids: number[]) => {
    try {
      localStorage.setItem("tasks_ids_v1", JSON.stringify(ids));
      console.log(`Saved task IDs to localStorage:`, ids);
    } catch (e) {
      console.error("Save task IDs error:", e);
    }
  }, []);

  // Save theme and filter
  const saveData = useCallback((key: string, value: any) => {
    try {
      const valueStr = typeof value === "string" ? value : JSON.stringify(value);
      localStorage.setItem(`taskforge_${key}_v1`, valueStr);
      console.log(`Saved ${key} to localStorage:`, valueStr);
    } catch (e) {
      console.error(`Save ${key} error:`, e);
    }
  }, []);

  // Load from localStorage on mount (synchronous) - Enhanced with fallback scan + Fixed compat logic
  useEffect(() => {
    // Always show welcome on mount
    setShowWelcome(true);

    try {
      // Load theme and filter (onboarding removed)
      const savedTheme = localStorage.getItem("taskforge_theme_v1");
      const savedFilter = localStorage.getItem("taskforge_filter_v1");
      if (savedTheme) {
        setTheme(savedTheme as "light" | "dark");
      }
      if (savedFilter && (["all", "active", "completed", "overdue"] as const).includes(savedFilter as any)) {
        setFilter(savedFilter as "all" | "active" | "completed" | "overdue");
      }

      // Load tasks via IDs
      const savedIdsStr = localStorage.getItem("tasks_ids_v1");
      let ids: number[] = [];
      if (savedIdsStr) {
        try {
          ids = JSON.parse(savedIdsStr);
          console.log("Loaded IDs from list:", ids);
        } catch (e) {
          console.error("Parse IDs error:", e);
          ids = [];
        }
      }
      setTaskIds(ids); // Temporary set to loaded IDs
      let loadedTasks: Task[] = [];
      // Fixed compat: Handle old tasks (no title, only description) vs new (title + description)
      ids.forEach(id => {
        const taskStr = localStorage.getItem(`task_${id}_v1`);
        if (taskStr) {
          try {
            const parsed = JSON.parse(taskStr);
            let task: Task;
            if (parsed.title) {
              // New format: use title and description directly
              task = {
                id: parsed.id,
                title: parsed.title,
                description: parsed.description, // Keep description as is
                isCompleted: parsed.isCompleted,
                dueDate: parsed.dueDate
              };
            } else {
              // Old format: map description to title
              task = {
                id: parsed.id,
                title: parsed.description || "Untitled",
                description: undefined,
                isCompleted: parsed.isCompleted,
                dueDate: parsed.dueDate
              };
            }
            loadedTasks.push(task);
            console.log(`Loaded task ${id}:`, task); // Debug log
          } catch (e) {
            console.error(`Parse task ${id} error:`, e);
            localStorage.removeItem(`task_${id}_v1`);
          }
        }
      });
      console.log("Tasks loaded from IDs list:", loadedTasks);

      // Fallback scan for missing tasks (fixed compat same way)
      const idSet = new Set(ids);
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith("task_") && key.endsWith("_v1")) {
          const match = key.match(/task_(\d+)_v1/);
          if (match) {
            const id = Number(match[1]);
            if (!idSet.has(id)) {
              const taskStr = localStorage.getItem(key);
              if (taskStr) {
                try {
                  const parsed = JSON.parse(taskStr);
                  let task: Task;
                  if (parsed.title) {
                    // New format
                    task = {
                      id: parsed.id,
                      title: parsed.title,
                      description: parsed.description,
                      isCompleted: parsed.isCompleted,
                      dueDate: parsed.dueDate
                    };
                  } else {
                    // Old format
                    task = {
                      id: parsed.id,
                      title: parsed.description || "Untitled",
                      description: undefined,
                      isCompleted: parsed.isCompleted,
                      dueDate: parsed.dueDate
                    };
                  }
                  if (task.id === id) {
                    loadedTasks.push(task);
                    console.log(`Fallback: Recovered task ${id}:`, task); // Debug log
                  }
                } catch (e) {
                  console.error(`Fallback parse error for ${key}:`, e);
                  localStorage.removeItem(key);
                }
              }
            }
          }
        }
      });

      loadedTasks.sort((a, b) => a.id - b.id);
      setTasks(loadedTasks);
      const validIds = loadedTasks.map(t => t.id).sort((a, b) => a - b);
      setTaskIds(validIds);
      saveTaskIds(validIds);
      console.log("Final loaded tasks (with fallback):", loadedTasks);
      console.log("Final valid task IDs:", validIds);
      if (loadedTasks.length > ids.length) {
        console.log(`Fallback scan recovered ${loadedTasks.length - ids.length} missing tasks!`);
      }
    } catch (e) {
      console.error("Load error:", e);
    }
  }, []);

  // Save theme
  useEffect(() => {
    saveData("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme, saveData]);

  // Save filter
  useEffect(() => {
    saveData("filter", filter);
  }, [filter, saveData]);

  // Save task IDs when changed (backup)
  useEffect(() => {
    saveTaskIds(taskIds);
  }, [taskIds, saveTaskIds]);

  const addTask = () => {
    if (!title.trim()) {
      // Fix: Show error notification if no title
      addNotification("error");
      return;
    }
    const newTask: Task = {
      id: Date.now(),
      title: title, // Main task title
      description: notes.trim() || undefined, // Optional notes
      isCompleted: false,
      dueDate: due || undefined,
    };
    setTasks(prev => [...prev, newTask]);
    const newIds = [...taskIds, newTask.id].sort((a, b) => a - b);
    setTaskIds(newIds);
    saveTaskIds(newIds);
    saveTask(newTask);
    addNotification("create", title);
    setTitle("");
    setNotes("");
    setDue("");
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditNotes(task.description || "");
    setEditDue(task.dueDate || "");
    setTimeout(() => {
      editRef.current?.focus();
      // Focus on title first, notes after
    }, 100);
  };

  const saveEdit = (id: number) => {
    if (!editTitle.trim()) {
      // Fix: Error if no title on edit
      addNotification("error");
      return;
    }
    const currentTask = tasks.find(t => t.id === id);
    if (!currentTask) return;
    const updatedTask: Task = { 
      ...currentTask, 
      title: editTitle, 
      description: editNotes.trim() || undefined, 
      dueDate: editDue || undefined 
    };
    setTasks(prev =>
      prev.map((t) =>
        t.id === id ? updatedTask : t
      )
    );
    saveTask(updatedTask);
    addNotification("update", editTitle);
    setEditingId(null);
    setEditTitle("");
    setEditNotes("");
    setEditDue("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditNotes("");
    setEditDue("");
  };

  const toggle = (id: number) => {
    const currentTask = tasks.find(t => t.id === id);
    if (!currentTask) return;
    const toggledTask = { ...currentTask, isCompleted: !currentTask.isCompleted };
    setTasks(prev =>
      prev.map((t) =>
        t.id === id ? toggledTask : t
      )
    );
    saveTask(toggledTask);
  };

  const del = (id: number) => {
    const taskToDel = tasks.find(t => t.id === id);
    if (taskToDel) {
      localStorage.removeItem(`task_${taskToDel.id}_v1`);
      addNotification("delete", taskToDel.title);
    }
    setTasks(prev => prev.filter((t) => t.id !== id));
    const newIds = taskIds.filter(tid => tid !== id).sort((a, b) => a - b);
    setTaskIds(newIds);
    saveTaskIds(newIds);
  };

  const now = new Date();
  const filteredTasks = tasks
    .filter((t) => {
      const dueDate = t.dueDate ? new Date(t.dueDate) : null;
      if (filter === "active") return !t.isCompleted && (!dueDate || dueDate >= now);
      if (filter === "completed") return t.isCompleted;
      if (filter === "overdue") return !t.isCompleted && dueDate && dueDate < now;
      return true;
    })
    .sort((a, b) => {
      const aDue = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const bDue = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return aDue - bDue;
    });

  const completed = tasks.filter((t) => t.isCompleted).length;
  const total = tasks.length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  const isOverdue = (task: Task) => {
    const dueDate = task.dueDate ? new Date(task.dueDate) : null;
    return !task.isCompleted && dueDate && dueDate < now;
  };

  const closeWelcome = () => {
    // No localStorage now - just hide
    setShowWelcome(false);
  };

  if (showWelcome) {
    return (
      <div className={`min-h-screen w-full overflow-hidden relative ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950"
          : "bg-gradient-to-br from-white via-blue-50 to-purple-50"
      }`}>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl ${
            theme === "dark" ? "bg-indigo-500/20" : "bg-indigo-300/30"
          }`} animate={{ y: [0, 50, 0], x: [0, 30, 0] }} transition={{ duration: 8, repeat: Infinity }} />
          <motion.div className={`absolute top-1/2 -left-40 w-96 h-96 rounded-full blur-3xl ${
            theme === "dark" ? "bg-purple-500/20" : "bg-purple-300/30"
          }`} animate={{ y: [0, -50, 0], x: [0, -30, 0] }} transition={{ duration: 10, repeat: Infinity }} />
          <motion.div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl ${
            theme === "dark" ? "bg-pink-500/10" : "bg-pink-300/20"
          }`} animate={{ y: [0, 30, 0] }} transition={{ duration: 12, repeat: Infinity }} />
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-5xl">
            {/* Header */}
            <div className="text-center mb-12 sm:mb-16">
              <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }} className="inline-block mb-6 sm:mb-8">
                <div className="relative w-20 h-20 sm:w-28 sm:h-28">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-75" />
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                    <Bolt className="w-10 h-10 sm:w-14 sm:h-14 text-white" />
                  </div>
                </div>
              </motion.div>

              <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className={`text-4xl sm:text-6xl lg:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r ${
                theme === "dark"
                  ? "from-indigo-200 via-purple-200 to-pink-200"
                  : "from-indigo-600 via-purple-600 to-pink-600"
              } mb-4 sm:mb-6`}>
                TaskForge
              </motion.h1>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className={`text-base sm:text-lg ${
                theme === "dark" ? "text-slate-300" : "text-slate-700"
              } max-w-2xl mx-auto`}>
                Welcome back! Let's explore the features and how to use TaskForge.
              </motion.p>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mb-8 sm:mb-12">
              <h2 className={`text-2xl sm:text-3xl font-bold mb-6 text-center ${
                theme === "dark" ? "text-slate-200" : "text-slate-800"
              }`}>Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { icon: Plus, title: "Add New Tasks", desc: "Type a title and optional notes/description in the input field. Press Enter or click Add to create a task instantly." },
                  { icon: CheckCircle, title: "Smart Task Completion", desc: "Click the circle next to a task to mark it complete. Completed tasks show a line-through and are counted in progress." },
                  { icon: Calendar, title: "Due Dates & Overdue Alerts", desc: "Set due dates when adding tasks. Overdue tasks (uncompleted past due date) get a red badge and filter." },
                  { icon: Edit2, title: "Edit Tasks", desc: "Hover on a task and click the edit icon (pencil) to modify title, notes, or due date. Save or cancel changes." },
                  { icon: Trash2, title: "Delete Tasks", desc: "Hover and click the trash icon to remove a task permanently. Confirmation via notification." },
                  { icon: TrendingUp, title: "Progress Tracking", desc: "See your completion percentage with a dynamic progress bar. Filters help view active, completed, or overdue tasks." },
                  { icon: Filter, title: "Task Filters", desc: "Use buttons below input to view All, Active, Completed, or Overdue tasks. Sorts by due date automatically." },
                  { icon: Download, title: "Backup & Restore", desc: "Export all data as JSON (download icon) for backup. Import from file (upload icon) to restore across devices." },
                  { icon: Sun, title: "Theme Switch", desc: "Toggle between light and dark mode using the sun/moon icon in the header. Persists across sessions." },
                  { icon: Zap, title: "Real-time Notifications", desc: "Get instant animated feedback for task creation, updates, deletions, and overdue alerts right in the center of your screen." },
                  { icon: HelpCircle, title: "Help Guide", desc: "Click the help icon (?) in the dashboard header anytime for a quick modal with all feature reminders and tips." }
                ].map((feature, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + idx * 0.1 }} className={`backdrop-blur-xl rounded-2xl p-4 sm:p-6 transition-all ${
                    theme === "dark"
                      ? "bg-gradient-to-br from-white/10 to-white/5 border border-white/20 hover:border-indigo-400/50 hover:bg-indigo-500/10"
                      : "bg-white/70 border border-white/50 shadow-lg hover:shadow-xl hover:border-indigo-400/50 hover:bg-white/90"
                  }`}>
                    <feature.icon className={`w-8 h-8 sm:w-10 sm:h-10 mb-4 mx-auto group-hover:scale-110 transition-transform ${
                      theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                    }`} />
                    <h3 className={`text-lg sm:text-xl font-bold mb-2 text-center ${
                      theme === "dark" ? "text-slate-100" : "text-slate-800"
                    }`}>{feature.title}</h3>
                    <p className={`text-sm sm:text-base text-center ${
                      theme === "dark" ? "text-slate-400" : "text-slate-600"
                    }`}>{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
              <p className={`text-center mt-6 text-sm ${
                theme === "dark" ? "text-slate-500" : "text-slate-600"
              }`}>All data is automatically saved as JSON in localStorage. Use Help button anytime for reminders.</p>
            </motion.div>

            {/* CTA Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="text-center">
              <motion.button 
                onClick={closeWelcome} 
                whileHover={{ scale: 1.05, boxShadow: "0 25px 50px rgba(99, 102, 241, 0.4)" }} 
                whileTap={{ scale: 0.95 }} 
                className="group relative inline-block px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-lg sm:text-xl rounded-2xl overflow-hidden shadow-2xl"
                title="Enter Dashboard"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center justify-center gap-2">
                  Start Forging <Bolt className="w-5 h-5 sm:w-6 sm:h-6" />
                </span>
              </motion.button>
              <p className={`text-sm mt-6 ${
                theme === "dark" ? "text-slate-500" : "text-slate-600"
              }`}>
                You can always access Help from the main screen.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen w-full p-4 sm:p-6 lg:p-8 ${
      theme === "dark"
        ? "bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950"
        : "bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50"
    }`}>
      {/* Background blur elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl ${
          theme === "dark" ? "bg-indigo-500/10" : "bg-indigo-300/20"
        }`} animate={{ y: [0, 80, 0] }} transition={{ duration: 8, repeat: Infinity }} />
        <motion.div className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl ${
          theme === "dark" ? "bg-purple-500/10" : "bg-purple-300/20"
        }`} animate={{ y: [0, -80, 0] }} transition={{ duration: 10, repeat: Infinity }} />
      </div>

      {/* Notifications - Center Screen (updated for error) */}
      <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center">
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, scale: 0.8, y: -50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`backdrop-blur-xl rounded-3xl px-8 sm:px-12 py-6 sm:py-8 border shadow-2xl pointer-events-auto max-w-md ${
                notif.type === "create"
                  ? theme === "dark"
                    ? "bg-green-500/20 border-green-400/30"
                    : "bg-green-100/90 border-green-300"
                  : notif.type === "update"
                  ? theme === "dark"
                    ? "bg-blue-500/20 border-blue-400/30"
                    : "bg-blue-100/90 border-blue-300"
                  : notif.type === "delete"
                  ? theme === "dark"
                    ? "bg-red-500/20 border-red-400/30"
                    : "bg-red-100/90 border-red-300"
                  : notif.type === "overdue"
                  ? theme === "dark"
                    ? "bg-yellow-500/20 border-yellow-400/30"
                    : "bg-yellow-100/90 border-yellow-300"
                  : notif.type === "error"
                  ? theme === "dark"
                    ? "bg-red-500/20 border-red-400/30"
                    : "bg-red-100/90 border-red-300"
                  : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.6, repeat: 1 }}
                  className={`text-3xl sm:text-4xl flex-shrink-0`}
                >
                  {notif.type === "create" ? "✨" : notif.type === "update" ? "📝" : notif.type === "delete" ? "🗑️" : notif.type === "overdue" ? "⏰" : "⚠️"}
                </motion.div>
                <div>
                  <p className={`text-base sm:text-lg font-bold ${
                    notif.type === "create"
                      ? theme === "dark"
                        ? "text-green-300"
                        : "text-green-700"
                      : notif.type === "update"
                      ? theme === "dark"
                        ? "text-blue-300"
                        : "text-blue-700"
                      : notif.type === "delete"
                      ? theme === "dark"
                        ? "text-red-300"
                        : "text-red-700"
                      : notif.type === "overdue"
                      ? theme === "dark"
                        ? "text-yellow-300"
                        : "text-yellow-700"
                      : notif.type === "error"
                      ? theme === "dark"
                        ? "text-red-300"
                        : "text-red-700"
                      : ""
                  }`}>
                    {notif.message}
                  </p>
                  <p className={`text-xs sm:text-sm mt-1 ${
                    notif.type === "create"
                      ? theme === "dark"
                        ? "text-green-200/70"
                        : "text-green-600/70"
                      : notif.type === "update"
                      ? theme === "dark"
                        ? "text-blue-200/70"
                        : "text-blue-600/70"
                      : notif.type === "delete"
                      ? theme === "dark"
                        ? "text-red-200/70"
                        : "text-red-600/70"
                      : notif.type === "overdue"
                      ? theme === "dark"
                        ? "text-yellow-200/70"
                        : "text-yellow-600/70"
                      : notif.type === "error"
                      ? theme === "dark"
                        ? "text-red-200/70"
                        : "text-red-600/70"
                      : ""
                  }`}>
                    {notif.type === "create" ? "Task added to your workspace" : notif.type === "update" ? "Task has been updated" : notif.type === "delete" ? "Task removed from workspace" : notif.type === "overdue" ? "This task needs attention" : notif.type === "error" ? "Title is mandatory to create or update tasks." : ""}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelp && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowHelp(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              className={`max-w-md w-full rounded-2xl p-6 ${
                theme === "dark" ? "bg-slate-800/95" : "bg-white/95"
              } border border-slate-200/50`}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className={`font-bold text-lg ${theme === "dark" ? "text-slate-100" : "text-slate-800"}`}>Quick Help</h3>
                <button onClick={() => setShowHelp(false)} className="p-1 rounded-full hover:bg-slate-200/50">
                  <X size={20} className={theme === "dark" ? "text-slate-400" : "text-slate-600"} />
                </button>
              </div>
              <ul className={`space-y-3 text-sm ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                <li className="flex items-start gap-2"><CheckCircle size={16} className="mt-1 flex-shrink-0" /> Click circle to complete task.</li>
                <li className="flex items-start gap-2"><Calendar size={16} className="mt-1 flex-shrink-0" /> Add due date for reminders.</li>
                <li className="flex items-start gap-2"><Edit2 size={16} className="mt-1 flex-shrink-0" /> Hover & edit tasks (title + notes).</li>
                <li className="flex items-start gap-2"><Trash2 size={16} className="mt-1 flex-shrink-0" /> Hover & delete.</li>
                <li className="flex items-start gap-2"><TrendingUp size={16} className="mt-1 flex-shrink-0" /> Progress bar shows % complete.</li>
                <li className="flex items-start gap-2"><Download size={16} className="mt-1 flex-shrink-0" /> Export for backup.</li>
                <li className="flex items-start gap-2"><Upload size={16} className="mt-1 flex-shrink-0" /> Import to restore.</li>
                <li className="flex items-start gap-2"><Sun size={16} className="mt-1 flex-shrink-0" /> Toggle theme.</li>
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 sm:mb-10">
          <div>
            <motion.h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r ${
              theme === "dark"
                ? "from-indigo-300 via-purple-300 to-pink-300"
                : "from-indigo-600 via-purple-600 to-pink-600"
            } drop-shadow-sm`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              TaskForge
            </motion.h1>
            <p className={`text-xs sm:text-sm mt-1 ${
              theme === "dark" ? "text-slate-400" : "text-slate-600"
            }`}>Master your productivity</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Help Button */}
            <motion.button onClick={() => setShowHelp(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} title="Quick Help Guide" className={`p-2 rounded-lg transition-all ${
              theme === "dark"
                ? "text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/20"
                : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-100/80"
            }`}>
              <HelpCircle size={18} />
            </motion.button>
            {/* Export/Import Buttons */}
            <motion.button onClick={exportTasks} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} title="Export Backup (Download JSON file with all tasks, theme, and filter)" className={`p-2 rounded-lg transition-all ${
              theme === "dark"
                ? "text-slate-400 hover:text-green-300 hover:bg-green-500/20"
                : "text-slate-600 hover:text-green-700 hover:bg-green-100/80"
            }`}>
              <Download size={18} />
            </motion.button>
            <motion.button onClick={() => { setShowImport(true); fileInputRef.current?.click(); }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} title="Import Backup (Upload JSON file to restore tasks, theme, and filter)" className={`p-2 rounded-lg transition-all ${
              theme === "dark"
                ? "text-slate-400 hover:text-blue-300 hover:bg-blue-500/20"
                : "text-slate-600 hover:text-blue-700 hover:bg-blue-100/80"
            }`}>
              <Upload size={18} />
            </motion.button>
            {showImport && (
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={importTasks}
                className="hidden"
              />
            )}
            <motion.button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} whileHover={{ scale: 1.1, rotate: 20 }} whileTap={{ scale: 0.95 }} title="Toggle Theme (Light/Dark mode)" className={`p-3 sm:p-4 rounded-2xl transition-all shadow-lg ${
              theme === "dark"
                ? "bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 text-indigo-300 hover:text-white hover:bg-indigo-500/30"
                : "bg-white/70 border border-indigo-200 text-indigo-600 hover:text-indigo-700 hover:bg-white/90 shadow-md"
            }`}>
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
          </div>
        </div>

        {/* Progress Section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`backdrop-blur-xl rounded-3xl p-6 sm:p-8 mb-8 sm:mb-10 transition-all ${
          theme === "dark"
            ? "bg-gradient-to-br from-white/10 to-white/5 border border-white/20 hover:border-indigo-400/30"
            : "bg-white/70 border border-white/50 shadow-lg hover:shadow-xl"
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`font-semibold flex items-center gap-2 ${
              theme === "dark" ? "text-slate-100" : "text-slate-800"
            }`}>
              <TrendingUp className={`w-5 h-5 ${
                theme === "dark" ? "text-indigo-400" : "text-indigo-600"
              }`} />
              Progress
            </h2>
            <span className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${
              theme === "dark"
                ? "from-indigo-400 to-pink-400"
                : "from-indigo-600 to-pink-600"
            }`}>{percent}%</span>
          </div>
          <div className={`w-full rounded-full h-4 overflow-hidden border ${
            theme === "dark"
              ? "bg-slate-800/50 border-slate-700/50"
              : "bg-slate-200/50 border-slate-300/50"
          }`}>
            <motion.div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-4 rounded-full shadow-lg" initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 0.8 }} />
          </div>
          <p className={`text-sm mt-3 ${
            theme === "dark" ? "text-slate-400" : "text-slate-600"
          }`}>{completed} of {total} tasks completed</p>
        </motion.div>

        {/* Input Section - Updated with Title + Notes */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4 mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative group">
              <input 
                ref={inputRef} 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                onKeyDown={(e) => e.key === "Enter" && addTask()} 
                placeholder="Add a new task title... (required)" 
                className={`w-full px-5 sm:px-6 py-4 sm:py-5 rounded-2xl focus:ring-2 outline-none transition-all text-base sm:text-lg backdrop-blur-xl ${
                  theme === "dark"
                    ? "bg-white/20 border border-white/30 focus:ring-indigo-400 focus:border-indigo-400 text-slate-100 placeholder-slate-300 group-hover:border-white/40 group-hover:bg-white/25"
                    : "bg-white/80 border border-white/50 focus:ring-indigo-400 focus:border-indigo-400 text-slate-900 placeholder-slate-600 group-hover:bg-white/90 shadow-sm"
                }`} 
                title="Type your task title here (required). Press Enter or click Add to create."
              />
            </div>
            <motion.button 
              onClick={addTask} 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              className="flex-shrink-0 px-6 sm:px-8 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
              title="Add the task (or press Enter in the input)"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Add</span>
            </motion.button>
          </div>

          {/* New: Notes/Description Textarea */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="relative group">
            <textarea 
              ref={notesRef}
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              placeholder="Add optional notes/description..." 
              rows={2}
              className={`w-full px-5 sm:px-6 py-3 rounded-2xl focus:ring-2 outline-none transition-all text-sm sm:text-base backdrop-blur-xl resize-none ${
                theme === "dark"
                  ? "bg-white/20 border border-white/30 focus:ring-purple-400 focus:border-purple-400 text-slate-100 placeholder-slate-300 group-hover:border-white/40"
                  : "bg-white/80 border border-white/50 focus:ring-purple-400 focus:border-purple-400 text-slate-900 placeholder-slate-600 group-hover:bg-white/90 shadow-sm"
              }`} 
              title="Optional notes or detailed description for the task."
            />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="relative group">
            <input 
              type="datetime-local" 
              value={due} 
              onChange={(e) => setDue(e.target.value)} 
              className={`w-full px-5 sm:px-6 py-4 rounded-2xl focus:ring-2 outline-none transition-all text-sm sm:text-base backdrop-blur-xl ${
                theme === "dark"
                  ? "bg-white/20 border border-white/30 focus:ring-purple-400 focus:border-purple-400 text-slate-100 placeholder-slate-300 group-hover:border-white/40"
                  : "bg-white/80 border border-white/50 focus:ring-purple-400 focus:border-purple-400 text-slate-900 placeholder-slate-600 group-hover:bg-white/90 shadow-sm"
              }`} 
              placeholder="Set due date (optional)" 
              title="Optional due date/time for the task. Overdue tasks will be highlighted."
            />
            <Calendar className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${
              theme === "dark" ? "text-slate-400" : "text-slate-600"
            }`} />
          </motion.div>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 flex-wrap">
          {(["all", "active", "completed", "overdue"] as const).map((f) => (
            <motion.button 
              key={f} 
              onClick={() => setFilter(f)} 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              className={`relative px-5 sm:px-8 py-3 rounded-full text-sm sm:text-base font-semibold transition-all ${
                filter === f
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/20 border border-indigo-400/50"
                  : theme === "dark"
                  ? "bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:border-white/20"
                  : "bg-white/60 text-slate-700 border border-white/40 hover:bg-white/80 shadow-sm"
              }`}
              title={`Filter: ${f === "all" ? "Show all tasks" : f === "active" ? "Show pending tasks (not overdue)" : f === "completed" ? "Show completed tasks" : "Show overdue tasks"}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* Tasks List - Updated to show title + description */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="max-h-[55vh] overflow-y-auto space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((t) => (
                <motion.div key={t.id} initial={{ opacity: 0, x: -20, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 20, scale: 0.9 }} transition={{ duration: 0.3 }} layout className={`group relative backdrop-blur-xl border rounded-2xl px-5 sm:px-6 py-5 sm:py-6 transition-all ${
                  isOverdue(t)
                    ? theme === "dark"
                      ? "bg-red-500/10 border-red-400/30 hover:bg-red-500/20 hover:border-red-400/50"
                      : "bg-red-100/60 border-red-300/50 hover:bg-red-100/80 shadow-sm"
                    : theme === "dark"
                    ? "bg-gradient-to-br from-white/10 to-white/5 border-white/20 hover:bg-white/20 hover:border-indigo-400/30"
                    : "bg-white/70 border-white/50 hover:bg-white/80 shadow-sm hover:shadow-md"
                }`}>
                  {isOverdue(t) && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`absolute top-5 right-5 flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border ${
                      theme === "dark"
                        ? "bg-red-500/20 text-red-300 border-red-400/30"
                        : "bg-red-200/60 text-red-700 border-red-400/40"
                    }`}>
                      <Clock size={12} />
                      Overdue
                    </motion.div>
                  )}

                  <div className="flex-1">
                    {editingId === t.id ? (
                      <div className="flex flex-col gap-3 items-start w-full pb-12">
                        <input 
                          ref={editRef} 
                          value={editTitle} 
                          onChange={(e) => setEditTitle(e.target.value)} 
                          onKeyDown={(e) => { if (e.key === "Enter") saveEdit(t.id); if (e.key === "Escape") cancelEdit(); }} 
                          className={`flex-1 px-4 py-3 rounded-xl outline-none focus:ring-2 w-full ${
                            theme === "dark"
                              ? "bg-white/10 border border-white/20 focus:ring-indigo-400 text-slate-100"
                              : "bg-white/80 border border-white/40 focus:ring-indigo-400 text-slate-900 shadow-sm"
                          }`} 
                          title="Edit title (required - Enter to save, Escape to cancel)"
                        />
                        <textarea 
                          value={editNotes} 
                          onChange={(e) => setEditNotes(e.target.value)} 
                          placeholder="Edit notes/description (optional)..." 
                          rows={2}
                          className={`flex-1 px-4 py-3 rounded-xl outline-none focus:ring-2 w-full resize-none text-sm ${
                            theme === "dark"
                              ? "bg-white/10 border border-white/20 focus:ring-purple-400 text-slate-100"
                              : "bg-white/80 border border-white/40 focus:ring-purple-400 text-slate-900 shadow-sm"
                          }`} 
                          title="Edit notes/description (optional)"
                        />
                        <input 
                          type="datetime-local" 
                          value={editDue} 
                          onChange={(e) => setEditDue(e.target.value)} 
                          className={`px-4 py-3 rounded-xl outline-none focus:ring-2 text-sm w-full ${
                            theme === "dark"
                              ? "bg-white/10 border border-white/20 focus:ring-purple-400 text-slate-100"
                              : "bg-white/80 border border-white/40 focus:ring-purple-400 text-slate-900 shadow-sm"
                          }`} 
                          title="Edit due date (optional)"
                        />
                        <div className="flex gap-2 w-full">
                          <motion.button 
                            onClick={() => saveEdit(t.id)} 
                            whileHover={{ scale: 1.1 }} 
                            className={`px-4 py-2 rounded-lg font-semibold text-sm flex-1 ${
                              theme === "dark"
                                ? "bg-green-500/20 text-green-300 border border-green-400/30 hover:bg-green-500/30"
                                : "bg-green-100/80 text-green-700 border border-green-300 hover:bg-green-200"
                            }`}
                            title="Save changes"
                          >
                            Save
                          </motion.button>
                          <motion.button 
                            onClick={cancelEdit} 
                            whileHover={{ scale: 1.1 }} 
                            className={`px-4 py-2 rounded-lg font-semibold text-sm flex-1 ${
                              theme === "dark"
                                ? "bg-slate-600/30 text-slate-300 border border-slate-500/30 hover:bg-slate-600/50"
                                : "bg-slate-200/80 text-slate-700 border border-slate-300 hover:bg-slate-300"
                            }`}
                            title="Cancel edit"
                          >
                            Cancel
                          </motion.button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-4 cursor-pointer" onClick={() => toggle(t.id)} title="Click to toggle completion">
                        <motion.div whileHover={{ scale: 1.2 }} className={`flex-shrink-0 w-6 h-6 rounded-full border-2 mt-1 transition-all ${
                          t.isCompleted
                            ? theme === "dark"
                              ? "border-green-500 bg-green-500/30 shadow-lg shadow-green-500/50"
                              : "border-green-600 bg-green-200/60 shadow-lg shadow-green-500/40"
                            : theme === "dark"
                            ? "border-slate-500 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/30"
                            : "border-slate-400 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-400/30"
                        }`} title={t.isCompleted ? "Completed" : "Mark as complete"} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-base sm:text-lg font-bold break-words ${
                            t.isCompleted
                              ? theme === "dark"
                                ? "line-through text-slate-500"
                                : "line-through text-slate-600"
                              : isOverdue(t)
                              ? theme === "dark"
                                ? "text-red-300"
                                : "text-red-700"
                              : theme === "dark"
                              ? "text-slate-100"
                              : "text-slate-900"
                          }`}>
                            {t.title}
                          </p>
                          {t.description && (
                            <p className={`text-sm italic mt-1 break-words ${
                              t.isCompleted
                                ? theme === "dark"
                                  ? "text-slate-500"
                                  : "text-slate-600"
                                : theme === "dark"
                                ? "text-slate-300"
                                : "text-slate-700"
                            }`}>
                              {t.description}
                            </p>
                          )}
                          {t.dueDate && (
                            <p className={`text-xs sm:text-sm flex items-center gap-2 mt-2 ${
                              theme === "dark" ? "text-slate-400" : "text-slate-600"
                            }`}>
                              <Calendar size={12} />
                              {new Date(t.dueDate).toLocaleDateString()} • {new Date(t.dueDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {!editingId && (
                    <div className={`flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${isOverdue(t) ? "mt-12" : "mt-0"}`}>
                      <motion.button 
                        onClick={(e) => { e.stopPropagation(); startEdit(t); }} 
                        whileHover={{ scale: 1.15 }} 
                        className={`p-2 rounded-lg transition-all ${
                          theme === "dark"
                            ? "text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/20"
                            : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-100/80"
                        }`}
                        title="Edit this task"
                      >
                        <Edit2 size={16} />
                      </motion.button>
                      <motion.button 
                        onClick={(e) => { e.stopPropagation(); del(t.id); }} 
                        whileHover={{ scale: 1.15 }} 
                        className={`p-2 rounded-lg transition-all ${
                          theme === "dark"
                            ? "text-slate-400 hover:text-red-400 hover:bg-red-500/20"
                            : "text-slate-600 hover:text-red-600 hover:bg-red-100/80"
                        }`}
                        title="Delete this task"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className={`text-center py-16 sm:py-20 ${
                theme === "dark" ? "text-slate-300" : "text-slate-700"
              }`}>
                <motion.div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                  <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </motion.div>
                <p className={`text-xl sm:text-2xl font-bold mb-2 ${
                  theme === "dark" ? "text-slate-200" : "text-slate-800"
                }`}>All tasks forged! 🎉</p>
                <p className={`text-sm sm:text-base ${
                  theme === "dark" ? "text-slate-400" : "text-slate-600"
                }`}>Ready to create something new?</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className={`text-center pt-8 mt-8 border-t ${
          theme === "dark"
            ? "border-white/10 text-slate-400"
            : "border-slate-300/40 text-slate-600"
        }`}>
          <p className="text-sm">© 2025 TaskForge. Crafted by <span className="font-semibold text-indigo-400">Manav Rai</span></p>
          <p className="text-xs mt-1 opacity-75">Data saved automatically in localStorage as JSON per task ID. Check browser console for debug logs. If issues persist, use Export/Import for backup.</p>
        </motion.div>
      </motion.div>
    </div>
  );
}