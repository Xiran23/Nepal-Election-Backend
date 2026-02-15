const express = require('express');
const router = express.Router();
const {
    getParties,
    getParty,
    createParty,
    updateParty,
    deleteParty
} = require('../controllers/partyController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getParties).post(protect, admin, createParty);
router.route('/:id').get(getParty).put(protect, admin, updateParty).delete(protect, admin, deleteParty);

module.exports = router;
