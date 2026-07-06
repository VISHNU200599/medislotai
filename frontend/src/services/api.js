// src/services/api.js
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ─── Request Interceptor: attach token ─────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Response Interceptor: handle 401 ──────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(`${BASE_URL}/auth/refresh-token`, {}, { withCredentials: true });
        const newToken = res.data?.data?.accessToken;
        if (newToken) {
          localStorage.setItem("accessToken", newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth ───────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
  refreshToken: () => api.post("/auth/refresh-token"),
};

// ─── Hospitals ──────────────────────────────────────────────────────────────
export const hospitalsAPI = {
  getAll: (params) => api.get("/hospitals", { params }),
  getBySlug: (slug) => api.get(`/hospitals/${slug}`),
  getDoctors: (id, params) => api.get(`/hospitals/${id}/doctors`, { params }),
};

// ─── Doctors ────────────────────────────────────────────────────────────────
export const doctorsAPI = {
  getAll: (params) => api.get("/doctors", { params }),
  getById: (id) => api.get(`/doctors/${id}`),
  getSlots: (id, params) => api.get(`/doctors/${id}/slots`, { params }),
  getMyAppointments: (params) => api.get("/doctors/me/appointments", { params }),
  updateProfile: (data) => api.put("/doctors/me/profile", data),
  updateAppointmentStatus: (id, data) => api.patch(`/doctors/appointments/${id}/status`, data),
};

// ─── Appointments ────────────────────────────────────────────────────────────
export const appointmentsAPI = {
  book: (data) => api.post("/appointments", data),
  getMyAppointments: (params) => api.get("/appointments/me", { params }),
  getById: (id) => api.get(`/appointments/${id}`),
  cancel: (id, data) => api.delete(`/appointments/${id}`, { data }),
};

// ─── Patients ────────────────────────────────────────────────────────────────
export const patientsAPI = {
  getProfile: () => api.get("/patients/profile"),
  updateProfile: (data) => api.put("/patients/profile", data),
};

// ─── Departments ─────────────────────────────────────────────────────────────
export const departmentsAPI = {
  getAll: (params) => api.get("/departments", { params }),
};

export default api;
