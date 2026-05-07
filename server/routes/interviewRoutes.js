const express = require('express');
const router = express.Router();
const multer = require('multer');
const { startInterview, evaluateAnswer } = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

// Set up multer for memory storage (optional resume upload)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

router.post('/start', protect, upload.single('resume'), startInterview);
router.post('/evaluate', protect, evaluateAnswer);

module.exports = router;
