import { LucideIcon } from "lucide-react";

export interface Service {
  slug: string;
  title: string;
  description: string;
  longDescription: string[];
  icon: LucideIcon;
  process: {
    title: string;
    description: string;
  }[];
  features: string[];
}

export interface ProcessStep {
  title: string;
  icon: LucideIcon;
  description: string;
}

export interface NavLink {
  name: string;
  href: string;
}

export interface JobRole {
  title: string;
  description: string;
  icon: LucideIcon;
  category: "Development" | "Design" | "Management";
}
