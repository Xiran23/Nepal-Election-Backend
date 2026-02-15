const Party = require('../models/Party');

// @desc    Get all parties
// @route   GET /api/parties
// @access  Public
const getParties = async (req, res) => {
    try {
        const parties = await Party.find().sort({ name: 1 });
        res.status(200).json(parties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single party
// @route   GET /api/parties/:id
// @access  Public
const getParty = async (req, res) => {
    try {
        const party = await Party.findById(req.params.id);
        if (!party) {
            return res.status(404).json({ message: 'Party not found' });
        }
        res.status(200).json(party);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create party
// @route   POST /api/parties
// @access  Private/Admin
const createParty = async (req, res) => {
    try {
        const party = await Party.create(req.body);
        res.status(201).json(party);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update party
// @route   PUT /api/parties/:id
// @access  Private/Admin
const updateParty = async (req, res) => {
    try {
        const party = await Party.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!party) {
            return res.status(404).json({ message: 'Party not found' });
        }
        res.status(200).json(party);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete party
// @route   DELETE /api/parties/:id
// @access  Private/Admin
const deleteParty = async (req, res) => {
    try {
        const party = await Party.findById(req.params.id);
        if (!party) {
            return res.status(404).json({ message: 'Party not found' });
        }
        await party.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getParties,
    getParty,
    createParty,
    updateParty,
    deleteParty,
};
