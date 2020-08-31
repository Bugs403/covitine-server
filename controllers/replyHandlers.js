const Reply = require('../models/reply');

const ReplyHandler = {}

ReplyHandler.giveReply = async (req, res) => {
    try {
        const {
            text,
            questionId
        } = req.body;
        const reply = await Reply.create(text, questionId,req.user._id);
        res.status(200).json(reply)
    } catch (err) {
        const status = err.status || 500;
        const message = err.message || 'Something went wrong';
        res.status(status).json({
            message
        })
    }
}

ReplyHandler.upVote = async (req, res) => {
    try {
        const replyId  = req.params.id
        const userId = req.user._id
        const reply = await Reply.voteReply(replyId, userId , true)
        res.status(200).json(reply)
    } catch (err) {
        const status = err.status || 500;
        const message = err.message || 'Something went wrong';
        res.status(status).json({
            message
        })
    }
}

ReplyHandler.downVote = async (req, res) => {
    try {
        const replyId  = req.params.id
        const userId = req.user._id
        const reply = await Reply.voteReply(replyId, userId , false)
        res.status(200).json(reply)
    } catch (err) {
        const status = err.status || 500;
        const message = err.message || 'Something went wrong';
        res.status(status).json({
            message
        })
    }
}

module.exports = ReplyHandler