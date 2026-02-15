const Election = require('../models/Election');

// @desc    Get all elections
// @route   GET /api/elections
// @access  Public
const getElections = async (req, res) => {
    try {
        const elections = await Election.find().sort({ year: -1 });
        res.status(200).json(elections);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current/ongoing election
// @route   GET /api/elections/current
// @access  Public
const getCurrentElection = async (req, res) => {
    try {
        const election = await Election.findOne({ status: 'ongoing' });
        if (!election) {
            const upcoming = await Election.findOne({ status: 'upcoming' }).sort({ startDate: 1 });
            if (upcoming) return res.status(200).json(upcoming);
            return res.status(404).json({ message: 'No active or upcoming election found' });
        }
        res.status(200).json(election);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Get single election
// @route   GET /api/elections/:id
// @access  Public
const getElection = async (req, res) => {
    try {
        const election = await Election.findById(req.params.id);
        if (!election) {
            return res.status(404).json({ message: 'Election not found' });
        }
        res.status(200).json(election);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create election
// @route   POST /api/elections
// @access  Private/Admin
const createElection = async (req, res) => {
    try {
        const election = await Election.create(req.body);
        res.status(201).json(election);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update election
// @route   PUT /api/elections/:id
// @access  Private/Admin
const updateElection = async (req, res) => {
    try {
        const election = await Election.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!election) {
            return res.status(404).json({ message: 'Election not found' });
        }
        res.status(200).json(election);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete election
// @route   DELETE /api/elections/:id
// @access  Private/Admin
const deleteElection = async (req, res) => {
    try {
        const election = await Election.findById(req.params.id);
        if (!election) {
            return res.status(404).json({ message: 'Election not found' });
        }
        await election.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getElections,
    getCurrentElection,
    getElection,
    createElection,
    updateElection,
    deleteElection,
};
