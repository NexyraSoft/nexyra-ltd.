import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, FolderKanban, LogOut, Users, CheckSquare, MailOpen, RefreshCw, UserCog } from "lucide-react";
import { adminService, Client, DashboardUser, Lead, Project, Task, Vacancy } from "../../lib/admin";
import { authService } from "../../lib/auth";
import { formService } from "../../lib/forms";
import { ClientsCRUD } from "../../components/admin/ClientsCRUD";
import { ProjectsCRUD } from "../../components/admin/ProjectsCRUD";
import { LeadsCRUD } from "../../components/admin/LeadsCRUD";
import { TasksCRUD } from "../../components/admin/TasksCRUD";
import { VacanciesCRUD } from "../../components/admin/VacanciesCRUD";
import { UsersCRUD } from "../../components/admin/UsersCRUD";
import { ChangePasswordCard } from "../../components/admin/ChangePasswordCard";

type Contact = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt?: string;
};

type DashboardSummary = {
  message: string;
  stats: {
    contactCount: number;
    leadCount: number;
  };
  recentContacts: Contact[];
  recentLeads: Lead[];
};

type AdminData = {
  clients: Client[];
  projects: Project[];
  leads: Lead[];
  tasks: Task[];
  vacancies: Vacancy[];
  users: DashboardUser[];
  contacts: Contact[];
  summary: DashboardSummary | null;
};

type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role?: "admin" | "editor";
};

