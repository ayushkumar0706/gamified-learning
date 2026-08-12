const mongoose = require('mongoose');
const { Schema } = mongoose;

const questionSchema = new Schema({
    quiz: {
        type: Schema.Types.ObjectId,
        ref: "Quiz",
        required: true
    },
    questionText: {
        type: String,
        required: true,
        trim: true
    },
    options: {
        type: [String],
        required: true,
        validate: {
            validator: function (arr) {
                const trimmed = arr.map(o => o.trim());
                const isRightSize = trimmed.length >= 2 && trimmed.length <= 6;
                const noDuplicates = new Set(trimmed).size === trimmed.length;
                return isRightSize && noDuplicates;
            },
            message: "Options must be 2-6 items with no duplicates"
        }
    },
    correctAnswerIndex: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                return value >= 0 && value < this.options.length;
            },
            message: "correctAnswerIndex must point to a valid option"
        }
    },
    explanation: {
        type: String,
        trim: true
    }
}, { timestamps: true });





module.exports = mongoose.model("Question", questionSchema);