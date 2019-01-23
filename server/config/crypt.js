const crypto = require('crypto');
const crypt = {};

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
const genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
const sha512 = function(password, salt){
    let hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    let value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

crypt.saltHashPassword = function(userpassword) {
    let salt = genRandomString(16); /** Gives us salt of length 16 */
    return sha512(userpassword, salt);
}

crypt.validatePassword = function(userpassword, passwordHash, salt) {
	let testHash = sha512(userpassword, salt);
	return testHash.passwordHash === passwordHash;
}

module.exports = crypt;