const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const moment = require("moment");
const emailValidator = require('../helper/emailValidator')
const hashPassword = require('../helper/hashPassword')
const errorCreator = require('../helper/errorCreator');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
    displayName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    createdAt: { type: String, required: true, default: moment().toISOString() },

});
UserSchema.plugin(uniqueValidator);


User = mongoose.model("user", UserSchema);

User.create = async (displayName, email, password) => {
    displayName = typeof (displayName) === 'string' && displayName.trim().length > 0 ? displayName : false
    email = typeof (email) === 'string' && emailValidator(email) ? email : false;
    password = typeof (password) === 'string' && password.length >= 6 ? password : false;

    if (displayName, email, password) {
        try {
            let user = new User({
                displayName,
                email,
                password: await hashPassword(password)
            })
            await user.save()
            user = JSON.parse(JSON.stringify(user));
            delete user.password;
            return user;
        } catch (err) {
            throw errorCreator(err.message, 500)
        }
    } else {
        throw errorCreator('Mission required fields', 400)
    }
}
User.findUserById = async (id) => {
    id = typeof (id) === 'string' && mongoose.Types.ObjectId.isValid(id) ? id : false

    if (id) {
        try {
            const user = await User.findById(id);
            return user;
        } catch{
            throw errorCreator(err.message, 500);
        }
    } else {
        throw errorCreator('Mission required fields', 400)

    }

}
User.findByEmailAndPassword = async (email, password) => {
    email = typeof (email) === 'string' && emailValidator(email) ? email : false;
    password = typeof (password) === 'string' && password.length >= 6 ? password : false;
    if (email && password) {
        try {
            let user = await User.findOne({ email: email })
            if (user) {
                const isPasswordMatch = await bcrypt.compare(password, user.password)
                if (isPasswordMatch) {
                    user = JSON.parse(JSON.stringify(user));
                    delete user.password;
                    return user;
                } else {
                    throw errorCreator('Wrong Credentials', 400)
                }
            } else {
                throw errorCreator('Email Not Found', 400)
            }
        } catch (err) {
            throw errorCreator(err.message, 500)
        }
    } else {
        throw errorCreator('Mission required fields', 400)
    }
}
User.updateUser = async (id, displayName, email, password) => {
    id = typeof (id) === 'string' && mongoose.Types.ObjectId.isValid(id) ? id : false
    displayName = typeof (displayName) === 'string' && displayName.trim().length > 0 ? displayName : false
    email = typeof (email) === 'string' && emailValidator(email) ? email : false;
    password = typeof (password) === 'string' && password.length >= 6 ? password : false;

    if (id) {
        if (displayName || email || password) {
            try {
                const user = await User.findById(id);
                if (displayName) {
                    user.displayName = displayName
                }
                if (email) {
                    user.email = email
                }
                if (password) {
                    user.password = await hashPassword(password)
                }
                await user.save();
                return true;
            } catch (err) {
                throw errorCreator(err.message, 500);
            }
        } else {
            throw errorCreator('Nothing passed to change', 400);
        }
    } else {
        throw errorCreator('Mission required fields', 400)

    }
}
module.exports = User
