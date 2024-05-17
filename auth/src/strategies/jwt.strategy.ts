import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { APP_CONFIG } from 'config/configuration';
import { request } from 'http';
import { ExtractJwt, Strategy } from 'passport-jwt';
// import { APP_CONFIG } from 'src/common/constant';
// import { APP_CONFIG } from 'src/common/constant';
import { TokenPayload } from 'src/interfaces/user.interface';
import { AuthService } from 'src/module/auth/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    const extractJwtFromRequest = ExtractJwt.fromExtractors([
      (request: any) => {
        console.log('Request:', request.headers.authorization); // Log the entire request object

        const token = request.headers?.authorization;
        console.log('JWT Token:', token);
        console.log('Secret Key:', APP_CONFIG.secret);
        return token;
      },
    ]);

    super({
      jwtFromRequest: extractJwtFromRequest,
      secretOrKey: APP_CONFIG.secret,
    });

    console.log('JwtStrategy constructor initialized');
  }

  async validate(payload: TokenPayload) {
    console.log('2222222222222222222222222');
    try {
      console.log('JwtStrategy validate method called', payload);
      const user = await this.authService.getProfile({ _id: payload.userId });
      console.log('User from validate method:', user);
      return user;
    } catch (error) {
      console.error('Error in JwtStrategy validate method:', error);
      throw error; // Rethrow the error to be handled by NestJS
    }
  }
}
// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(private readonly authService: AuthService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: APP_CONFIG.secret,
//     });

//     console.log('JwtStrategy constructor initialized');
//   }

//   async validate({ userId }: TokenPayload) {
//     console.log('-----------------');
//     return this.authService.getProfile({ id: userId });
//   }
// }
