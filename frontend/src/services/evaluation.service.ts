import api from "./api.service";

interface EvaluationPayload {
  moduleId: string;   // ← sem acento
  score: number;
  comment: string;
}
export const evaluationService = {
  async submitEvaluation(payload: EvaluationPayload) {
    const response = await api.post("/ratings", payload);
    return response.data;
  },
};