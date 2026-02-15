const express = require('express');
const router = express.Router();
const {
    getCandidates,
    getCandidate,
    getCandidatesByParty,
    getCandidatesByConstituency,
    createCandidate,
    updateCandidate,
    deleteCandidate,
} = require('../controllers/candidateController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getCandidates).post(protect, admin, createCandidate);
router.route('/constituency/:districtId/:constituencyNo').get(getCandidatesByConstituency);
router.route('/party/:partyId').get(getCandidatesByParty);
router
    .route('/:id')
    .get(getCandidate)
    .put(protect, admin, updateCandidate)
    .delete(protect, admin, deleteCandidate);

module.exports = router;
