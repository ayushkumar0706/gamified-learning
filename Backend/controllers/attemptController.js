const Question = require('../Models/question');
const Attempt = require('../Models/attempt');
const Quiz = require('../Models/quiz');
const User = require('../Models/user');
const Progress = require('../Models/progress');
const { calculateLevel } = require('../utils/xpToLevel');


const checkAnswer = async (req, res) => {
  try {
    const { questionId, selectedIndex } = req.body;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const isCorrect = question.correctAnswerIndex === selectedIndex;

    res.status(200).json({
      isCorrect,
      explanation: question.explanation
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const submitAttempt = async (req, res) => {
  try {
    const { quizId, answers, timeTakenSeconds } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const questionIds = answers.map((a) => a.question);
    const realQuestions = await Question.find({ _id: { $in: questionIds } });

    const verifiedAnswers = answers.map((a) => {
      const realQuestion = realQuestions.find((q) => q._id.toString() === a.question);
      return {
        question: a.question,
        selectedIndex: a.selectedIndex,
        isCorrect: realQuestion ? realQuestion.correctAnswerIndex === a.selectedIndex : false
      };
    });

    const correctCount = verifiedAnswers.filter((a) => a.isCorrect).length;
    const scorePercentage = Math.round((correctCount / verifiedAnswers.length) * 100);
    const xpAwarded = correctCount * 10;

    const attempt = await Attempt.create({
      user: req.user._id,
      quiz: quizId,
      scorePercentage,
      xpAwarded,
      timeTakenSeconds,
      answers: verifiedAnswers
    });

    // Update XP and level together
    const user = await User.findById(req.user._id);
    user.xp += xpAwarded;

    const levelInfo = calculateLevel(user.xp);
    user.level = levelInfo.level;

    await user.save();

    
    // Update Progress for this topic
    const progress = await Progress.findOneAndUpdate(
      { user: req.user._id, topic: quiz.topic },
      {
        $max: { bestScorePercentage: scorePercentage },
        $setOnInsert: { user: req.user._id, topic: quiz.topic }
      },
      { upsert: true, new: true }
    );

    if (scorePercentage >= 70 && progress.status !== "completed") {
      progress.status = "completed";
      progress.completedAt = new Date();
      await progress.save();
    } else if (progress.status === "not-started") {
      progress.status = "in-progress";
      await progress.save();
    }

    res.status(201).json({
      attempt,
      correctCount,
      totalQuestions: verifiedAnswers.length,
      levelInfo,
      progress
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { checkAnswer, submitAttempt };