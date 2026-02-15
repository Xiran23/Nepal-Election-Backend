const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resultSchema = new Schema({
    district: { type: Schema.Types.ObjectId, ref: 'District' },
    constituency: Number,
    electionYear: Number,
    electionType: String,
    candidates: [{
        candidate: { type: Schema.Types.ObjectId, ref: 'Candidate' },
        votes: Number,
        percentage: Number,
        position: Number
    }],
    winner: { type: Schema.Types.ObjectId, ref: 'Candidate' },
    runnerUp: { type: Schema.Types.ObjectId, ref: 'Candidate' },
    margin: Number,
    totalVotes: Number,
    rejectedVotes: Number,
    turnout: Number,
    lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);
