import { useState } from "react";
import { createPortal } from "react-dom";
import { Briefcase, Edit2, Plus, Trash2 } from "lucide-react";
import { adminService, EmploymentType, Vacancy, VacancyCategory, VacancyStatus } from "@/lib/admin";

interface VacanciesCRUDProps {
  vacancies: Vacancy[];
  onRefresh: () => void;
}

const categoryOptions: VacancyCategory[] = ["Development", "Design", "Management"];
const employmentTypeOptions: EmploymentType[] = ["Full-time", "Part-time", "Contract", "Internship"];
const statusOptions: VacancyStatus[] = ["Active", "Inactive"];

export const VacanciesCRUD = ({ vacancies, onRefresh }: VacanciesCRUDProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    description: "",
    category: "Development" as VacancyCategory,
    location: "",
    employmentType: "" as EmploymentType | "",
    status: "Active" as VacancyStatus,
  });

  const resetForm = () => {
    setEditingId(null);
    setError("");
    setFormData({
      title: "",
      summary: "",
      description: "",
      category: "Development",
      location: "",
      employmentType: "",
      status: "Active",
    });
  };

  const handleOpenNew = () => {
    resetForm();
    setIsOpen(true);
  };

  const handleEdit = (vacancy: Vacancy) => {
    setEditingId(vacancy._id);
    setError("");
    setFormData({
      title: vacancy.title,
      summary: vacancy.summary,
      description: vacancy.description,
      category: vacancy.category,
      location: vacancy.location || "",
      employmentType: vacancy.employmentType || "",
      status: vacancy.status,
    });
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      title: formData.title,
      summary: formData.summary,
      description: formData.description,
      category: formData.category,
      location: formData.location || undefined,
      employmentType: formData.employmentType || undefined,
      status: formData.status,
    };

    try {
      if (editingId) {
        await adminService.updateVacancy(editingId, payload);
      } else {
        await adminService.createVacancy(payload);
      }
      setIsOpen(false);
      resetForm();
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
      await adminService.deleteVacancy(id);
      onRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <section className="rounded-[2rem] border border-white/20 bg-white/70 backdrop-blur-xl p-8 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-maroon-900 text-white">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-slate-950">Vacancies</h2>
            <p className="text-sm text-slate-500">Manage which jobs are visible on the public careers page.</p>
          </div>
        </div>
        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 rounded-xl bg-maroon-800 px-4 py-2 text-white font-semibold hover:bg-maroon-900 transition-all text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Vacancy
        </button>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-auto">
        {vacancies.map((vacancy) => (
          <div key={vacancy._id} className="rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <p className="font-semibold text-slate-900">{vacancy.title}</p>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {vacancy.category}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      vacancy.status === "Active" ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {vacancy.status}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{vacancy.summary}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                  {vacancy.location ? <span>{vacancy.location}</span> : null}
                  {vacancy.employmentType ? <span>{vacancy.employmentType}</span> : null}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(vacancy)}
                  className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(vacancy._id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {vacancies.length === 0 ? <p className="text-sm text-slate-500 py-4">No vacancies yet.</p> : null}
      </div>

      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 pointer-events-none">
            <div className="pointer-events-auto relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden" style={{ maxHeight: "85vh" }}>
              <div className="p-6 border-b border-slate-200 flex-shrink-0">
                <h3 className="text-xl font-bold text-slate-900">{editingId ? "Edit Vacancy" : "Add New Vacancy"}</h3>
              </div>

              {error ? <p className="px-6 pt-4 text-sm text-red-600">{error}</p> : null}

              <form id="vacancy-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Title *"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                  <input
                    type="text"
                    placeholder="Summary *"
                    required
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                  <textarea
                    placeholder="Description *"
                    required
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800 resize-none"
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as VacancyCategory })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800"
                    >
                      {categoryOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <select
                      value={formData.employmentType}
                      onChange={(e) => setFormData({ ...formData, employmentType: e.target.value as EmploymentType | "" })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800"
                    >
                      <option value="">Employment Type</option>
                      {employmentTypeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      type="text"
                      placeholder="Location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800"
                    />
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as VacancyStatus })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800"
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
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
                  form="vacancy-form"
                  disabled={loading}
                  className="flex-1 px-4 py-2 rounded-lg bg-maroon-800 text-white font-semibold hover:bg-maroon-900 transition-colors disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
};
