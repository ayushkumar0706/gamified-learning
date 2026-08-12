
const mongoose = require('mongoose');
const { Schema } = mongoose;


const levelSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String
  },
  order: {
    type: Number,
    required: true,
    unique: true
  }
}, { timestamps: true });



module.exports = mongoose.model("Level", levelSchema);