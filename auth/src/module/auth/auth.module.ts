import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserDetails } from 'src/entity/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ResponseHandler } from 'src/lib/response.handler';
import { LoggerModule } from 'src/logger/logger.module';
import { UserRepository } from './auth.repositoty';
import { DatabaseModule } from 'src/database/database.module';
import { LoggingInterceptor } from 'src/interceptor/logging.interceptor';
import { LocalStategy } from 'src/strategies/local.strategy';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { Auth0Strategy } from 'src/strategies/auth0.strategy';
import { AxiosManager } from 'src/lib/axios-manager';
import { APP_CONFIG } from 'config/configuration';
import { User } from '../user/user.entity';

@Module({
  imports: [
    // PassportModule.register({ defaultStrategy: 'jwt' }),
    DatabaseModule,
    DatabaseModule.forFeature([UserDetails, User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => {
        return {
          secret: APP_CONFIG.secret,
          signOptions: {
            expiresIn: APP_CONFIG.expires,
          },
        };
      },
    }),
    LoggerModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ResponseHandler,
    UserRepository,
    LocalStategy,
    Logger,
    LoggingInterceptor,
    JwtStrategy,
    UserService,
    Auth0Strategy,
    AxiosManager,
  ],
})
export class AuthModule {}
