const jwt = require("jsonwebtoken");
const config = require("../config/config");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.token;
    const decodedToken = jwt.verify(token, config.JWT_SECRET);
    req.user = {
      _id: decodedToken._id,
    };
    console.log(req.user);
    console.log("authorization complete");
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed" });
  }
};
