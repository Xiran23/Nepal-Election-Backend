const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const candidateSchema = new Schema({
    name: { type: String, required: true },
    nameNepali: String,
    party: { type: Schema.Types.ObjectId, ref: 'Party' },
    district: { type: Schema.Types.ObjectId, ref: 'District' },
    constituency: Number,
    electionYear: Number,
    electionType: { type: String, enum: ['federal', 'provincial', 'past', 'future'] },
    symbol: String,
    imageUrl: String,
    bio: String,
    age: Number,
    education: String,
    profession: String,
    votes: { type: Number, default: 0 },
    votePercentage: { type: Number, default: 0 },
    status: { type: String, enum: ['elected', 'leading', 'trailing', 'lost'], default: 'trailing' },
    margin: { type: Number, default: 0 },
    runnerUp: {
        name: String,
        party: String,
        votes: Number
    }
}, { timestamps: true });

module.exports = mongoose.model('Candidate', candidateSchema);
