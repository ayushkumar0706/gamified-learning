const mongoose = require('mongoose');
const { Schema } = mongoose;


const videoResourceSchema = new Schema({
    topic: {
        type: Schema.Types.ObjectId,
        ref: "Topic",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        required: true,
        trim: true
    },
    submittedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    styleTag: {
        type: String,
        enum: ["visual", "lecture-style", "example-heavy", "text-based", "animated"],
        required: true
    },
    difficulty: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        default: "beginner"
    },
    upvotes: {
        type: Number,
        default: 0
    },
    upvotedBy: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    reportCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["active", "flagged", "removed"],
        default: "active"
    }
}, { timestamps: true });




module.exports = mongoose.model("VideoResource", videoResourceSchema);