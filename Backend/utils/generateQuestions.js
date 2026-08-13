const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const validateQuestionShape = (q) => {
  if (typeof q.questionText !== 'string' || !q.questionText.trim()) {
    return "Missing or invalid questionText";
  }
  if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 6) {
    return "Options must be an array of 2-6 items";
  }
  const uniqueOptions = new Set(q.options.map((o) => o.trim()));
  if (uniqueOptions.size !== q.options.length) {
    return "Options contain duplicates";
  }
  if (
    typeof q.correctAnswerIndex !== 'number' ||
    q.correctAnswerIndex < 0 ||
    q.correctAnswerIndex >= q.options.length
  ) {
    return "correctAnswerIndex is invalid or out of bounds";
  }
  return null;
};


const generateQuestionsForTopic = async (topicName, difficulty, count = 10) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

  const prompt = `
Generate ${count} multiple-choice quiz questions on the topic "${topicName}" for ${difficulty}-level students.

Return ONLY valid JSON, no markdown formatting, no code fences, no extra text.
Return an array of objects in this exact shape:
[
  {
    "questionText": "string",
    "options": ["string", "string", "string", "string"],
    "correctAnswerIndex": 0,
    "explanation": "string"
  }
]
`;


  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  const cleaned = responseText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  let questions;
  try {
    questions = JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Gemini returned invalid JSON: ${err.message}`);
  }

  const validQuestions = [];
  questions.forEach((q) => {
    const error = validateQuestionShape(q);
    if (!error) {
      validQuestions.push(q);
    }
  });

  if (validQuestions.length === 0) {
    throw new Error("No valid questions were generated");
  }

  return validQuestions;
};



module.exports = { generateQuestionsForTopic };