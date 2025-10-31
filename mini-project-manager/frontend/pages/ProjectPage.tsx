import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { get, post, put, del } from "../src/api";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Trash2, ArrowLeft, Plus, Filter, Search, Sparkles, Pencil, X, Check } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";

type Task = { id: string; projectId: string; title: string; dueDate?: string; completed: boolean };
type ProjectDetails = { id: string; title: string; description?: string; createdAt: string; tasks: Task[] };

export default function ProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [sort, setSort] = useState<"created" | "due">("created");
  const [confirm, setConfirm] = useState<{ open: boolean; task?: Task }>({ open: false });
  const [schedulerOpen, setSchedulerOpen] = useState(false);
  // kept for future extension; not used when auto-generating from current tasks
  const [scheduleResult, setScheduleResult] = useState<string[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDue, setEditingDue] = useState<string>("");

  async function load() {
    if (!id) return;
    const res = await get(`/api/projects/${id}`);
    if (res.ok) setProject(await res.json());
  }

  useEffect(() => {
    load();
  }, [id]);

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title) return setErr("Task title required");
    const res = await post(`/api/projects/${id}/tasks`, { title, dueDate: due || null });
    if (res.ok) {
      setTitle("");
      setDue("");
      setErr("");
      load();
    } else setErr(await res.text());
  }

  async function toggle(t: Task) {
    const res = await put(`/api/tasks/${t.id}`, { completed: !t.completed });
    if (res.ok) load();
  }

  async function remove(t: Task) {
    const res = await del(`/api/tasks/${t.id}`);
    if (res.ok || res.status === 204) load();
  }

  function beginEdit(t: Task) {
    setEditingId(t.id);
    setEditingTitle(t.title);
    setEditingDue(t.dueDate ? t.dueDate.substring(0, 10) : "");
  }

  async function saveEdit() {
    if (!editingId) return;
    const body: any = { title: editingTitle };
    if (editingDue) body.dueDate = editingDue;
    const res = await put(`/api/tasks/${editingId}`, body);
    if (res.ok) {
      setEditingId(null);
      setEditingTitle("");
      setEditingDue("");
      load();
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <Link
        to="/dashboard"
        className="text-indigo-600 hover:text-indigo-700 flex items-center gap-2 font-semibold transition-colors inline-block"
      >
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>

      {project && (
        <div className="space-y-6">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">{project.title}</h2>
            {project.description && <p className="text-gray-600 text-lg">{project.description}</p>}
            <p className="text-gray-400 text-sm mt-2">
              Created on {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Progress */}
          <Card className="flex flex-col gap-2">
            {(() => {
              const total = project.tasks.length;
              const done = project.tasks.filter(t => t.completed).length;
              const percent = total ? Math.round((done / total) * 100) : 0;
              return (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-600">Progress</p>
                    <p className="text-sm font-semibold text-slate-800">{done}/{total} ({percent}%)</p>
                  </div>
                  <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600" style={{ width: `${percent}%` }} />
                  </div>
                </>
              );
            })()}
          </Card>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="flex flex-col sm:flex-row gap-3">
              <form onSubmit={addTask} className="w-full flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Input
                  type="date"
                  value={due}
                  onChange={(e) => setDue(e.target.value)}
                />
                <Button type="submit" leftIcon={<Plus size={18} />}>Add Task</Button>
                <Button type="button" variant="primary" className="btn-glow btn-pulse hover:scale-[1.03]" leftIcon={<Sparkles size={18} />} onClick={() => {
                  // prefill from current tasks only
                  if (!project) { setSchedulerOpen(true); return; }
                  setSchedulerOpen(true);
                }}>Smart Schedule</Button>
              </form>
            </Card>
          </motion.div>

          {err && <div className="text-red-500 text-sm bg-red-50 p-4 rounded-xl border border-red-200">{err}</div>}

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2">
              <Button variant={filter === "all" ? "primary" : "secondary"} size="sm" onClick={() => setFilter("all")}>All</Button>
              <Button variant={filter === "active" ? "primary" : "secondary"} size="sm" onClick={() => setFilter("active")}>Active</Button>
              <Button variant={filter === "completed" ? "primary" : "secondary"} size="sm" onClick={() => setFilter("completed")}>Completed</Button>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Button variant="secondary" size="sm" onClick={() => setSort(sort === "created" ? "due" : "created")} leftIcon={<Filter size={16} />}>
                Sort: {sort === "created" ? "Created" : "Due date"}
              </Button>
              <div className="w-64">
                <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search tasks" leftIcon={<Search size={16} />} />
              </div>
            </div>
          </div>

          <ul className="space-y-3">
            {project.tasks.length === 0 ? (
              <p className="text-gray-400 text-center py-12">No tasks yet. Create your first task!</p>
            ) : (
              project.tasks
                .map((t, i) => ({ t, i }))
                .filter(t => {
                  if (filter === "active") return !t.t.completed;
                  if (filter === "completed") return t.t.completed;
                  return true;
                })
                .filter(x => x.t.title.toLowerCase().includes(q.toLowerCase()))
                .sort((a, b) => {
                  if (sort === "due") {
                    const ad = a.t.dueDate ? new Date(a.t.dueDate).getTime() : Infinity;
                    const bd = b.t.dueDate ? new Date(b.t.dueDate).getTime() : Infinity;
                    return ad - bd;
                  }
                  // created order fallback by original index
                  return a.i - b.i;
                })
                .map(({ t }, i) => (
                <motion.li
                  key={t.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`flex justify-between items-center border-2 rounded-xl p-4 transition-all ${
                    t.completed
                      ? "bg-green-50 border-green-200"
                      : "bg-white border-purple-100 hover:border-indigo-300"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggle(t)}
                      className={`p-2 rounded-lg transition-all ${
                        t.completed
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400 hover:bg-indigo-100 hover:text-indigo-600"
                      }`}
                    >
                      <CheckCircle2 size={20} />
                    </motion.button>
                    <div className="flex-1">
                      {editingId === t.id ? (
                        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                          <input
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            className="flex-1 px-3 py-2 rounded-lg border border-slate-200"
                          />
                          <input
                            type="date"
                            value={editingDue}
                            onChange={(e) => setEditingDue(e.target.value)}
                            className="px-3 py-2 rounded-lg border border-slate-200"
                          />
                          <div className="flex items-center gap-2">
                            <button onClick={saveEdit} className="px-3 py-2 rounded-lg bg-green-600 text-white inline-flex items-center gap-1"><Check size={16}/>Save</button>
                            <button onClick={() => setEditingId(null)} className="px-3 py-2 rounded-lg bg-slate-200 inline-flex items-center gap-1"><X size={16}/>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p
                            className={`font-semibold ${
                              t.completed
                                ? "line-through text-gray-400"
                                : "text-gray-800"
                            }`}
                          >
                            {t.title}
                          </p>
                          {t.dueDate && (
                            <div className="mt-1">
                              {(() => {
                                const dueTs = new Date(t.dueDate!).getTime();
                                const now = Date.now();
                                const overdue = !t.completed && dueTs < now;
                                const soon = !t.completed && dueTs - now < 1000 * 60 * 60 * 24 * 2; // 48h
                                return (
                                  <Badge variant={overdue ? "warning" : soon ? "info" : "neutral"}>
                                    {overdue ? "Overdue" : soon ? "Due soon" : "Due"} {new Date(t.dueDate).toLocaleDateString()}
                                  </Badge>
                                );
                              })()}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {editingId !== t.id && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => beginEdit(t)}
                        className="text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        <Pencil size={18} />
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setConfirm({ open: true, task: t })}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={20} />
                    </motion.button>
                  </div>
                </motion.li>
              ))
            )}
          </ul>

          <Modal
            open={confirm.open}
            onClose={() => setConfirm({ open: false })}
            title="Delete task?"
            actions={
              <>
                <Button variant="secondary" onClick={() => setConfirm({ open: false })}>Cancel</Button>
                <Button
                  onClick={() => {
                    if (confirm.task) remove(confirm.task);
                    setConfirm({ open: false });
                  }}
                >
                  Delete
                </Button>
              </>
            }
          >
            This action cannot be undone.
          </Modal>

          <Modal
            open={schedulerOpen}
            onClose={() => setSchedulerOpen(false)}
            title="Smart Scheduler"
            actions={
              <>
                <Button variant="secondary" onClick={() => setSchedulerOpen(false)}>Close</Button>
                <Button onClick={async () => {
                  if (!id) return;
                  setScheduleError("");
                  setScheduleLoading(true);
                  setScheduleResult([]);
                  try {
                    // Always generate from current tasks to avoid manual errors
                    if (!project || project.tasks.length === 0) { throw new Error("No tasks to schedule"); }
                    const parsed = {
                      tasks: project.tasks.map(t => ({
                        title: t.title,
                        estimatedHours: 2,
                        dueDate: t.dueDate || undefined,
                        dependencies: [] as string[],
                      }))
                    };
                    const res = await post(`/api/v1/projects/${id}/schedule`, parsed);
                    if (!res.ok) {
                      const text = await res.text();
                      throw new Error(text || `Request failed (${res.status})`);
                    }
                    const data = await res.json();
                    setScheduleResult(data.recommendedOrder || []);
                  } catch (e: any) {
                    setScheduleError(e?.message || 'Something went wrong');
                  } finally {
                    setScheduleLoading(false);
                  }
                }}>{scheduleLoading ? 'Planning...' : 'Get Plan'}</Button>
              </>
            }
          >
            <div className="space-y-4 text-sm">
              <p className="flex items-center gap-2"><Sparkles className="text-indigo-600" size={18} /> The Smart Scheduler will generate a plan using your current tasks.</p>
              <AnimatePresence mode="wait">
                {scheduleLoading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="rounded-xl border border-indigo-200 bg-indigo-50 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="w-5 h-5 rounded-full border-2 border-indigo-600 border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      />
                      <span className="text-indigo-700 font-medium">Planning your optimal order…</span>
                    </div>
                    <div className="mt-3 h-2 bg-white rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                        initial={{ width: '10%' }}
                        animate={{ width: ['15%','40%','65%','85%'] }}
                        transition={{ duration: 2.2, repeat: Infinity, repeatType: 'mirror' }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {scheduleError && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">{scheduleError}</motion.div>
              )}

              <AnimatePresence>
                {scheduleResult.length > 0 && !scheduleLoading && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    <p className="font-semibold mb-2">Recommended order:</p>
                    <motion.ol
                      className="list-decimal pl-5 space-y-1"
                      initial="hidden"
                      animate="show"
                      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
                    >
                      {scheduleResult.map((s, i) => (
                        <motion.li
                          key={i}
                          className="bg-white/70 dark:bg-slate-800/60 border border-indigo-100 dark:border-slate-700 rounded-lg px-3 py-2"
                          variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
                        >
                          {s}
                        </motion.li>
                      ))}
                    </motion.ol>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Modal>
        </div>
      )}
    </motion.div>
  );
}