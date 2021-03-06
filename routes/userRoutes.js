const express = require("express");
const router = express.Router();
const userHandler = require("../controllers/userHandlers");

router.get("/register",(req,res)=>{ 
    res.render("register",{error: ""});
});
router.post("/register", userHandler.register);


router.get("/login",(req,res)=>{
    res.render("login", {error: ""});
});
router.post("/login", userHandler.login);

module.exports = router;
