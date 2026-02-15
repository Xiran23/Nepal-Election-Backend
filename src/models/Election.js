const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const electionSchema = new Schema({
    year: { type: Number, required: true },
    type: { type: String, enum: ['federal', 'provincial', 'local'] },
    startDate: Date,
    endDate: Date,
    status: { type: String, enum: ['upcoming', 'ongoing', 'completed'] },
    totalVoters: Number,
    totalVotesCast: Number,
    voterTurnout: Number,
    constituencies: [{
        district: { type: Schema.Types.ObjectId, ref: 'District' },
        number: Number,
        candidates: [{ type: Schema.Types.ObjectId, ref: 'Candidate' }],
        result: {
            winner: { type: Schema.Types.ObjectId, ref: 'Candidate' },
            margin: Number,
            totalVotes: Number
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Election', electionSchema);
