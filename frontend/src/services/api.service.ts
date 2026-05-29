import axios from "axios";
import { supabase } from "../lib/supabase";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use(async (config) => {
  const localToken = localStorage.getItem("token");

  if (localToken) {
    config.headers.Authorization = `Bearer ${localToken}`;
    return config;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }

  return config;
});

export const aiService = {
  chat: async (data: { message: string; history?: any[] }) => {
    const response = await api.post("/ai/chat", data);
    return response.data;
  },
};

export default api;
