import { api } from "./api";

interface ChatPayload {
  message: string;
}

export const aiService = {
  async chat(payload: ChatPayload) {
    const response = await api.post(
      "/ai/chat",
      payload
    );

    return response.data;
  },
};