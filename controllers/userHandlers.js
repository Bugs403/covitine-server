const User = require('../models/user');
const jwt = require("jsonwebtoken");
const keys = require('../config/config')
const UserHandler = {}

UserHandler.register = async (req, res) => {
    try {
        const {
            displayName,
            email,
            password
        } = req.body
        const user = await User.create(displayName, email, password);
        const token = jwt.sign(
            {
                _id: user._id,
            },
            process.env.JWT_SECRET || keys.JWT_SECRET,
            { expiresIn: "2400h" }
        );
        user.token = token
        // res.status(200).json(user);
        res.redirect("/posts");
    } catch (err) {
        const status = err.status || 500;
        const message = err.message || 'Something went wrong';
        // res.status(status).json({
        //     message
        // })
        res.render("register", {error: err.message});
        
    }
}

UserHandler.login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body
        const user = await User.findByEmailAndPassword(email, password);
        const token = jwt.sign(
            {
                _id: user._id,
            },
            process.env.JWT_SECRET || keys.JWT_SECRET,
            { expiresIn: "2400h" }
        );
        user.token = token
<<<<<<< HEAD
        console.log(res);
        //res.headers['set-cookies'] = token;
        res.status(200)
        .cookie('set-cookie',  token, {
            expires: new Date(Date.now() + 8 * 3600000) // cookie will be removed after 8 hours
          }).json(user);
=======
        // res.status(200).json(user);
        res.redirect("/posts");
>>>>>>> 3a86ace0e0bb0679da36a6d13ce6cffadde31be2
    } catch (err) {
        const status = err.status || 500;
        const message = err.message || 'Something went wrong';
        // res.status(status).json({
        //     message
        // })
        res.render("login", {error: err.message});
    }
}

module.exports = UserHandler