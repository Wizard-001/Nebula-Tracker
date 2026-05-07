const express = require('express');
const router = express.Router();
const {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  updateApplicationStatus
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getApplications).post(protect, createApplication);
router.route('/:id').put(protect, updateApplication).delete(protect, deleteApplication);
router.route('/:id/status').put(protect, updateApplicationStatus);

module.exports = router;
