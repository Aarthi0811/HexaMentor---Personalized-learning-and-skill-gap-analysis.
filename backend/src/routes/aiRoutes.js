const express = require('express');
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// AI Question Generation Routes
router.post('/generate-questions', authMiddleware, aiController.generateQuestions);
router.post('/generate-learning-path', authMiddleware, aiController.generateLearningPath);

// Reference Data Routes
router.get('/skills', aiController.getAvailableSkills);
router.get('/job-roles', aiController.getAvailableJobRoles);

// Health Check
router.get('/health', aiController.healthCheck);

module.exports = router;