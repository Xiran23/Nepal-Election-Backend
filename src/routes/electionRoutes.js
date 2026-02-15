const express = require('express');
const router = express.Router();
const {
    getElections,
    getCurrentElection,
    getElection,
    createElection,
    updateElection,
    deleteElection
} = require('../controllers/electionController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getElections).post(protect, admin, createElection);
router.get('/current', getCurrentElection);
router.route('/:id').get(getElection).put(protect, admin, updateElection).delete(protect, admin, deleteElection);

module.exports = router;
