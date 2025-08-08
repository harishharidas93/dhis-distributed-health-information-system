export interface AccessRequest {
  requestType: string;
  urgency: "low" | "medium" | "high" | "emergency";
  requestedAt: string;
  requestId: string;
  expirationTime: string;
  patientDetails: {
    id: string;
    name: string;
    did: string;
  };
  nftId: string;
  reason: string;
  accessType: string;
  requestedDuration?: number;
  institutionDetails: {
    id: string;
    name: string;
    did: string;
  };
  recordDetails: {
    nftId: string;
    metadataCid: string;
    name: string;
    description: string;
  };
  status?: "pending" | "approved" | "rejected" | "active" | "expired";
}

export interface AccessRequestPayload {
  requestType: string;
  urgency?: "low" | "medium" | "high" | "emergency";
  requestedAt?: string;
  requestId?: string;
  patientId: string;
  instituitionId: string;
  nftId: string;
  reason?: string;
  accessType?: string;
  requestedDuration?: number;
  passkey?: string;
}
