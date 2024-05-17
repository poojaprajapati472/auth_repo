import { Strategy } from 'passport-auth0';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/module/auth/auth.service';
import { APP_CONFIG } from 'config/configuration';

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy, 'auth0') {
  constructor(private authService: AuthService) {
    super({
      domain: APP_CONFIG.auth0_domain,
      clientID: APP_CONFIG.auth0_client_id,
      clientSecret: APP_CONFIG.auth0_client_secret,
      callbackURL: APP_CONFIG.auth0_callback_url,
      scope: 'openid email profile',
      state: false,
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: { displayName: string; user_id: string },
  ): Promise<any> {
    console.log('calling validate');
    console.log('profile============', profile);
    const user = await this.authService.validateAuth0User({
      username: profile.displayName,
      id: profile.user_id,
    });
    console.log(_accessToken);
    console.log(profile);
    return user;
  }
}
