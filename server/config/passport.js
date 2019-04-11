const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const db = require('../models/index');
const env = require('./env');

module.exports = function(passport){

	let opts = {}
	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
	opts.secretOrKey = env.SECRET;
	//opts.issuer = 'accounts.examplesoft.com';
	//opts.audience = 'yoursite.net';
	passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
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
};
