import { Service } from 'typedi';
import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { BasicStrategy } from 'passport-http';
import passport from 'passport';
import { RequestHandler } from 'express';

import { UserService } from '../services';
import { JwtPayload } from '../models';

import { Config } from './config';

@Service()
export class Passport {
  constructor(private readonly userService: UserService) {}

  private readonly opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    audience: Config.WEB_URL
  };

  public authenticate(strategy: 'jwt' | 'basic' = 'jwt'): RequestHandler {
    switch (strategy) {
      case 'jwt':
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return passport.authenticate('jwt', {
          session: false,
          failWithError: true
        });
      case 'basic':
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return passport.authenticate('basic', { session: false });
    }
  }

  init(): void {
    passport.initialize();
    // passport.session();
    passport.use(
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      new Strategy(this.opts, async (jwtPayload: JwtPayload, done) => {
        try {
          const userResult = await this.userService.getByPk(jwtPayload.userId);
          if (userResult.isOk()) {
            return done(null, userResult.value.data);
          } else {
            return done(null, false);
          }
        } catch (error) {
          return done(error, false);
        }
      })
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
