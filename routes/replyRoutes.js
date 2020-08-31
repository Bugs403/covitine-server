const express = require("express");
const router = express.Router();
const replyHandler = require("../controllers/replyHandlers");
const userAuth = require('../middlewares/userAuth')
router.post("/",userAuth, replyHandler.giveReply);
router.post("/upvote/:id",userAuth, replyHandler.upVote);
router.post("/downvote/:id",userAuth, replyHandler.downVote);

module.exports = router;
