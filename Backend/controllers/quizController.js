const mongoose = require('mongoose');
const Quiz = require('../Models/quiz');
const Question = require('../Models/question');
const Topic = require('../Models/topic');
const { generateQuestionsForTopic } = require('../utils/generateQuestions');


const createQuiz = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { topicId, difficultyLevel, count } = req.body;

    const topic = await Topic.findById(topicId);
    if (!topic) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Topic not found" });
    }

    const quizArray = await Quiz.create(
      [{
        topic: topicId,
        difficultyLevel: difficultyLevel || 'beginner',
        source: 'llm-generated'
      }],
      { session }
    );

    const quiz = quizArray[0]; // Quiz.create with a session returns an array

    let generatedQuestions;
    try {
      generatedQuestions = await generateQuestionsForTopic(
        `${topic.subject}: ${topic.title}`,
        quiz.difficultyLevel,
        count || 10
      );
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      return res.status(502).json({ message: `Question generation failed: ${err.message}` });
    }

    const questionDocs = generatedQuestions.map((q) => ({
      quiz: quiz._id,
      questionText: q.questionText,
      options: q.options,
      correctAnswerIndex: q.correctAnswerIndex,
      explanation: q.explanation
    }));

    let savedQuestions;
    try {
      savedQuestions = await Question.insertMany(questionDocs, { session });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      return res.status(502).json({ message: `Saving generated questions failed: ${err.message}` });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ quiz, questions: savedQuestions });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};


const getQuizForTaking = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('topic', 'title');

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const questions = await Question.find({ quiz: quiz._id }).select(
      '-correctAnswerIndex -explanation'
    );

    if (questions.length === 0) {
      return res.status(404).json({ message: "This quiz has no questions" });
    }

    res.status(200).json({ quiz, questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getQuizzesByTopic = async (req, res) => {
  try {
    const { topic } = req.query;

    if (!topic) {
      return res.status(400).json({ message: "topic query param is required" });
    }

    const quizzes = await Quiz.find({ topic });
    res.status(200).json({ quizzes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { createQuiz, getQuizForTaking, getQuizzesByTopic };