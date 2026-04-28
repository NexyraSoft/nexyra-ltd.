import { useState } from "react";
import { createPortal } from "react-dom";
import { Plus, ShieldCheck, Trash2, UserCog } from "lucide-react";
import { adminService, DashboardUser, UserRole } from "@/lib/admin";

interface UsersCRUDProps {
  users: DashboardUser[];
  onRefresh: () => void;
  currentUserId?: string;
}

const roleBadgeStyles: Record<UserRole, string> = {
  admin: "bg-maroon-100 text-maroon-800",
  editor: "bg-blue-100 text-blue-700",
};

export const UsersCRUD = ({ users, onRefresh, currentUserId }: UsersCRUDProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "editor" as UserRole,
  });

  const resetForm = () => {
    setError("");
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "editor",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await adminService.createUser(formData);
      setIsOpen(false);
      resetForm();
      onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create user.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (id === currentUserId) {
      alert("You cannot delete your own account.");
      return;
    }

    if (!confirm("Remove this user?")) return;

    try {
      await adminService.deleteUser(id);
      onRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unable to remove user.");
    }
  };

  return (
    <section className="rounded-[2rem] border border-white/20 bg-white/70 backdrop-blur-xl p-8 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <UserCog className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-slate-950">Users</h2>
            <p className="text-sm text-slate-500">Create and review admin and editor accounts.</p>
          </div>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-white font-semibold hover:bg-slate-800 transition-all text-sm"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <div className="space-y-3 max-h-[420px] overflow-auto">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow">
            <div>
              <p className="font-semibold text-slate-900">{user.name}</p>
              <p className="text-sm text-slate-600">{user.email}</p>
              <p className="text-xs text-slate-500 mt-1">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently created"}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${roleBadgeStyles[user.role]}`}>
                <ShieldCheck className="h-3.5 w-3.5" />
                {user.role}
              </span>
              <button
                onClick={() => handleDelete(user.id)}
                disabled={user.id === currentUserId}
                className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                title={user.id === currentUserId ? "You cannot delete your own account" : "Remove user"}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {users.length === 0 ? <p className="text-sm text-slate-500 py-4">No users found.</p> : null}
      </div>

      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 pointer-events-none">
            <div className="pointer-events-auto relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex-shrink-0">
                <h3 className="text-xl font-bold text-slate-900">Create User</h3>
              </div>

              {error ? <p className="px-6 pt-4 text-sm text-red-600">{error}</p> : null}

              <form id="user-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
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
                    type="password"
                    placeholder="Password *"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  >
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
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
                  form="user-form"
                  disabled={loading}
                  className="flex-1 px-4 py-2 rounded-lg bg-maroon-800 text-white font-semibold hover:bg-maroon-900 transition-colors disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create User"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
};
