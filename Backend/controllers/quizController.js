const Quiz = require('../Models/quiz');
const Question = require('../Models/question');
const Topic = require('../Models/topic');
const { generateQuestionsForTopic } = require('../utils/generateQuestions');


const createQuiz = async (req, res) => {
  try {
    const { topicId, difficultyLevel, count } = req.body;

    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    const quiz = await Quiz.create({
      topic: topicId,
      difficultyLevel: difficultyLevel || 'beginner',
      source: 'llm-generated'
    });


    let generatedQuestions;
    try {
      generatedQuestions = await generateQuestionsForTopic(
        `${topic.subject}: ${topic.title}`,
        quiz.difficultyLevel,
        count || 10
      );
    } catch (err) {
      await Quiz.findByIdAndDelete(quiz._id);
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
      savedQuestions = await Question.insertMany(questionDocs);
    } catch (err) {
      await Quiz.findByIdAndDelete(quiz._id);
      return res.status(502).json({ message: `Saving generated questions failed: ${err.message}` });
    }

    res.status(201).json({ quiz, questions: savedQuestions });
  } catch (error) {
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



module.exports = { createQuiz, getQuizForTaking };