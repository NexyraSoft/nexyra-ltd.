import { useState } from "react";
import { createPortal } from "react-dom";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { adminService, Project, Client } from "@/lib/admin";

interface ProjectsCRUDProps {
  projects: Project[];
  clients: Client[];
  onRefresh: () => void;
}

export const ProjectsCRUD = ({ projects, clients, onRefresh }: ProjectsCRUDProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    client: "",
    status: "Pending",
    deadline: "",
    budget: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpenNew = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", client: "", status: "Pending", deadline: "", budget: "" });
    setIsOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingId(project._id);
    setFormData({
      title: project.title,
      description: project.description || "",
      client: project.client?._id || "",
      status: project.status || "Pending",
      deadline: project.deadline ? project.deadline.split("T")[0] : "",
      budget: project.budget ? String(project.budget) : "",
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
        client: formData.client || undefined,
        status: formData.status,
        deadline: formData.deadline || undefined,
        budget: formData.budget ? Number(formData.budget) : undefined,
      };
      if (editingId) {
        await adminService.updateProject(editingId, payload);
      } else {
        await adminService.createProject(payload);
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
      await adminService.deleteProject(id);
      onRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <section className="rounded-[2rem] border border-white/20 bg-white/70 backdrop-blur-xl p-8 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-bold text-slate-950">Projects</h2>
        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 rounded-xl bg-maroon-800 px-4 py-2 text-white font-semibold hover:bg-maroon-900 transition-all text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-auto">
        {projects.map((project) => (
          <div key={project._id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow">
            <div className="flex-1">
              <p className="font-semibold text-slate-900">{project.title}</p>
              <p className="text-sm text-slate-600">{project.client?.name || "No client"}</p>
              {project.description && <p className="text-xs text-slate-500 line-clamp-1">{project.description}</p>}
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${project.status === "Completed" ? "bg-green-100 text-green-700" : project.status === "Running" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}>
              {project.status || "Pending"}
            </span>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => handleEdit(project)}
                className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(project._id)}
                className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {projects.length === 0 && <p className="text-sm text-slate-500 py-4">No projects yet.</p>}
      </div>

      {isOpen && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col" style={{ maxHeight: 'calc(100vh - 2rem)' }}>
            <div className="p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-slate-900">{editingId ? "Edit Project" : "Add New Project"}</h3>
            </div>
            
            {error && <p className="px-6 pt-4 text-sm text-red-600">{error}</p>}
            
            <form id="project-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
              <input
                type="text"
                placeholder="Title *"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800"
              />
              <select
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800"
              >
                <option value="">Select Client</option>
                {clients.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800 resize-none"
                rows={3}
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800"
              >
                <option value="Pending">Pending</option>
                <option value="Running">Running</option>
                <option value="Completed">Completed</option>
              </select>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800"
              />
              <input
                type="number"
                placeholder="Budget"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
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
                form="project-form"
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
