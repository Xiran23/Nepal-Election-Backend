const Result = require('../models/Result');
const Election = require('../models/Election');

// @desc    Get all results
// @route   GET /api/results
// @access  Public
const getResults = async (req, res) => {
    try {
        const results = await Result.find()
            .populate('district', 'name')
            .populate('winner', 'name party')
            .populate('runnerUp', 'name party');
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get results by district
// @route   GET /api/results/district/:districtId
// @access  Public
const getResultsByDistrict = async (req, res) => {
    try {
        const results = await Result.find({ district: req.params.districtId })
            .populate('winner', 'name party')
            .populate('runnerUp', 'name party');
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create/Update result
// @route   POST /api/results
// @access  Private/Admin
const createResult = async (req, res) => {
    try {
        const { district, constituency, electionYear } = req.body;

        let result = await Result.findOne({ district, constituency, electionYear });

        if (result) {
            result = await Result.findByIdAndUpdate(result._id, req.body, { new: true })
                .populate('district', 'name')
                .populate('winner', 'name party symbols') // symbols instead of symbol to match front? will Check
                .populate('runnerUp', 'name party');

            req.io.emit('result_updated', result);
            res.status(200).json(result);
        } else {
            result = await Result.create(req.body);
            result = await Result.findById(result._id)
                .populate('district', 'name')
                .populate('winner', 'name party')
                .populate('runnerUp', 'name party');

            req.io.emit('result_created', result);
            res.status(201).json(result);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get live results (e.g., last 10 updates)
// @route   GET /api/results/live
// @access  Public
const getLiveResults = async (req, res) => {
    try {
        const results = await Result.find()
            .sort({ lastUpdated: -1 })
            .limit(10)
            .populate('district', 'name')
            .populate('winner', 'name party')
            .populate('runnerUp', 'name party');
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get national summary statistics
// @route   GET /api/results/national-summary
// @access  Public
const getNationalSummary = async (req, res) => {
    try {
        const results = await Result.find()
            .populate({
                path: 'winner',
                populate: { path: 'party', select: 'name color' }
            });

        const summary = {
            totalSeats: 275,
            counted: results.length,
            parties: {},
            lastUpdated: new Date()
        };

        results.forEach(r => {
            if (r.winner && r.winner.party) {
                const party = r.winner.party;
                const partyName = party.name || 'Others';

                if (!summary.parties[partyName]) {
                    summary.parties[partyName] = {
                        seats: 0,
                        color: party.color || '#94A3B8'
                    };
                }
                summary.parties[partyName].seats += 1;
            }
        });

        res.status(200).json(summary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getResults,
    getResultsByDistrict,
    getLiveResults,
    getNationalSummary,
    createResult
};
