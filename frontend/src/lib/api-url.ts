// Shared by the server (content) and the browser (contact form), so it lives apart from api.ts
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");
