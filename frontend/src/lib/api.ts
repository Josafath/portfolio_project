import { cacheLife } from "next/cache";
import type { Locale } from "@/i18n/config";
import { API_URL } from "./api-url";

export type ProjectVersion = { label: string; year: number | null; summary: string };
export type Improvement = { aspect: string; before: string; after: string };

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  repo_url: string;
  live_url: string;
  started_year: number;
  technologies: string[];
  versions: ProjectVersion[];
  improvements: Improvement[];
};

export type Milestone = {
  year: number;
  date: string | null;
  shape: string;
  title: string;
  body: string;
  repo: string;
  commit_hash: string;
  commit_message: string;
  technologies: string[];
};

export type Experience = {
  company: string;
  role: string;
  start: string;
  end: string | null;
  highlights: string[];
  technologies: string[];
};

export type TechnologyCategory = "language" | "frontend" | "backend" | "data" | "desktop" | "tools";
export type Technology = { name: string; category: TechnologyCategory; projects: string[] };

export type Service = { id: number; title: string; description: string; examples: string[] };

export type SocialLink = {
  platform: "github" | "instagram" | "linkedin" | "youtube" | "tiktok" | "other";
  handle: string;
  url: string;
  category: "dev" | "personal";
};

async function get<T>(path: string): Promise<T> {
  "use cache";
  // Content is edited in the Django admin; a few minutes of delay is fine
  cacheLife("minutes");
  const response = await fetch(`${API_URL}/api/${path}`);
  if (!response.ok) {
    throw new Error(`GET /api/${path} failed with ${response.status}`);
  }
  return response.json();
}

export const getProjects = (lang: Locale) => get<Project[]>(`projects/?lang=${lang}`);
export const getMilestones = (lang: Locale) => get<Milestone[]>(`milestones/?lang=${lang}`);
export const getExperience = (lang: Locale) => get<Experience[]>(`experience/?lang=${lang}`);
export const getTechnologies = () => get<Technology[]>("technologies/");
export const getServices = (lang: Locale) => get<Service[]>(`services/?lang=${lang}`);
export const getSocialLinks = () => get<SocialLink[]>("socials/");

export async function getProject(lang: Locale, slug: string): Promise<Project | null> {
  const projects = await getProjects(lang);
  return projects.find((project) => project.slug === slug) ?? null;
}
