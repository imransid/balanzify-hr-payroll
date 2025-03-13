import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import googleOauthConfig from '../config/google-oauth.config';
import { ConfigType } from '@nestjs/config';
import { UserService } from '../user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  /**
   *  constructor(private readonly userService: UserService) {}
   */
  constructor(
    @Inject(googleOauthConfig.KEY)
    private googleConfiguration: ConfigType<typeof googleOauthConfig>,
    private readonly userService: UserService,
  ) {
    super({
      clientID: googleConfiguration.clinetID,
      clientSecret: googleConfiguration.clinetSecret,
      callbackURL: googleConfiguration.callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    //console.log(profile); // Debug to check structure
    const email = profile.emails?.[0]?.value; // Use optional chaining to avoid undefined errors

    if (!email) {
      return done(new Error('Email not found'), null);
    }

    // const user = await this.userService.validateGoogleUser({
    //   email,
    //   firstName: profile.name?.givenName,
    //   lastName: profile.name?.familyName,
    //   password: '', // Assuming password is not required for OAuth
    //   userType: 'OTHER',
    // });

    done(null, {}); // Pass user to Passport
  }
}
