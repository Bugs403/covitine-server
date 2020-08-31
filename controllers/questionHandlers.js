const Question = require('../models/question');

const QuestionHandler = {};

QuestionHandler.askQuestion = async (req, res) => {
    try {
        const {
            title,
            description,
            tags
        } = req.body
        const question = await Question.create(title, description, tags, req.user._id);
        res.status(200).json(question)
    } catch (err) {
        const status = err.status || 500;
        const message = err.message || 'Something went wrong';
        res.status(status).json({
            message
        })
    }
}
QuestionHandler.getQuestion = async (req, res) => {
    try {
        const question = await Question.findQuestion(req.params.id);
        res.status(200).json(question)
    } catch (err) {
        const status = err.status || 500;
        const message = err.message || 'Something went wrong';
        res.status(status).json({
            message
        })
    }
}

QuestionHandler.upVote = async (req, res) => {
    try {
        const question = await Question.voteQuestion(req.params.id, req.user._id, true)
        res.status(200).json(question)
    } catch (err) {
        const status = err.status || 500;
        const message = err.message || 'Something went wrong';
        res.status(status).json({
            message
        })
    }
}


QuestionHandler.downVote = async (req, res) => {
    try {
        const question = await Question.voteQuestion(req.params.id, req.user._id, false)
        res.status(200).json(question)
    } catch (err) {
        const status = err.status || 500;
        const message = err.message || 'Something went wrong';
        res.status(status).json({
            message
        })
    }
}

QuestionHandler.search = async (req, res) => {
    try {
        const search = req.query.search;
        const pageSize = req.query.pagesize;
        const currentPage = req.query.page;
        const questions = await Question.searchQuestion(search, pageSize, currentPage);
        res.status(200).json(questions);
    } catch (err) {
        const status = err.status || 500;
        const message = err.message || 'Something went wrong';
        res.status(status).json({
            message
        })
    }

}

module.exports = QuestionHandler