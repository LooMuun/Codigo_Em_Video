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

  async signInWithProvider(provider: "github" | "google") {
    return supabase.auth.signInWithOAuth({ provider });
  },

  async signOut() {
    return supabase.auth.signOut();
  },
};