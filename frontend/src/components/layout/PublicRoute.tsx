import { Navigate } from "react-router-dom";
import { authService } from "../../lib/auth";

/**
 * PublicRoute — redirects to /admin if a JWT token is already present.
 * Prevents authenticated users from accessing login/signup pages.
 */
export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = authService.isAuthenticated();

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};
