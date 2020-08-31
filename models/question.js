const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { ObjectId } = mongoose.Types;
const moment = require("moment");
const errorCreator = require("../helper/errorCreator");
const questionSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [String],
  replies: [{ type: ObjectId, required: true, ref: "reply" }],
  votes: [
    {
      type: { type: Boolean, required: true },
      user: { type: ObjectId, required: true, ref: "user" }
    }
  ],
  creator: { type: ObjectId, ref: "user" },
  createdAt: { type: String, required: true, default: moment().toISOString() }
});

questionSchema.plugin(uniqueValidator);
const Question = mongoose.model("question", questionSchema);
Question.create = async (title, description, tags, creator) => {
  title = typeof title === "string" && title.trim().length > 0 ? title : false;
  description =
    typeof description === "string" && description.trim().length > 0
      ? description
      : false;
  tags = Array.isArray(tags) && tags.length > 0 ? tags : false;
  creator =
    typeof creator === "string" && mongoose.Types.ObjectId.isValid(creator)
      ? creator
      : false;
  if (title && description && tags && creator) {
    try {
      const question = new Question({
        title,
        description,
        tags,
        creator
      });
      await question.save();
      return question;
    } catch (err) {
      throw errorCreator(err.message, 500);
    }
  } else {
    throw errorCreator("Mission required fields", 400);
  }
};
Question.edit = async (id, title, description, tags) => {
  id =
    typeof id === "string" && mongoose.Types.ObjectId.isValid(id) ? id : false;
  title = typeof title === "string" && title.trim().length > 0 ? title : false;
  description =
    typeof description === "string" && description.trim().length > 0
      ? description
      : false;
  tags = Array.isArray(tags) && tags.length > 0 ? tags : false;

  if (id) {
    if (title || description || tags) {
      try {
        const question = await Question.findById(id);
        if (title) {
          question.title = title;
        }
        if (description) {
          question.description = description;
        }
        if (tags) {
          question.tags = tags;
        }
        await question.save();
        return question;
      } catch (err) {
        throw errorCreator(err.message, 500);
      }
    } else {
      throw errorCreator("Nothing passed to change", 400);
    }
  } else {
    throw errorCreator("Mission required fields", 400);
  }
};
Question.deleteQuestion = async id => {
  id =
    typeof id === "string" && mongoose.Types.ObjectId.isValid(id) ? id : false;
  if (id) {
    try {
      await Question.findByIdAndDelete(id);
      return true;
    } catch (err) {
      throw errorCreator(err.message, 500);
    }
  } else {
    throw errorCreator("Mission required fields", 400);
  }
};

Question.findQuestion = async id => {
  id =
    typeof id === "string" && mongoose.Types.ObjectId.isValid(id) ? id : false;
  if (id) {
    try {
      const question = await Question.findById(id)
        .populate({ path: "creator", select: "-password" })
        .populate({path:"replies",populate:{path:"user"}});
      return question;
    } catch (err) {
      throw errorCreator(err.message, 500);
    }
  } else {
    throw errorCreator("Mission required fields", 400);
  }
};
//{title:new RegExp(req.query.search || "", 'i')}

Question.searchQuestion = async (search, pageSize, currentPage) => {
  search = typeof search === "string" && search.trim().length > 0 ? search : "";

  pageSize = typeof pageSize === "number" ? pageSize : 0;
  currentPage = typeof currentPage === "number" ? currentPage : 100;

  try {
    const questions = await Question.find({ title: new RegExp(search, "i") })
      .populate({ path: "creator", select: "-password" })
      .sort({ field: "asc", _id: -1 })
      .skip(currentPage * pageSize)
      .limit(pageSize);
    return questions;
  } catch (err) {
    throw errorCreator(err.message, 500);
  }
};

Question.addReply = async (questionId, replyId) => {
  questionId =
    typeof questionId === "string" &&
    mongoose.Types.ObjectId.isValid(questionId)
      ? questionId
      : false;
  replyId =
    typeof replyId === "string" && mongoose.Types.ObjectId.isValid(replyId)
      ? replyId
      : false;
  if (questionId && replyId) {
    try {
      const question = await Question.findById(questionId);
      question.replies.push(ObjectId(replyId));
      await question.save();
      return true;
    } catch (err) {
      throw errorCreator(err.message, 500);
    }
  } else {
    throw errorCreator("Mission required fields", 400);
  }
};

Question.removeReply = async (questionId, replyId) => {
  questionId =
    typeof questionId === "string" &&
    mongoose.Types.ObjectId.isValid(questionId)
      ? questionId
      : false;
  replyId =
    typeof replyId === "string" && mongoose.Types.ObjectId.isValid(replyId)
      ? replyId
      : false;
  if (questionId && replyId) {
    try {
      const question = await Question.findById(questionId);
      const replyIndex = question.replies.findIndex(
        reply => reply._id.toString() === replyId
      );
      if (replyIndex === -1) {
        throw errorCreator("Reply Not Found", 400);
      }
      question.replies.splice(replyIndex, 1);
      await question.save();
      return true;
    } catch (err) {
      throw errorCreator(err.message, 500);
    }
  } else {
    throw errorCreator("Mission required fields", 400);
  }
};
Question.voteQuestion = async (questionId, userId, voteType) => {
  questionId =
    typeof questionId === "string" &&
    mongoose.Types.ObjectId.isValid(questionId)
      ? questionId
      : false;
  userId =
    typeof userId === "string" && mongoose.Types.ObjectId.isValid(userId)
      ? userId
      : false;
  voteType = typeof voteType === "boolean" ? voteType : -1;
  if (questionId && userId && voteType !== -1) {
    try {
      const question = await Question.findById(questionId)      
      .populate({ path: "creator", select: "-password" })
      .populate({path:"replies",populate:{path:"user"}});;
      const voteIndex = question.votes.findIndex(
        vote => vote.user.toString() === userId
      );
      if (voteIndex !== -1) {
        question.votes[voteIndex].type = voteType;
      } else {
        question.votes.push({
          type: voteType,
          user: ObjectId(userId)
        });
      }
      await question.save();
      return question;
    } catch (err) {
      throw errorCreator(err.message, 500);
    }
  } else {
    throw errorCreator("Mission required fields", 400);
  }
};
module.exports = Question;
