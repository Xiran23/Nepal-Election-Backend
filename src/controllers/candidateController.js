const Candidate = require('../models/Candidate');
const Party = require('../models/Party');
const District = require('../models/District');

// @desc    Get all candidates
// @route   GET /api/candidates
// @access  Public
const getCandidates = async (req, res) => {
    try {
        const { district, constituency, party } = req.query;
        let query = {};

        if (district) query.district = district;
        if (constituency) query.constituency = constituency;
        if (party) query.party = party;

        const candidates = await Candidate.find(query)
            .populate('party', 'name symbol color')
            .populate('district', 'name province')
            .sort({ name: 1 });
        res.status(200).json(candidates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get candidates by constituency
// @route   GET /api/candidates/constituency/:districtId/:constituencyNo
// @access  Public
const getCandidatesByConstituency = async (req, res) => {
    try {
        const { districtId, constituencyNo } = req.params;
        const candidates = await Candidate.find({
            district: districtId,
            constituency: constituencyNo
        })
            .populate('party', 'name symbol color')
            .populate('district', 'name province')
            .sort({ votes: -1 });
        res.status(200).json(candidates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single candidate
// @route   GET /api/candidates/:id
// @access  Public
const getCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id)
            .populate('party', 'name symbol color')
            .populate('district', 'name province');

        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        res.status(200).json(candidate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get candidates by party
// @route   GET /api/candidates/party/:partyId
// @access  Public
const getCandidatesByParty = async (req, res) => {
    try {
        const candidates = await Candidate.find({ party: req.params.partyId })
            .populate('party', 'name symbol color')
            .populate('district', 'name province');
        res.status(200).json(candidates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create candidate
// @route   POST /api/candidates
// @access  Private/Admin
const createCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.create(req.body);
        const populatedCandidate = await Candidate.findById(candidate._id)
            .populate('party', 'name symbol color')
            .populate('district', 'name province');

        req.io.emit('candidate_created', populatedCandidate);
        res.status(201).json(populatedCandidate);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update candidate
// @route   PUT /api/candidates/:id
// @access  Private/Admin
const updateCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).populate('party', 'name symbol color')
            .populate('district', 'name province');

        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        req.io.emit('candidate_updated', candidate);
        res.status(200).json(candidate);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete candidate
// @route   DELETE /api/candidates/:id
// @access  Private/Admin
const deleteCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        await candidate.deleteOne();
        req.io.emit('candidate_deleted', req.params.id);
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCandidates,
    getCandidate,
    getCandidatesByParty,
    getCandidatesByConstituency,
    createCandidate,
    updateCandidate,
    deleteCandidate,
};
