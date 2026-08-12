const mongoose = require('mongoose')
const { Schema } = mongoose

const topicSchema = new Schema({
    
    level: {
        type: Schema.Types.ObjectId,
        ref: "Level",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String
    },
    order: {
        type: Number,
        required: true
    },
    prerequisiteTopic: {
        type: Schema.Types.ObjectId,
        ref: "Topic",
        default: null
    }
}, {timestamps: true});





module.exports = mongoose.model("Topic", topicSchema);