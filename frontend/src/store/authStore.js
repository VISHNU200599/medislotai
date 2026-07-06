// src/store/authStore.js
import { create } from "zustand";
import { authAPI } from "../services/api";

const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,

  // ─── Initialize from token ──────────────────────────────────────────────
  initAuth: async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      set({ isLoading: false });
      return;
    }
    try {
      const res = await authAPI.getMe();
      const { user, profile } = res.data.data;
      set({ user, profile, isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem("accessToken");
      set({ user: null, profile: null, isAuthenticated: false, isLoading: false });
    }
  },

  // ─── Login ──────────────────────────────────────────────────────────────
  login: async (credentials) => {
    const res = await authAPI.login(credentials);
    const { user, profile, accessToken } = res.data.data;
    localStorage.setItem("accessToken", accessToken);
    set({ user, profile, isAuthenticated: true });
    return { user, profile };
  },

  // ─── Register ───────────────────────────────────────────────────────────
  register: async (data) => {
    const res = await authAPI.register(data);
    const { user, accessToken } = res.data.data;
    localStorage.setItem("accessToken", accessToken);
    const meRes = await authAPI.getMe();
    const { profile } = meRes.data.data;
    set({ user, profile, isAuthenticated: true });
    return { user, profile };
  },

  // ─── Logout ─────────────────────────────────────────────────────────────
  logout: async () => {
    try { await authAPI.logout(); } catch {}
    localStorage.removeItem("accessToken");
    set({ user: null, profile: null, isAuthenticated: false });
  },

  // ─── Update Profile ─────────────────────────────────────────────────────
  updateProfile: (profile) => set({ profile }),
}));

export default useAuthStore;
