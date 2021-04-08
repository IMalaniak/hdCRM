import { Service } from 'typedi';
import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { BasicStrategy } from 'passport-http';
import passport from 'passport';

import { Config } from './config';
import { UserService } from '../services';

@Service()
export class Passport {
  constructor(private readonly userService: UserService) {}

  private opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    // issuer: 'auth@mywebmaster.pp.ua',
    audience: Config.WEB_URL
  };

  public authenticate(strategy: 'jwt' | 'basic' = 'jwt') {
    switch (strategy) {
      case 'jwt':
        return passport.authenticate('jwt', {
          session: false,
          failWithError: true
        });
      case 'basic':
        return passport.authenticate('basic', { session: false });
    }
  }

  init(): void {
    passport.initialize();
    // passport.session();
    passport.use(
      new Strategy(this.opts, async (jwtPayload, done) => {
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
