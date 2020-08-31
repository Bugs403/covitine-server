const express = require("express");
const router = express.Router();
const userHandler = require("../controllers/userHandlers");
router.post("/register", userHandler.register);
router.post("/login", userHandler.login);

module.exports = router;
