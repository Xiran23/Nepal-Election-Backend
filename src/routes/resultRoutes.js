const express = require('express');
const router = express.Router();
const {
    getResults,
    getResultsByDistrict,
    getLiveResults,
    getNationalSummary,
    createResult
} = require('../controllers/resultController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getResults).post(protect, admin, createResult);
router.route('/live').get(getLiveResults);
router.route('/national-summary').get(getNationalSummary);
router.route('/district/:districtId').get(getResultsByDistrict);

module.exports = router;
