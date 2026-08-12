const mongoose = require('mongoose');
const { Schema } = mongoose;

const attemptSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    quiz: {
        type: Schema.Types.ObjectId,
        ref: "Quiz",
        required: true
    },
    scorePercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    xpAwarded: {
        type: Number,
        required: true,
        default: 0
    },
    timeTakenSeconds: {
        type: Number,
        required: true,
        min: 0
    },
    answers: [{
        question: {
            type: Schema.Types.ObjectId,
            ref: "Question"
        },
        selectedIndex: Number,
        isCorrect: Boolean
    }]
}, { timestamps: true });




module.exports = mongoose.model("Attempt", attemptSchema);