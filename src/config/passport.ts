import {Strategy, ExtractJwt, StrategyOptions} from 'passport-jwt';
import passport from 'passport';
import * as db from '../models';

export class PassportStrategy {
	opts: StrategyOptions = {
		jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
		secretOrKey: process.env.SECRET,
		issuer: 'auth@mywebmaster.pp.ua',
	};
	//opts.audience = 'yoursite.net';

	constructor() {
		this.init();
	}

	init(): void {
		passport.use(new Strategy(this.opts, (jwt_payload, done) => {
			db.User.findOne({
				where: {id: jwt_payload.id},
				attributes: { exclude: ['passwordHash', 'salt'] },
				include: [
					{
						model: db.Role,
						through: {
							attributes: []
						},
						required: false
					}, {
						model: db.State
					}, {
						model: db.Asset,
						as: 'avatar',
						required: false
					}, {
						model: db.UserLoginHistory,
						required: false
					}, {
						model: db.Department,
						required: false,
					}
				]
			}).then(user => {
				if (user) {
					return done(null, user);
				}
			}).catch(error => {
				return done(error, false);
			});
		}));
	}
}
