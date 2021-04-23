import { Service } from 'typedi';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-verify-token';
import { BasicStrategy } from 'passport-http';
import passport, { AuthenticateOptions } from 'passport';
import { RequestHandler } from 'express';

import { UserService } from '../services';
import { GoogleTokenPayload, JwtPayload } from '../models';
import { BadRequestError } from '../errors';

import { Config } from './config';

@Service()
export class Passport {
  constructor(private readonly userService: UserService) {}

  public authenticate(strategy: 'jwt' | 'basic' | 'google' = 'jwt', opts?: AuthenticateOptions): RequestHandler {
    switch (strategy) {
      case 'jwt':
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return passport.authenticate('jwt', {
          ...opts,
          session: false,
          failWithError: false
        });
      case 'basic':
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return passport.authenticate('basic', { ...opts, session: false });
      case 'google':
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return passport.authenticate('google-verify-token', { ...opts, session: false });
    }
  }

  init(): void {
    passport.initialize();
    // passport.session();
    passport.use(
      new JwtStrategy(
        {
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: process.env.ACCESS_TOKEN_SECRET,
          audience: Config.WEB_URL
        },
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (payload: JwtPayload, done) => {
          try {
            const userResult = await this.userService.getByPk(payload.sub);
            if (userResult.isOk()) {
              return done(null, userResult.value.data);
            } else {
              return done(null, null);
            }
          } catch (error) {
            return done(error, null);
          }
        }
      )
    );

    passport.use(
      new GoogleStrategy(
        { clientID: process.env.GOOGLE_CLIENT_ID },
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (profile: GoogleTokenPayload, _googleId: string, done: (...args: any[]) => void) => {
          if (!profile.email_verified || !profile.name) {
            done(new BadRequestError('Missing params in google payload'), null);
          }
          try {
            const userResult = await this.userService.prepareOauthUser(profile);
            if (userResult.isOk()) {
              return done(null, userResult.value);
            } else {
              return done(null, null);
            }
          } catch (error) {
            return done(error, null);
          }
        }
      )
    );

    passport.use(
      new BasicStrategy((username, password, done) => {
        if (username === Config.OPENAPI_USERNAME && password === Config.OPENAPI_PASSWORD) {
          return done(null, username);
        }
      })
    );
  }
}
