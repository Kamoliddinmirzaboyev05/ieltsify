import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function resolveRelativeUrl(base: string, target: string) {
  try {
    const absBase = new URL(base, window.location.origin);
    return new URL(target, absBase).toString();
  } catch {
    return target;
  }
}

export function directoryOf(url: string) {
  try {
    const abs = new URL(url, window.location.origin);
    const idx = abs.pathname.lastIndexOf('/');
    const dirPath = idx >= 0 ? abs.pathname.slice(0, idx + 1) : '/';
    return `${abs.origin}${dirPath}`;
  } catch {
    return url;
  }
}
