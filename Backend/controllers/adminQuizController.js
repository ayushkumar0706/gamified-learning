const Quiz = require('../Models/quiz');
const Question = require('../Models/question');
const Attempt = require('../Models/attempt');
const mongoose = require('mongoose');

const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find().populate('topic', 'title subject').sort({ createdAt: -1 });
        
        // Fetch question counts
        const quizIds = quizzes.map(q => q._id);
        const questions = await Question.aggregate([
            { $match: { quiz: { $in: quizIds } } },
            { $group: { _id: '$quiz', count: { $sum: 1 } } }
        ]);
        
        const countMap = {};
        questions.forEach(q => { countMap[q._id.toString()] = q.count; });
        
        const results = quizzes.map(quiz => ({
            ...quiz.toObject(),
            questionCount: countMap[quiz._id.toString()] || 0
        }));
        
        res.status(200).json({ quizzes: results });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getQuizQuestions = async (req, res) => {
    try {
        const { id } = req.params;
        const questions = await Question.find({ quiz: id });
        res.status(200).json({ questions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateQuizStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!['published', 'draft', 'archived'].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        
        const quiz = await Quiz.findByIdAndUpdate(id, { status }, { new: true });
        if (!quiz) return res.status(404).json({ message: "Quiz not found" });
        
        res.status(200).json({ quiz });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        
        const attemptCount = await Attempt.countDocuments({ quiz: id });
        if (attemptCount > 0) {
            return res.status(400).json({ message: "Cannot hard delete a quiz with existing student attempts. Archive it instead." });
        }
        
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            await Question.deleteMany({ quiz: id }, { session });
            await Quiz.findByIdAndDelete(id, { session });
            await session.commitTransaction();
            session.endSession();
            res.status(200).json({ message: "Quiz deleted successfully" });
        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            throw err;
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addQuestion = async (req, res) => {
    try {
        const { quizId } = req.params;
        const { questionText, options, correctAnswerIndex, explanation } = req.body;
        
        const question = await Question.create({
            quiz: quizId,
            questionText,
            options,
            correctAnswerIndex,
            explanation
        });
        
        res.status(201).json({ question });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const { questionText, options, correctAnswerIndex, explanation } = req.body;
        
        const question = await Question.findByIdAndUpdate(
            questionId,
            { questionText, options, correctAnswerIndex, explanation },
            { new: true, runValidators: true }
        );
        
        if (!question) return res.status(404).json({ message: "Question not found" });
        
        res.status(200).json({ question });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const question = await Question.findByIdAndDelete(questionId);
        if (!question) return res.status(404).json({ message: "Question not found" });
        res.status(200).json({ message: "Question deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllQuizzes,
    getQuizQuestions,
    updateQuizStatus,
    deleteQuiz,
    addQuestion,
    updateQuestion,
    deleteQuestion
};
