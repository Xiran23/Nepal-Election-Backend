const mongoose = require('mongoose');

const partySchema = new mongoose.Schema({
    name: { type: String, required: true },
    nameNepali: String,
    symbol: String, // Path to party symbol image
    symbolUrl: String,
    color: String, // Hex color code for party
    founded: Date,
    ideology: [String],
    website: String,
    leader: String,
    seatCount: { type: Number, default: 0 },
    voteCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Party', partySchema);
