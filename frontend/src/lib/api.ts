import { authService } from "./auth";

let API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Ensure it ends with /api if not present
if (API_BASE_URL && !API_BASE_URL.endsWith("/api")) {
  API_BASE_URL = `${API_BASE_URL.replace(/\/$/, "")}/api`;
}

// Log API URL for debugging
console.log("API_BASE_URL:", API_BASE_URL);

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  token?: string;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}) {
  // Get token from storage if not provided in options
  const token = options.token || authService.getToken();
  
  const url = `${API_BASE_URL}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  console.debug(`[API] ${options.method || "GET"} ${url}`);
  if (token) {
    console.debug(`[API] Token present: ${token.substring(0, 20)}...`);
  }

  const response = await fetch(url, {
    method: options.method ?? "GET",
    credentials: "include",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      console.warn("[API] 401 Unauthorized. Clearing token and redirecting to login.");
      authService.clearToken();
      if (!window.location.pathname.startsWith("/admin/login")) {
        window.location.href = "/admin/login";
      }
    }
    console.error(`[API] Error ${response.status}:`, data.message || "Request failed");
    throw new Error(data.message ?? `Request failed with status ${response.status}`);
  }

  return data as T;
}

export { API_BASE_URL };
