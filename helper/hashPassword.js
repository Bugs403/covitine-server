const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
    password = typeof(password) === 'string' && password.length >= 6 ? password : false
    if(password){
        try{
        const hash = await bcrypt.hash(password, 10)
        return hash
        }catch(err){
            return false
        }
    }
    return false
}

module.exports = hashPassword;