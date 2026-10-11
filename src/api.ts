const base = (import.meta.env.VITE_API_BASE || "/api").replace(/\/$/, "");
export async function apiFetch(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  if (options.body) headers.set("Content-Type", "application/json");
  const token = sessionStorage.getItem("waterSession");
  if (token) headers.set("Authorization", "Bearer " + token);
  const response = await fetch(base + path, {
    ...options,
    headers,
    signal: options.signal || AbortSignal.timeout(20000),
  });
  if (response.status === 401 && path !== "/auth/login") {
    sessionStorage.removeItem("waterSession");
    window.location.assign("/login");
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "请求失败，请稍后重试");
  }
  return response;
}
export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const body = await (await apiFetch(path, options)).json();
  if (!body.success) throw new Error(body.message || "请求失败");
  return body.data as T;
}
