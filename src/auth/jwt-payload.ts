// Payload mã hoá trong JWT - dùng chung cho access token và refresh token
export interface JwtPayload {
  sub: number; // user id
  email: string;
}
