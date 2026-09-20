const mongoose = require('mongoose');
const { Schema } = mongoose;

const quizSchema = new Schema({
    topic: {
        type: Schema.Types.ObjectId,
        ref: "Topic",
        required: true
    },
    difficultyLevel: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        default: "beginner"
    },
    source: {
        type: String,
        enum: ["llm-generated", "manual"],
        default: "llm-generated"
    },
    status: {
        type: String,
        enum: ['published', 'draft', 'archived'],
        default: 'published'
    },
    generatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });



module.exports = mongoose.model("Quiz", quizSchema);