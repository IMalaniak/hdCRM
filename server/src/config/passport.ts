import { Service } from 'typedi';
import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import passport from 'passport';

import { UserController } from '../controllers';
import { Config } from './config';

@Service({ global: true })
export class Passport {
  constructor(private readonly userController: UserController) {}

  private opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    // issuer: 'auth@mywebmaster.pp.ua',
    audience: Config.WEB_URL
  };

  public authenticate() {
    return passport.authenticate('jwt', {
      session: false,
      failWithError: true
    });
  }

  init(): void {
    passport.initialize();
    // passport.session();
    passport.use(
      new Strategy(this.opts, (jwtPayload, done) => {
        this.userController
          .getById(jwtPayload.userId)
          .then((user) => {
            if (user) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          })
          .catch((error) => {
            return done(error, false);
          });
      })
    );
  }
}
