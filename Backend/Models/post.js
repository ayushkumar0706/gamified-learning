const mongoose = require('mongoose');
const { Schema } = mongoose;

const replySchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const postSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  college: {
    type: Schema.Types.ObjectId,
    ref: 'College',
    required: true
  },
  channel: {
    type: String,
    required: true,
    enum: ['all', 'interview-prep', 'dsa-doubts', 'project-showcase', 'placements', 'referrals']
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  tags: [{
    type: String,
    trim: true
  }],
  upvotes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  replies: [replySchema]
}, { timestamps: true });

// Indexes for faster querying
postSchema.index({ college: 1, channel: 1, createdAt: -1 });
postSchema.index({ college: 1, upvotes: -1 }); // For trending sorting

module.exports = mongoose.model('Post', postSchema);
