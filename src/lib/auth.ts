import { apiRequest } from "./api";

const TOKEN_KEY = "nexyrasoft_token";

export type UserRole = "admin" | "editor";

export type AuthPayload = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role?: UserRole;
  };
  message: string;
};

export const authService = {
  signup: (payload: { name: string; email: string; password: string }) =>
    apiRequest<AuthPayload>("/auth/signup", { method: "POST", body: payload }),
  login: (payload: { email: string; password: string }) =>
    apiRequest<AuthPayload>("/auth/login", { method: "POST", body: payload }),
  logout: () => apiRequest<{ message: string }>("/auth/logout", { method: "POST" }),
  me: (token?: string) => apiRequest<{ user: AuthPayload["user"] }>("/auth/me", { token }),
  changePassword: (payload: { currentPassword: string; newPassword: string }) =>
    apiRequest<{ message: string }>("/auth/change-password", {
      method: "POST",
      body: payload,
      token: localStorage.getItem(TOKEN_KEY) || "",
    }),
  saveToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  getToken: () => localStorage.getItem(TOKEN_KEY),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
};
