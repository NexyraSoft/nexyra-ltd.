import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { authService } from "@/lib/auth";

interface ChangePasswordCardProps {
  userName?: string;
}

export const ChangePasswordCard = ({ userName }: ChangePasswordCardProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const resetForm = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirmation must match.");
      setLoading(false);
      return;
    }

    try {
      const response = await authService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      resetForm();
      setSuccess(`${response.message} Please sign in again.`);
      setIsOpen(false);
      await authService.logout().catch(() => undefined);
      authService.clearToken();
      navigate("/admin/login", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="rounded-[2rem] border border-white/20 bg-white/70 backdrop-blur-xl p-8 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-maroon-800 font-bold mb-3">Account Security</p>
            <h2 className="text-2xl font-display font-bold text-slate-950">Change Password</h2>
            <p className="text-slate-600 mt-2">
              {userName ? `${userName}, update your admin password here.` : "Update your account password here."}
            </p>
            {success ? <p className="mt-4 text-sm text-green-700">{success}</p> : null}
          </div>
          <button
            onClick={() => {
              resetForm();
              setSuccess("");
              setIsOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-white font-semibold hover:bg-slate-800 transition-all text-sm"
          >
            <KeyRound className="w-4 h-4" />
            Change Password
          </button>
        </div>
      </section>

      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 pointer-events-none">
            <div className="pointer-events-auto relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex-shrink-0">
                <h3 className="text-xl font-bold text-slate-900">Change Password</h3>
              </div>

              {error ? <p className="px-6 pt-4 text-sm text-red-600">{error}</p> : null}

              <form id="change-password-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
                <div className="space-y-4">
                  <input
                    type="password"
                    placeholder="Current password *"
                    required
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                  <input
                    type="password"
                    placeholder="New password *"
                    required
                    minLength={6}
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                  <input
                    type="password"
                    placeholder="Confirm new password *"
                    required
                    minLength={6}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
                  form="change-password-form"
                  disabled={loading}
                  className="flex-1 px-4 py-2 rounded-lg bg-maroon-800 text-white font-semibold hover:bg-maroon-900 transition-colors disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};
