import { apiRequest } from "./api";
import { authService } from "./auth";

export type UserRole = "admin" | "editor";

export type Client = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  status?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Project = {
  _id: string;
  title: string;
  description?: string;
  status?: string;
  client?: {
    _id?: string;
    name?: string;
    company?: string;
    email?: string;
  };
  deadline?: string;
  budget?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type Lead = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  serviceName?: string;
  budget?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Task = {
  _id: string;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  assignedTo?: {
    _id?: string;
    name?: string;
    email?: string;
  };
  relatedProject?: {
    _id?: string;
    title?: string;
  };
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type VacancyCategory = "Development" | "Design" | "Management";
export type EmploymentType = "Full-time" | "Part-time" | "Contract" | "Internship";
export type VacancyStatus = "Active" | "Inactive";

export type DashboardUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
};

export type Vacancy = {
  _id: string;
  title: string;
  summary: string;
  description: string;
  category: VacancyCategory;
  location?: string;
  employmentType?: EmploymentType;
  status: VacancyStatus;
  createdAt?: string;
  updatedAt?: string;
};

type EntityInput<T> = Partial<Omit<T, "_id" | "createdAt" | "updatedAt">>;

const getToken = () => authService.getToken() || "";

export const adminService = {
  getClients: () => apiRequest<Client[]>("/clients", { token: getToken() }),
  createClient: (data: EntityInput<Client>) =>
    apiRequest<Client>("/clients", { method: "POST", body: data, token: getToken() }),
  updateClient: (id: string, data: EntityInput<Client>) =>
    apiRequest<Client>(`/clients/${id}`, { method: "PUT", body: data, token: getToken() }),
  deleteClient: (id: string) =>
    apiRequest<{ message: string }>(`/clients/${id}`, { method: "DELETE", token: getToken() }),

  getProjects: () => apiRequest<Project[]>("/projects", { token: getToken() }),
  createProject: (data: EntityInput<Project>) =>
    apiRequest<Project>("/projects", { method: "POST", body: data, token: getToken() }),
  updateProject: (id: string, data: EntityInput<Project>) =>
    apiRequest<Project>(`/projects/${id}`, { method: "PUT", body: data, token: getToken() }),
  deleteProject: (id: string) =>
    apiRequest<{ message: string }>(`/projects/${id}`, { method: "DELETE", token: getToken() }),

  getLeads: () => apiRequest<Lead[]>("/leads", { token: getToken() }),
  updateLead: (id: string, data: EntityInput<Lead>) =>
    apiRequest<Lead>(`/leads/${id}`, { method: "PUT", body: data, token: getToken() }),
  deleteLead: (id: string) =>
    apiRequest<{ message: string }>(`/leads/${id}`, { method: "DELETE", token: getToken() }),

  getTasks: () => apiRequest<Task[]>("/tasks", { token: getToken() }),
  createTask: (data: EntityInput<Task>) =>
    apiRequest<Task>("/tasks", { method: "POST", body: data, token: getToken() }),
  updateTask: (id: string, data: EntityInput<Task>) =>
    apiRequest<Task>(`/tasks/${id}`, { method: "PUT", body: data, token: getToken() }),
  deleteTask: (id: string) =>
    apiRequest<{ message: string }>(`/tasks/${id}`, { method: "DELETE", token: getToken() }),

  getVacancies: () => apiRequest<Vacancy[]>("/vacancies", { token: getToken() }),
  createVacancy: (data: EntityInput<Vacancy>) =>
    apiRequest<Vacancy>("/vacancies", { method: "POST", body: data, token: getToken() }),
  updateVacancy: (id: string, data: EntityInput<Vacancy>) =>
    apiRequest<Vacancy>(`/vacancies/${id}`, { method: "PUT", body: data, token: getToken() }),
  deleteVacancy: (id: string) =>
    apiRequest<{ message: string }>(`/vacancies/${id}`, { method: "DELETE", token: getToken() }),

  getUsers: () => apiRequest<DashboardUser[]>("/users", { token: getToken() }),
  createUser: (data: { name: string; email: string; password: string; role: UserRole }) =>
    apiRequest<{ message: string; user: DashboardUser }>("/users", { method: "POST", body: data, token: getToken() }),
  deleteUser: (id: string) =>
    apiRequest<{ message: string }>(`/users/${id}`, { method: "DELETE", token: getToken() }),
};
