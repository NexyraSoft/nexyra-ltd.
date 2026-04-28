import { useState } from "react";
import { createPortal } from "react-dom";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { adminService, Task, Project } from "@/lib/admin";

interface TasksCRUDProps {
  tasks: Task[];
  projects: Project[];
  onRefresh: () => void;
}

export const TasksCRUD = ({ tasks, projects, onRefresh }: TasksCRUDProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Pending",
    priority: "Medium",
    relatedProject: "",
    dueDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpenNew = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", status: "Pending", priority: "Medium", relatedProject: "", dueDate: "" });
    setIsOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditingId(task._id);
    setFormData({
      title: task.title,
      description: task.description || "",
      status: task.status || "Pending",
      priority: task.priority || "Medium",
      relatedProject: task.relatedProject?._id || "",
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
    });
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload: any = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        relatedProject: formData.relatedProject || undefined,
        dueDate: formData.dueDate || undefined,
      };
      if (editingId) {
        await adminService.updateTask(editingId, payload);
      } else {
        await adminService.createTask(payload);
      }
      setIsOpen(false);
      onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await adminService.deleteTask(id);
      onRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const getPriorityColor = (priority?: string) => {
    if (priority === "High") return "bg-red-100 text-red-700";
    if (priority === "Low") return "bg-blue-100 text-blue-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <section className="rounded-[2rem] border border-white/20 bg-white/70 backdrop-blur-xl p-8 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-bold text-slate-950">Tasks</h2>
        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 rounded-xl bg-maroon-800 px-4 py-2 text-white font-semibold hover:bg-maroon-900 transition-all text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-auto">
        {tasks.map((task) => (
          <div key={task._id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow">
            <div className="flex-1">
              <p className="font-semibold text-slate-900">{task.title}</p>
              <p className="text-sm text-slate-600">{task.relatedProject?.title || "No project"}</p>
              {task.description && <p className="text-xs text-slate-500 line-clamp-1">{task.description}</p>}
            </div>
            <div className="flex gap-2 items-center">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                {task.priority || "Medium"}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${task.status === "Completed" ? "bg-green-100 text-green-700" : task.status === "In Progress" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}>
                {task.status || "Pending"}
              </span>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => handleEdit(task)}
                className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(task._id)}
                className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {tasks.length === 0 && <p className="text-sm text-slate-500 py-4">No tasks yet.</p>}
      </div>

      {isOpen && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 pointer-events-none">
          <div className="pointer-events-auto relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden" style={{ maxHeight: '85vh' }}>
            <div className="p-6 border-b border-slate-200 flex-shrink-0">
              <h3 className="text-xl font-bold text-slate-900">{editingId ? "Edit Task" : "Add New Task"}</h3>
            </div>
            
            {error && <p className="px-6 pt-4 text-sm text-red-600">{error}</p>}
            
            <form id="task-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
              <div className="space-y-4">
              <input
                type="text"
                placeholder="Title *"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800 resize-none"
                rows={3}
              />
              <select
                value={formData.relatedProject}
                onChange={(e) => setFormData({ ...formData, relatedProject: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800"
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
              </select>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800"
              />
              </div>
            </form>
            
            <div className="border-t border-slate-200 p-6 flex-shrink-0 bg-slate-50 flex gap-3 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-slate-900 font-semibold hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="task-form"
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg bg-maroon-800 text-white font-semibold hover:bg-maroon-900 transition-colors disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};
