import { apiClient, API_CONFIG } from "@/lib/api";

export interface SignupPayload {
  institutionId?: string;
  institutionName?: string;
  patientName?: string;
  walletAddress: string;
  type: "hospital" | "patient";
  privateKey?: string;
}

export interface SignupResponse {
  id: string;
  institutionId?: string;
  institutionName?: string;
  patientName?: string;
  name: string;
  walletAddress: string;
  did: string;
  type: "hospital" | "patient";
  createdAt: string;
}

export interface LoginPayload {
  walletAddress: string;
  type: "hospital" | "patient";
}

export const userAPI = {
  signup: async (payload: SignupPayload): Promise<SignupResponse> => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.SIGNUP, payload);
    return response.data;
  },
  login: async (payload: LoginPayload): Promise<SignupResponse> => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.LOGIN, payload);
    return response.data;
  },
};
