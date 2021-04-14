export interface JwtData {
  userId: number;
  sessionId: number;
}

export interface JwtPayload {
  readonly sub: string;
  readonly aud: string;
  readonly exp: number;
  readonly iat: number;
}
