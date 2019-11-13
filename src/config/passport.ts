// tslint:disable: indent
import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import passport from 'passport';
import * as db from '../models';

export class Passport {
  private opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: process.env.SECRET
    // issuer: 'auth@mywebmaster.pp.ua',
    // audience = 'yoursite.net';
  };

  constructor() {}

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
      new Strategy(this.opts, (jwt_payload, done) => {
        db.User.findOne({
          where: { id: jwt_payload.id },
          attributes: { exclude: ['passwordHash', 'salt'] },
          include: [
            {
              model: db.Organization
            },
            {
              model: db.Role,
              through: {
                attributes: []
              },
              required: false
            },
            {
              model: db.State
            },
            {
              model: db.Asset,
              as: 'avatar',
              required: false
            },
            {
              model: db.UserLoginHistory,
              required: false
            },
            {
              model: db.Department,
              required: false
            }
          ]
        })
          .then(user => {
            if (user) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          })
          .catch(error => {
            return done(error, false);
          });
      })
    );
  }
}

export default new Passport();
