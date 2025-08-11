import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  withCredentials: false, // you are using CookieToken views; keep true
});

// In-memory promise lock to avoid refresh stampede
let refreshPromise: Promise<string | null> | null = null;

export function setAuthHeader(token?: string) {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
}

api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config!;
    const status = error.response?.status;

    // only attempt refresh once per request
    // we mark attempts with a custom flag
    if (status === 401 && !(original as any)._retry) {
      (original as any)._retry = true;

      if (!refreshPromise) {
        const refresh = localStorage.getItem("ml_staff_refresh");
        refreshPromise = (async () => {
          if (!refresh) return null;
          try {
            const { data } = await api.post("/accounts/token/refresh/", { refresh });
            localStorage.setItem("ml_staff_token", data.access);
            return data.access as string;
          } catch {
            localStorage.removeItem("ml_staff_token");
            localStorage.removeItem("ml_staff_refresh");
            return null;
          } finally {
            // allow subsequent refresh attempts
            setTimeout(() => (refreshPromise = null), 0);
          }
        })();
      }
      const newToken = await refreshPromise;
      if (newToken) {
        setAuthHeader(newToken);
        original.headers = original.headers ?? {};
        (original.headers as any)["Authorization"] = `Bearer ${newToken}`;
        return api(original);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
