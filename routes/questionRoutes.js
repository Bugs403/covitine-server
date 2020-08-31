const express = require("express");
const router = express.Router();
const questionHandler = require("../controllers/questionHandlers");
const userAuth = require('../middlewares/userAuth')
router.post("/ask",userAuth, questionHandler.askQuestion);
router.get('/search',questionHandler.search);
router.post('/upvote/:id',userAuth,questionHandler.upVote)
router.post('/downvote/:id',userAuth,questionHandler.downVote)
router.get('/search/:id',questionHandler.getQuestion);
module.exports = router;
