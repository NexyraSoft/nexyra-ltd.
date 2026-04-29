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
  
  me: (token?: string) => {
    const finalToken = token || authService.getToken();
    return apiRequest<{ user: AuthPayload["user"] }>("/auth/me", { 
      method: "GET",
      token: finalToken,
    });
  },
  
  changePassword: (payload: { currentPassword: string; newPassword: string }) =>
    apiRequest<{ message: string }>("/auth/change-password", {
      method: "POST",
      body: payload,
      token: authService.getToken() || "",
    }),
  
  saveToken: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    console.log("✓ Token saved to localStorage");
  },
  
  getToken: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token || undefined;
  },
  
  clearToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    console.log("✓ Token cleared from localStorage");
  },
  
  isAuthenticated: () => !!authService.getToken(),
};
