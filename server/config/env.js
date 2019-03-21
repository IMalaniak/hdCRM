const env = {
	PORT: process.env.PORT || 3000,
	NODE_ENV: process.env.NODE_ENV || 'development',
	SECRET: process.env.SECRET || 'secret',
	URL: process.env.URL || 'http://localhost:4200'
};

module.exports = env;
