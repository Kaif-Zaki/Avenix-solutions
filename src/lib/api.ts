import { appEnv } from "@/lib/env";

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export const apiUrl = (path: string) => {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const baseUrl = trimTrailingSlash(appEnv.apiBaseUrl);

  if (baseUrl) {
    return `${baseUrl}${normalizedPath}`;
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return new URL(normalizedPath, window.location.origin).toString();
  }

  return normalizedPath;
};

export const apiFetch = (path: string, init?: RequestInit) => {
  return fetch(apiUrl(path), init);
};

export const mediaUrl = (path?: string) => {
  if (!path || /^https?:\/\//i.test(path)) {
    return path || "";
  }

  return apiUrl(path);
};
