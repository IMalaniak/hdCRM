const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const models = require('../models/index');
const env = require('./env');

module.exports = function(passport){

	let opts = {}
	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
	opts.secretOrKey = env.SECRET;
	//opts.issuer = 'accounts.examplesoft.com';
	//opts.audience = 'yoursite.net';
	passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
		models.User.findOne({
			where: {id: jwt_payload.id},
			attributes: { exclude: ['passwordHash', 'salt'] },
			include: [
				{
					model: models.State
				}, {
					model: models.Asset,
					as: 'avatar'
				}
			]
		}).then(user => {
			if (user) {
				return done(null, user);
			}
		}).catch(error => {
			return done(err, false);
		});
	}));
};
