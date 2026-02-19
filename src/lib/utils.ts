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

export function injectBase(html: string, baseHref: string) {
  if (!html || !baseHref) return html;
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const baseEl = doc.querySelector('base[href]');
    if (baseEl) return html;
    const headEl = doc.head || doc.createElement('head');
    const newBase = doc.createElement('base');
    newBase.setAttribute('href', baseHref);
    headEl.insertBefore(newBase, headEl.firstChild);
    if (!doc.head && doc.documentElement) {
      doc.documentElement.insertBefore(headEl, doc.body || null);
    }
    return '<!DOCTYPE html>\n' + (doc.documentElement ? doc.documentElement.outerHTML : html);
  } catch {
    return html;
  }
}