const StatCard = ({ title, value, icon: Icon }: { title: string; value: number; icon: typeof Users }) => (
  <div className="rounded-[2rem] border border-white/20 bg-white/70 backdrop-blur-xl p-6 shadow-xl">
    <div className="flex items-center justify-between mb-4">
      <p className="text-sm text-slate-500">{title}</p>
      <div className="w-11 h-11 rounded-2xl bg-maroon-900 text-white flex items-center justify-center">
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <p className="text-4xl font-display font-bold text-slate-950">{value}</p>
  </div>
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<AdminData>({
    clients: [],
    projects: [],
    leads: [],
    tasks: [],
    vacancies: [],
    users: [],
    contacts: [],
    summary: null,
  });
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async (role: CurrentUser["role"]) => {
    try {
      if (role === "editor") {
        const vacancies = await adminService.getVacancies();
        setData({
          summary: null,
          contacts: [],
          clients: [],
          projects: [],
          leads: [],
          tasks: [],
          vacancies,
          users: [],
        });
        return;
      }

      const [summary, contactsResponse, clients, projects, leads, tasks, vacancies, users] = await Promise.all([
        formService.getDashboard(authService.getToken() || undefined),
        formService.getContacts(authService.getToken() || undefined),
        adminService.getClients(),
        adminService.getProjects(),
        adminService.getLeads(),
        adminService.getTasks(),
        adminService.getVacancies(),
        adminService.getUsers(),
      ]);

      setData({
        summary,
        contacts: contactsResponse.contacts,
        clients,
        projects,
        leads,
        tasks,
        vacancies,
        users,
      });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load admin data.");
    }
  };

  useEffect(() => {
    const loadAdmin = async () => {
      try {
        const me = await authService.me(authService.getToken() || undefined);
        if (!me.user.role || !["admin", "editor"].includes(me.user.role)) {
          authService.clearToken();
          navigate("/admin/login", { replace: true });
          return;
        }

        setCurrentUser(me.user);
        await loadData(me.user.role);
      } catch (loadError) {
        authService.clearToken();
        setError(loadError instanceof Error ? loadError.message : "Unable to load admin dashboard.");
        navigate("/admin/login", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    void loadAdmin();
  }, [navigate]);

  const handleRefresh = async () => {
    if (!currentUser?.role) return;
    setIsRefreshing(true);
    await loadData(currentUser.role);
    setIsRefreshing(false);
  };

  const recentContacts = useMemo(() => data.summary?.recentContacts ?? data.contacts.slice(0, 5), [data.contacts, data.summary]);
  const recentLeads = useMemo(() => data.summary?.recentLeads ?? data.leads.slice(0, 5), [data.leads, data.summary]);
  const recentProjects = useMemo(() => data.projects.slice(0, 5), [data.projects]);

  const handleLogout = () => {
    void authService.logout().catch(() => undefined).finally(() => {
      authService.clearToken();
      navigate("/admin/login", { replace: true });
    });
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center relative z-10">Loading admin dashboard...</div>;
  }

  return (
    <div className="min-h-screen px-6 py-24 bg-transparent">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-maroon-800 font-bold mb-3">Admin Panel</p>
            <h1 className="text-4xl font-display font-bold text-slate-950">Operations Dashboard</h1>
            <p className="text-slate-600 mt-2">
              {currentUser?.role === "editor"
                ? "Manage career vacancies with your editor account."
                : data.summary?.message ?? "Manage clients, projects, leads, tasks, and contacts from one place."}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-700 px-5 py-3 text-white font-semibold hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-white font-semibold hover:bg-maroon-900 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>

        {error ? <p className="mb-6 text-sm text-red-600">{error}</p> : null}

        {currentUser?.role === "admin" ? (
          <>
            <div className="grid md:grid-cols-2 xl:grid-cols-7 gap-6 mb-10">
              <StatCard title="Contacts" value={data.summary?.stats.contactCount ?? data.contacts.length} icon={MailOpen} />
              <StatCard title="Clients" value={data.clients.length} icon={Users} />
              <StatCard title="Projects" value={data.projects.length} icon={FolderKanban} />
              <StatCard title="Leads" value={data.summary?.stats.leadCount ?? data.leads.length} icon={Briefcase} />
              <StatCard title="Tasks" value={data.tasks.length} icon={CheckSquare} />
              <StatCard title="Vacancies" value={data.vacancies.length} icon={Briefcase} />
              <StatCard title="Users" value={data.users.length} icon={UserCog} />
            </div>

            <div className="grid xl:grid-cols-2 gap-6 mb-10">
              <section className="rounded-[2rem] border border-white/20 bg-white/70 backdrop-blur-xl p-8 shadow-xl">
                <h2 className="text-2xl font-display font-bold text-slate-950 mb-6">Recent Contacts</h2>
                <div className="space-y-4">
                  {recentContacts.length ? recentContacts.map((contact) => (
                    <div key={contact._id} className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <p className="font-semibold text-slate-900">{contact.name}</p>
                        <span className="text-xs text-slate-500">{contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : ""}</span>
                      </div>
                      <p className="text-sm text-slate-600">{contact.email}</p>
                      <p className="text-sm text-slate-700 mt-2 line-clamp-3">{contact.message}</p>
                    </div>
                  )) : <p className="text-sm text-slate-500">No contacts available.</p>}
                </div>
              </section>

              <section className="rounded-[2rem] border border-white/20 bg-white/70 backdrop-blur-xl p-8 shadow-xl">
                <h2 className="text-2xl font-display font-bold text-slate-950 mb-6">Recent Leads</h2>
                <div className="space-y-4">
                  {recentLeads.length ? recentLeads.map((lead) => (
                    <div key={lead._id} className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <p className="font-semibold text-slate-900">{lead.name}</p>
                        <span className="text-xs text-slate-500">{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : ""}</span>
                      </div>
                      <p className="text-sm text-slate-600">{lead.email}</p>
                      {lead.serviceName ? <p className="text-xs uppercase tracking-[0.2em] text-maroon-800 font-bold mt-2">{lead.serviceName}</p> : null}
                      <p className="text-sm text-slate-700 mt-2 line-clamp-3">{lead.message || "No message provided."}</p>
                    </div>
                  )) : <p className="text-sm text-slate-500">No leads available.</p>}
                </div>
              </section>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-10">
              <section className="rounded-[2rem] border border-white/20 bg-white/70 backdrop-blur-xl p-8 shadow-xl">
                <h2 className="text-2xl font-display font-bold text-slate-950 mb-6">Recent Projects</h2>
                <div className="space-y-4 max-h-[420px] overflow-auto pr-2">
                  {recentProjects.length ? recentProjects.map((project) => (
                    <div key={project._id} className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <p className="font-semibold text-slate-900">{project.title}</p>
                        <span className="text-xs uppercase tracking-[0.2em] text-maroon-800 font-bold">{project.status || "active"}</span>
                      </div>
                      <p className="text-sm text-slate-600">{project.client?.name || "No client assigned"}</p>
                      <p className="text-sm text-slate-700 mt-2 line-clamp-3">{project.description || "No description provided."}</p>
                    </div>
                  )) : <p className="text-sm text-slate-500">No projects available.</p>}
                </div>
              </section>

              <section className="rounded-[2rem] border border-white/20 bg-white/70 backdrop-blur-xl p-8 shadow-xl">
                <h2 className="text-2xl font-display font-bold text-slate-950 mb-6">Recent Tasks</h2>
                <div className="space-y-4 max-h-[420px] overflow-auto pr-2">
                  {data.tasks.length ? data.tasks.slice(0, 5).map((task) => (
                    <div key={task._id} className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <p className="font-semibold text-slate-900">{task.title}</p>
                        <span className="text-xs uppercase tracking-[0.2em] text-maroon-800 font-bold">{task.status || "pending"}</span>
                      </div>
                      <p className="text-sm text-slate-600">{task.relatedProject?.title || "No related project"}</p>
                      <p className="text-sm text-slate-700 mt-2 line-clamp-3">{task.description || "No description provided."}</p>
                    </div>
                  )) : <p className="text-sm text-slate-500">No tasks available.</p>}
                </div>
              </section>
            </div>

            <div className="space-y-6 pt-10 border-t border-white/20">
              <div className="pt-6">
                <p className="text-xs uppercase tracking-[0.3em] text-maroon-800 font-bold mb-6">CRM Management</p>
              </div>
              <ChangePasswordCard userName={currentUser?.name} />
              <UsersCRUD users={data.users} onRefresh={handleRefresh} currentUserId={currentUser?.id} />
              <ClientsCRUD clients={data.clients} onRefresh={handleRefresh} />
              <ProjectsCRUD projects={data.projects} clients={data.clients} onRefresh={handleRefresh} />
              <LeadsCRUD leads={data.leads} onRefresh={handleRefresh} />
              <TasksCRUD tasks={data.tasks} projects={data.projects} onRefresh={handleRefresh} />
              <VacanciesCRUD vacancies={data.vacancies} onRefresh={handleRefresh} />
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <section className="rounded-[2rem] border border-white/20 bg-white/70 backdrop-blur-xl p-8 shadow-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-maroon-800 font-bold mb-3">Editor Workspace</p>
                  <h2 className="text-3xl font-display font-bold text-slate-950">Vacancy Management</h2>
                  <p className="text-slate-600 mt-2">Your account can update careers content and job visibility.</p>
                </div>
                <div className="rounded-2xl bg-maroon-900 px-5 py-4 text-white shadow-lg">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/70">Active scope</p>
                  <p className="text-3xl font-display font-bold">{data.vacancies.length}</p>
                  <p className="text-sm text-white/80">vacancies</p>
                </div>
              </div>
            </section>
            <VacanciesCRUD vacancies={data.vacancies} onRefresh={handleRefresh} />
          </div>
        )}
      </div>
    </div>
  );
}
