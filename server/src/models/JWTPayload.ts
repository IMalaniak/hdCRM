export interface JwtPayload {
  readonly aud?: string;
  readonly exp?: number;
  readonly iat?: number;
  readonly sub: number;
}
