const mongoose = require('mongoose');
const { Schema } = mongoose;


const progressSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    topic: {
        type: Schema.Types.ObjectId,
        ref: "Topic",
        required: true
    },
    status: {
        type: String,
        enum: ["locked", "in_progress", "completed"],
        default: "locked"
    },
    bestScorePercentage: {
        type: Number,
        default: 0
    },
    assignmentSubmitted: {
        type: Boolean,
        default: false
    },
    unlockedAt: Date,
    completedAt: Date
}, { timestamps: true });


progressSchema.index({ user: 1, topic: 1 }, { unique: true });




module.exports = mongoose.model("Progress", progressSchema);