export interface JwtDecoded {
  readonly aud: string;
  readonly exp: number;
  readonly iat: number;
  readonly sessionId: number;
  readonly userId: number;
}
