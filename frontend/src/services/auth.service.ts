import { api } from "./api";
import { supabase } from "../lib/supabase";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  async login(payload: LoginPayload) {
    const response = await api.post("/auth/login", payload);
    return response.data;
  },

  async register(payload: RegisterPayload) {
    const response = await api.post("/auth/register", payload);
    return response.data;
  },

  async getRecovery2faStatus() {
    const response = await api.get("/auth/recovery-2fa/status");
    return response.data;
  },

  async setupRecovery2fa() {
    const response = await api.post("/auth/recovery-2fa/setup");
    return response.data;
  },

  async enableRecovery2fa(code: string) {
    const response = await api.post("/auth/recovery-2fa/enable", { code });
    return response.data;
  },

  async recoverPassword(payload: { email: string; code: string; newPassword: string }) {
    const response = await api.post("/auth/recover-password", payload);
    return response.data;
  },

  async signInWithProvider(provider: "github" | "google") {
    return supabase.auth.signInWithOAuth({ provider });
  },

  async signOut() {
    return supabase.auth.signOut();
  },
};
