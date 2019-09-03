import crypto from 'crypto';

export class Crypt {
    constructor() {

    }

    genRandomString(length: number) {
        return crypto.randomBytes(Math.ceil(length/2))
                .toString('hex') /** convert to hexadecimal format */
                .slice(0,length);   /** return required number of characters */
    };

    private sha512(password: string, salt: string) {
        let hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
        hash.update(password);
        const value = hash.digest('hex');
        return {
            salt: salt,
            passwordHash: value
        };
    };

    saltHashPassword(userpassword: string) {
        const salt = this.genRandomString(16); /** Gives us salt of length 16 */
        return this.sha512(userpassword, salt);
    }

    validatePassword(userpassword: string, passwordHash: string, salt: string) {
        const testHash = this.sha512(userpassword, salt);
        return testHash.passwordHash === passwordHash;
    }

    setExpireMinutes = function(date: Date, minutes: number) {
        return new Date(date.getTime() + minutes*60000);
    }
    
    genTimeLimitedToken = function(minutes: number) {
        return {
            value: this.genRandomString(32),
            expireDate: this.setExpireMinutes(new Date(), minutes)
        };
    }
    
}
