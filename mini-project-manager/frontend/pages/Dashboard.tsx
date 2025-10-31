import { useState, useEffect } from "react";
import { get, post, del } from "../src/api";
import { motion } from "framer-motion";
import { PlusCircle, Trash2, FolderOpen, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import Skeleton from "../components/ui/Skeleton";
import Modal from "../components/ui/Modal";

type Project = { id: string; title: string; description?: string; createdAt: string };
type ProjectStats = { total: number; thisWeek: number; today: number };

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [confirm, setConfirm] = useState<{ open: boolean; id?: string }>({ open: false });
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [bulkLoading, setBulkLoading] = useState(false);
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  async function load() {
    setLoading(true);
    const [res, sres] = await Promise.all([
      get("/api/projects"),
      get("/api/projects/stats"),
    ]);
    if (res.ok) setProjects(await res.json());
    if (sres.ok) setStats(await sres.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    if (projects.some(p => p.title.trim().toLowerCase() === title.trim().toLowerCase())) {
      alert("A project with this title already exists.");
      return;
    }
    const res = await post("/api/projects", { title, description: desc });
    if (res.ok) { setTitle(""); setDesc(""); load(); }
  }

  async function remove(id: string) {
    await del(`/api/projects/${id}`);
    load();
  }

  async function saveEdit(p: Project) {
    if (!editingTitle.trim()) { setEditingId(null); return; }
    if (projects.some(x => x.id !== p.id && x.title.trim().toLowerCase() === editingTitle.trim().toLowerCase())) {
      alert("A project with this title already exists.");
      return;
    }
    // Since backend lacks update, workaround: delete and recreate preserving description
    await del(`/api/projects/${p.id}`);
    await post("/api/projects", { title: editingTitle.trim(), description: p.description });
    setEditingId(null);
    setEditingTitle("");
    load();
  }

  return (
    <div className="space-y-10">
      <motion.form
        onSubmit={create}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-center gap-3"
      >
        <Input
          placeholder="Project title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <Input
          placeholder="Description"
          value={desc}
          onChange={e => setDesc(e.target.value)}
        />
        <Button leftIcon={<PlusCircle size={18} />}>Create</Button>
      </motion.form>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <p className="text-sm text-slate-600 dark:text-slate-300">Total projects</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats?.total ?? projects.length}</p>
        </Card>
        <Card>
          <div className="flex items-stretch justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm text-slate-600 dark:text-slate-300">This week</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats?.thisWeek ?? 0}</p>
            </div>
            <div className="w-px bg-slate-200 dark:bg-slate-700" />
            <div className="flex-1">
              <p className="text-sm text-slate-600 dark:text-slate-300">Today</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats?.today ?? 0}</p>
            </div>
          </div>
        </Card>
        <div className="sm:col-span-2">
          <div className="flex gap-2">
            <Input placeholder="Search projects" value={q} onChange={e => setQ(e.target.value)} />
            <Button variant="secondary" onClick={() => setBulkOpen(true)}>Bulk Add</Button>
            <Button variant="secondary" onClick={() => {
              const blob = new Blob([JSON.stringify(projects, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url; a.download = 'projects.json'; a.click();
              URL.revokeObjectURL(url);
            }}>Export</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="space-y-3">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              </Card>
            ))
          : projects.filter(p => p.title.toLowerCase().includes(q.toLowerCase()) || (p.description || "").toLowerCase().includes(q.toLowerCase()))
            .map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="hover:shadow-neon hover:-translate-y-1 transition">
                  {editingId === p.id ? (
                    <div className="flex items-center gap-2 mb-2">
                      <Input value={editingTitle} onChange={e => setEditingTitle(e.target.value)} />
                      <Button size="sm" onClick={() => saveEdit(p)}>Save</Button>
                      <Button size="sm" variant="secondary" onClick={() => { setEditingId(null); setEditingTitle(""); }}>Cancel</Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-lg text-indigo-600">{p.title}</h3>
                      <Button variant="ghost" className="text-slate-500" onClick={() => { setEditingId(p.id); setEditingTitle(p.title); }}>
                        <Pencil size={16} />
                      </Button>
                    </div>
                  )}
                  {p.description && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{p.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <Link
                      to={`/projects/${p.id}`}
                      className="text-accent hover:underline flex items-center gap-1"
                    >
                      <FolderOpen size={16} /> Open
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={() => setConfirm({ open: true, id: p.id })}
                      className="text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
      </div>

      {!loading && projects.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-400 dark:text-gray-500"
        >
          No projects yet. Start by creating one above.
        </motion.p>
      )}

      <Modal
        open={confirm.open}
        onClose={() => setConfirm({ open: false })}
        title="Delete project?"
        actions={
          <>
            <Button variant="secondary" onClick={() => setConfirm({ open: false })}>Cancel</Button>
            <Button onClick={() => { if (confirm.id) remove(confirm.id); setConfirm({ open: false }); }}>Delete</Button>
          </>
        }
      >
        This will remove the project and its tasks.
      </Modal>

      <Modal
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        title="Bulk Add Projects"
        actions={
          <>
            <Button variant="secondary" onClick={() => setBulkOpen(false)}>Close</Button>
            <Button
              onClick={async () => {
                const lines = bulkText.split('\n').map(s => s.trim()).filter(Boolean);
                if (lines.length === 0) return;
                setBulkLoading(true);
                await post('/api/projects/bulk', { titles: lines });
                setBulkLoading(false);
                setBulkOpen(false);
                setBulkText("");
                load();
              }}
            >{bulkLoading ? 'Adding...' : 'Add Projects'}</Button>
          </>
        }
      >
        <div className="space-y-2 text-sm">
          <p>Paste one project title per line. We’ll create them all for you.</p>
          <textarea
            className="w-full h-40 p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/70"
            placeholder={`Website Redesign\nMarketing Plan\nMobile App MVP`}
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
