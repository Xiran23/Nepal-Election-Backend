const District = require('../models/District');

// @desc    Get all districts
// @route   GET /api/districts
// @access  Public
const getDistricts = async (req, res) => {
    try {
        const districts = await District.find().sort({ name: 1 });
        res.status(200).json(districts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single district
// @route   GET /api/districts/:id
// @access  Public
const getDistrict = async (req, res) => {
    try {
        const { id } = req.params;
        let district;

        // Check if id is a valid MongoDB ObjectId
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            district = await District.findById(id);
        } else {
            // Otherwise, search by name (case-insensitive)
            district = await District.findOne({
                name: { $regex: new RegExp(`^${id.replace(/_/g, ' ')}$`, 'i') }
            });
        }

        if (!district) {
            return res.status(404).json({ message: 'District not found' });
        }
        res.status(200).json(district);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get election results for a district
// @route   GET /api/districts/:id/election-results
// @access  Public
const getDistrictResults = async (req, res) => {
    try {
        const { id } = req.params;
        let district;

        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            district = await District.findById(id);
        } else {
            district = await District.findOne({
                name: { $regex: new RegExp(`^${id.replace(/_/g, ' ')}$`, 'i') }
            });
        }

        if (!district) {
            return res.status(404).json({ message: 'District not found' });
        }

        const Result = require('../models/Result');
        const results = await Result.find({ district: district._id })
            .populate('winner', 'name party')
            .populate('runnerUp', 'name party');

        // Transform results into the format the frontend expects
        // (Assuming frontend expects an object with constituencies)
        res.status(200).json({
            district: district.name,
            constituencies: results
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create district
// @route   POST /api/districts
// @access  Private/Admin
const createDistrict = async (req, res) => {
    try {
        const district = await District.create(req.body);
        res.status(201).json(district);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update district
// @route   PUT /api/districts/:id
// @access  Private/Admin
const updateDistrict = async (req, res) => {
    try {
        const district = await District.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!district) {
            return res.status(404).json({ message: 'District not found' });
        }
        res.status(200).json(district);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete district
// @route   DELETE /api/districts/:id
// @access  Private/Admin
const deleteDistrict = async (req, res) => {
    try {
        const district = await District.findById(req.params.id);
        if (!district) {
            return res.status(404).json({ message: 'District not found' });
        }
        await district.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDistricts,
    getDistrict,
    getDistrictResults,
    createDistrict,
    updateDistrict,
    deleteDistrict,
};
