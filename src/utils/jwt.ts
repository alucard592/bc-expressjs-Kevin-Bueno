import jwt from 'jsonwebtoken';

const ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET || 'banco_sangre_jwt_access_secret_default_key_1234567890';
const REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'banco_sangre_jwt_refresh_secret_default_key_1234567890';

export interface JwtPayload {
  sub: string;
  email?: string;
  role?: string;
}

// ─── Access Token (15 minutos) ──────────────────────────────────────────────

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
}

// ─── Refresh Token (7 días) ─────────────────────────────────────────────────

export function signRefreshToken(payload: Pick<JwtPayload, 'sub'>): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
}
