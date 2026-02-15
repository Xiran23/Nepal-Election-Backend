const express = require('express');
const router = express.Router();
const {
    getDistricts,
    getDistrict,
    getDistrictResults,
    createDistrict,
    updateDistrict,
    deleteDistrict,
} = require('../controllers/districtController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getDistricts).post(protect, admin, createDistrict);
router.get('/:id/election-results', getDistrictResults);
router
    .route('/:id')
    .get(getDistrict)
    .put(protect, admin, updateDistrict)
    .delete(protect, admin, deleteDistrict);

module.exports = router;
