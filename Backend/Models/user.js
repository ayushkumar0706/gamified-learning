const mongoose = require('mongoose');
const hashPassword = require('../utils/hashPassword');
const jwt = require('jsonwebtoken');
const { Schema } = mongoose;

const userSchema = new Schema({

    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    age: {
        type: Number,
        min: 14,
        max: 30
    },
    gender: {
        type: String,
        enum: ["male", "female", "others"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        immutable: true
    },
    password: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        default: "default-avatar.png"
    },
    xp: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    streak: {
        type: Number,
        default: 0
    },
    lastActiveDate: {
        type: Date
    },
    role: {
        type: String,
        enum: ["student", "senior", "admin"],
        default: "student"
    },
    currentStreak: { 
        type: Number,
        default: 0
    },
    lastActivityDate: { 
        type: Date,
        default: null
    },
    maxStreak: { 
        type: Number, 
        default: 0 
    }

}, {timestamps: true});


userSchema.methods.getJWT = function(){
    const token = jwt.sign({_id: this._id, role: this.role}, process.env.JWT_SECRET, { expiresIn: '7d'});
    return token;
}


userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    this.password = await hashPassword(this.password);
    // next();
});






module.exports = mongoose.model("User", userSchema);