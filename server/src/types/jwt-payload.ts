export interface JwtPayload {
  id: number;
  name: string;
  email: string;
  type: string;
  sub: string;
  iat: number;
}
