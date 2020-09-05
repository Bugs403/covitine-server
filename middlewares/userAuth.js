const jwt = require("jsonwebtoken");
const config = require("../config/config");

module.exports = async (req, res, next) => {
  try {
  //  if(req.rawHeaders.slice(-1)[0].slice(11))
    const index = req.rawHeaders.findIndex(val => val == "Cookie")
    const token = req.rawHeaders[index+1].slice(11);
   
    const decodedToken = jwt.verify(token, config.JWT_SECRET);
    req.user = {
      _id: decodedToken._id,
    };
    console.log(req.user);
    console.log("authorization complete");
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed"});
  }
};
