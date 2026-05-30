import axios from "axios";
import { supabase } from "../lib/supabase";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

// Interceptor de requisição: injeta o token antes de enviar
api.interceptors.request.use(async (config) => {
  // 1. Tenta token local primeiro
  const localToken = localStorage.getItem("token");
  if (localToken) {
    config.headers.Authorization = `Bearer ${localToken}`;
    return config;
  }

  // 2. Busca sessão do Supabase (com refresh automático se expirado)
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Erro ao obter sessão Supabase:", error.message);
  }

if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
    console.log("🔥 TOKEN INJETADO COM SUCESSO:", session.access_token.substring(0, 20) + "...");
  } else {
    console.warn("🚨 NENHUM TOKEN ENCONTRADO PARA:", config.url);
  }

  return config;
});

// Interceptor de resposta: se receber 401, tenta renovar o token e refaz
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { data: { session } } = await supabase.auth.refreshSession();

      if (session?.access_token) {
        originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
        return api(originalRequest); // refaz a requisição com o novo token
      }
    }

    return Promise.reject(error);
  }
);

// ==========================================
// É AQUI QUE O CÓDIGO NOVO ENTRA (Substituindo o antigo)
// ==========================================
export const aiService = {
  // Chat normal (texto)
  chat: async (data: { message: string; history?: any[] }) => {
    const response = await api.post("/ai/chat", data);
    return response.data;
  },

  // Chat com arquivo (FormData)
  chatFile: async (data: { file: File; message: string; history?: any[] }) => {
    const formData = new FormData();
    
    formData.append("file", data.file);
    formData.append("message", data.message);

    if (data.history && data.history.length > 0) {
      formData.append("history", JSON.stringify(data.history)); 
    }

    const response = await api.post("/ai/chat-file", formData);
    return response.data;
  },
};

export default api;