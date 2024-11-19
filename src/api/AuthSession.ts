import { decodeJwt } from 'jose';
import { JwtPayloadSchema } from '../schemas/JwtPayloadSchema';
import { z } from 'zod';

export type JWTExpectedPayload = z.infer<typeof JwtPayloadSchema>;

export default class AuthSession {
  protected readonly jwt: string;
  protected readonly jwtPayload: JWTExpectedPayload;

  constructor(token: string) {
    this.jwt = token;
    this.jwtPayload = JwtPayloadSchema.parse(decodeJwt(token));
  }

  get token(): string {
    return this.jwt;
  }

  get userName(): string {
    return this.jwtPayload.username;
  }

  get userId(): number {
    return this.jwtPayload.id;
  }

  get createdAt(): number {
    return this.jwtPayload.iat;
  }

  get expiresAt(): number {
    return this.jwtPayload.exp;
  }

  get isExpired(): boolean {
    return Math.floor(Date.now() / 1000) >= this.expiresAt;
  }

  get isValid(): boolean {
    return !this.isExpired;
  }
}
