const Question = require('../models/question');

const QuestionHandler = {};

QuestionHandler.askQuestion = async (req, res) => {
    try {
        const {
            title,
            description,
            tag1,
            tag2,
            tag3
        } = req.body
        console.log(req.body);
        const tags = [tag1+tag2+tag3]
        const question = await Question.create(title, description, tags, req.user._id);
        // res.status(200).json(question)
        res.redirect("/question");
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
        // res.status(200).json(question)
        res.render("singlePost", {question: question});
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
        res.redirect("/question")
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
        res.redirect("/question")

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