const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: String,
    role: { type: String, enum: ['admin', 'editor', 'viewer'], default: 'viewer' },
    permissions: [String],
    lastLogin: Date
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
