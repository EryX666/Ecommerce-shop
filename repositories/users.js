const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository')

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
    
    async create(attrs) {
        // attrs === { email: '', password: '' }
        attrs.id = this.randomId();
        
        const salt = crypto.randomBytes(8).toString('hex');
        const buf = await scrypt(attrs.password, salt, 64);
        
        const records = await this.getAll();
        const record = {
            ...attrs,
            password: `${buf.toString('hex')}.${salt}`
        }
        records.push(record);
        
        // write the updated 'records' array to the file
        await this.writeAll(records)
        
        return record;
    };
    
    async comparePasswords(saved, supplied){
        // save -> password saved in database.
        // supplied -> password given to us by the user trying to sign into account
        const [hashed, salt] = saved.split('.');
        const hashedSuppliedBuf = await scrypt(supplied, salt, 64);
        
        return hashed === hashedSuppliedBuf.toString('hex');
    }
};

module.exports = new UsersRepository('users.json');