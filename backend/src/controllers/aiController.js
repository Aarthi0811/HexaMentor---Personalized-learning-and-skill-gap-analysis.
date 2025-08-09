const aiService = require('../services/aiService');
const logger = require('../utils/logger');

const aiController = {
    async generateQuestions(req, res) {
        try {
            const { jobRoles, skills, difficultyLevels, count } = req.body;

            // Validate required fields
            if (!jobRoles || !Array.isArray(jobRoles) || jobRoles.length === 0) {
                return res.status(400).json({
                    error: 'jobRoles is required and must be a non-empty array'
                });
            }

            if (!skills || !Array.isArray(skills) || skills.length === 0) {
                return res.status(400).json({
                    error: 'skills is required and must be a non-empty array'
                });
            }

            const result = await aiService.generateQuestions(
                jobRoles,
                skills,
                difficultyLevels || ['basic', 'medium', 'advanced'],
                count || 10
            );

            res.json(result);
        } catch (error) {
            logger.error('Error in generateQuestions controller:', error.message);
            res.status(500).json({
                error: 'Failed to generate questions',
                message: error.message
            });
        }
    },

    async generateLearningPath(req, res) {
        try {
            const { assessmentResults, targetRoles, experienceLevel, timeCommitment } = req.body;

            // Validate required fields
            if (!assessmentResults || typeof assessmentResults !== 'object') {
                return res.status(400).json({
                    error: 'assessmentResults is required and must be an object'
                });
            }

            if (!targetRoles || !Array.isArray(targetRoles) || targetRoles.length === 0) {
                return res.status(400).json({
                    error: 'targetRoles is required and must be a non-empty array'
                });
            }

            const result = await aiService.generateLearningPath(
                assessmentResults,
                targetRoles,
                experienceLevel || 'beginner',
                timeCommitment || '2-3 hours per week'
            );

            res.json(result);
        } catch (error) {
            logger.error('Error in generateLearningPath controller:', error.message);
            res.status(500).json({
                error: 'Failed to generate learning path',
                message: error.message
            });
        }
    },

    async getAvailableSkills(req, res) {
        try {
            const skills = await aiService.getAvailableSkills();
            res.json({ skills });
        } catch (error) {
            logger.error('Error in getAvailableSkills controller:', error.message);
            res.status(500).json({
                error: 'Failed to fetch available skills',
                message: error.message
            });
        }
    },

    async getAvailableJobRoles(req, res) {
        try {
            const jobRoles = await aiService.getAvailableJobRoles();
            res.json({ jobRoles });
        } catch (error) {
            logger.error('Error in getAvailableJobRoles controller:', error.message);
            res.status(500).json({
                error: 'Failed to fetch available job roles',
                message: error.message
            });
        }
    },

    async healthCheck(req, res) {
        try {
            const aiServiceHealth = await aiService.checkAIServiceHealth();
            res.json({
                backend: { status: 'healthy' },
                aiService: aiServiceHealth
            });
        } catch (error) {
            logger.error('Error in healthCheck controller:', error.message);
            res.status(500).json({
                backend: { status: 'healthy' },
                aiService: { status: 'unhealthy', error: error.message }
            });
        }
    }
};

module.exports = aiController;