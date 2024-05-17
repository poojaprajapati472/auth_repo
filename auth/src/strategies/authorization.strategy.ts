import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class auth0_protect extends PassportStrategy(Strategy) {
  constructor() {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri:
          'https://dev-3epkelv4qmg8xy65.us.auth0.com.well-known/jwks.json',
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: process.env.AUDIENCE,
      issuer: process.env.ISSUER,
      algorithms: ['RS256'],
    });
  }
  async validate(payload: any): Promise<any> {
    const decodedToken: any = jwt.decode(payload, { complete: true });
    if (decodedToken.payload.aud !== process.env.AUDIENCE) {
      throw new UnauthorizedException('Invalid audience');
    }
    return true;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const istoken = this.extractTokenFromHeader(request);
      if (!istoken) {
        throw new UnauthorizedException();
      }
      const payload = await this.validate(istoken);
      request.user = payload;
      return true;
    } catch (error) {
      throw error;
    }
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
