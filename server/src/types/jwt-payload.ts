export interface JwtPayload {
  id: number;
  username: string;
  email: string;
  role: string;
  sub: string;
  iat: number;
}
