import { api } from "./api";

interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  async login(payload: LoginPayload) {
    const response = await api.post(
      "/auth/login",
      payload
    );

    return response.data;
  },
};