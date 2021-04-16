export interface AuthResponse {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
  sessionId: number;
  refreshToken?: string;
}
