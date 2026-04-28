import "express-serve-static-core";
import type { UserRole } from "../middleware/auth";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      email: string;
      name: string;
      role?: UserRole;
    };
  }
}
