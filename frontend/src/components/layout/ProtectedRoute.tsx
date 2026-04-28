import { Navigate } from "react-router-dom";
import { authService } from "../../lib/auth";

/**
 * ProtectedRoute — renders children only if a JWT token is present in localStorage.
 * Redirects to /admin/login immediately (before rendering) if unauthenticated.
 *
 * NOTE: This is a first-line client-side guard. The server enforces the real
 * authorization check on every API call via requireAuth middleware.
 */
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = authService.getToken();

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};
