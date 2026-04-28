import { useState } from "react";
import { createPortal } from "react-dom";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { adminService, Lead } from "@/lib/admin";

interface LeadsCRUDProps {
  leads: Lead[];
  onRefresh: () => void;
}

export const LeadsCRUD = ({ leads, onRefresh }: LeadsCRUDProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceName: "",
    budget: "",
    message: "",
    status: "New",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpenNew = () => {
    setEditingId(null);
    setFormData({ name: "", email: "", phone: "", serviceName: "", budget: "", message: "", status: "New" });
    setIsOpen(true);
  };

  const handleEdit = (lead: Lead) => {
    setEditingId(lead._id);
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || "",
      serviceName: lead.serviceName || "",
      budget: lead.budget || "",
      message: lead.message || "",
      status: lead.status || "New",
    });
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (editingId) {
        await adminService.updateLead(editingId, formData);
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
      await adminService.deleteLead(id);
      onRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <section className="rounded-[2rem] border border-white/20 bg-white/70 backdrop-blur-xl p-8 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-bold text-slate-950">Leads</h2>
        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 rounded-xl bg-maroon-800 px-4 py-2 text-white font-semibold hover:bg-maroon-900 transition-all text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Lead
        </button>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-auto">
        {leads.map((lead) => (
          <div key={lead._id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow">
            <div className="flex-1">
              <p className="font-semibold text-slate-900">{lead.name}</p>
              <p className="text-sm text-slate-600">{lead.email}</p>
              {lead.serviceName && <p className="text-xs text-maroon-800 font-semibold mt-1">{lead.serviceName}</p>}
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${lead.status === "Converted" ? "bg-green-100 text-green-700" : lead.status === "Contacted" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>
              {lead.status || "New"}
            </span>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => handleEdit(lead)}
                className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(lead._id)}
                className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {leads.length === 0 && <p className="text-sm text-slate-500 py-4">No leads yet.</p>}
      </div>

      {isOpen && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 pointer-events-none">
          <div className="pointer-events-auto relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden" style={{ maxHeight: '85vh' }}>
            <div className="p-6 border-b border-slate-200 flex-shrink-0">
              <h3 className="text-xl font-bold text-slate-900">{editingId ? "Edit Lead" : "Add New Lead"}</h3>
            </div>
            
            {error && <p className="px-6 pt-4 text-sm text-red-600">{error}</p>}
            
            <form id="lead-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
              <div className="space-y-4">
              <input
                type="text"
                placeholder="Name *"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800"
              />
              <input
                type="email"
                placeholder="Email *"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800"
              />
              <input
                type="text"
                placeholder="Service Name"
                value={formData.serviceName}
                onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800"
              />
              <input
                type="text"
                placeholder="Budget"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800"
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Converted">Converted</option>
              </select>
              <textarea
                placeholder="Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800 resize-none"
                rows={3}
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
                form="lead-form"
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
