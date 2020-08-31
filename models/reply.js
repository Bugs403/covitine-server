const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const moment = require("moment");
const { ObjectId } = mongoose.Types;
const Question = require('./question');
const errorCreator = require('../helper/errorCreator')

const replySchema = mongoose.Schema({
    text: { type: String, required: true },
    question: { type: ObjectId, ref: 'question' },
    votes: [{
        type: { type: Boolean, required: true },
        user: { type: ObjectId, required: true, ref: 'user' }
      }],
    user: { type: ObjectId, required: true, ref: 'user' },
    createdAt: { type: String, required: true, default: moment().toISOString() },
});

replySchema.plugin(uniqueValidator);
const Reply = mongoose.model("reply", replySchema);
Reply.create = async (text, questionId, userId) => {
    text = typeof (text) === 'string' && text.trim().length > 0 ? text : false
    questionId = typeof (questionId) === 'string' && mongoose.Types.ObjectId.isValid(questionId) ? questionId : false
    userId = typeof (userId) === 'string' && mongoose.Types.ObjectId.isValid(userId) ? userId : false

    if (text && questionId && userId) {
        try {
            const reply = new Reply({
                text,
                question: ObjectId(questionId),
                user: ObjectId(userId)
            });
            await Question.addReply(questionId, reply._id.toString())
            await reply.save();
            return reply
        } catch (err) {
            throw errorCreator(err.message, 500)
        }
    } else {
        throw errorCreator('Mission required fields', 400)

    }
}

Reply.edit = async (id, text) => {
    id = typeof (id) === 'string' && ObjectId.isValid(id) ? id : false
    text = typeof (text) === 'string' && text.trim().length > 0 ? text : false
    if (id && text) {
        try {
            const reply = await Reply.findById(id);
            reply.text = text;
            await reply.save();
            return reply;
        } catch (err) {
            throw errorCreator(err.message, 500)
        }
    } else {
        throw errorCreator('Mission required fields', 400)

    }
}
Reply.delete = async (id) => {
    id = typeof (id) === 'string' && ObjectId.isValid(id) ? id : false
    if (id) {
        try {
            const reply = await Reply.findById(id);
            await Question.removeReply(reply.question.toString(), reply._id.toString());
            await Reply.findByIdAndDelete(id);
            return true
        } catch (err) {
            throw errorCreator(err.message, 500)
        }
    } else {
        throw errorCreator('Mission required fields', 400)

    }
}
Reply.voteReply = async (replyId, userId, voteType) => {
    replyId = typeof (replyId) === 'string' && ObjectId.isValid(replyId) ? replyId : false
    userId = typeof (userId) === 'string' && ObjectId.isValid(userId) ? userId : false
    voteType = typeof (voteType) === 'boolean' ? voteType : -1;
    if (replyId && userId && voteType !== -1) {
        try {
            const reply = await Reply.findById(replyId).populate('user');
            const replyIndex = reply.votes.findIndex(vote => vote.user.toString() === userId);
            if (replyIndex !== -1) {
                reply.votes[replyIndex].type = voteType
            } else {
                reply.votes.push({
                    type: voteType,
                    user: ObjectId(userId)
                })
            }
            await reply.save();
            return reply;
        } catch (err) {
            throw errorCreator(err.message, 500)
        }
    } else {
        throw errorCreator('Mission required fields', 400)

    }
}
module.exports = Reply
