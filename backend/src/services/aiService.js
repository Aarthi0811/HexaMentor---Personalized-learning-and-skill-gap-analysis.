const axios = require('axios');
const logger = require('../utils/logger');

class AIService {
    constructor() {
        this.aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8001';
    }

    async generateQuestions(jobRoles, skills, difficultyLevels = ['basic', 'medium', 'advanced'], count = 10) {
        try {
            logger.info(`Generating ${count} questions for roles: ${jobRoles.join(', ')}, skills: ${skills.join(', ')}`);
            
            const response = await axios.post(`${this.aiServiceUrl}/api/v1/generate-questions`, {
                job_roles: jobRoles,
                skills: skills,
                difficulty_levels: difficultyLevels,
                count: count
            }, {
                timeout: 30000, // 30 seconds timeout
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            logger.error('Error generating questions:', error.message);
            
            // Return fallback questions if AI service is unavailable
            if (error.code === 'ECONNREFUSED' || error.response?.status >= 500) {
                logger.warn('AI service unavailable, returning fallback questions');
                return this.getFallbackQuestions(skills, count);
            }
            
            throw new Error(`Failed to generate questions: ${error.message}`);
        }
    }

    async generateLearningPath(assessmentResults, targetRoles, experienceLevel = 'beginner', timeCommitment = '2-3 hours per week') {
        try {
            logger.info(`Generating learning path for roles: ${targetRoles.join(', ')}`);
            
            const response = await axios.post(`${this.aiServiceUrl}/api/v1/generate-learning-path`, {
                assessment_results: assessmentResults,
                target_roles: targetRoles,
                current_experience_level: experienceLevel,
                time_commitment: timeCommitment
            }, {
                timeout: 30000, // 30 seconds timeout
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            logger.error('Error generating learning path:', error.message);
            
            // Return fallback learning path if AI service is unavailable
            if (error.code === 'ECONNREFUSED' || error.response?.status >= 500) {
                logger.warn('AI service unavailable, returning fallback learning path');
                return this.getFallbackLearningPath(assessmentResults, targetRoles);
            }
            
            throw new Error(`Failed to generate learning path: ${error.message}`);
        }
    }

    async getAvailableSkills() {
        try {
            const response = await axios.get(`${this.aiServiceUrl}/api/v1/skills`, {
                timeout: 10000
            });
            return response.data.skills;
        } catch (error) {
            logger.error('Error fetching available skills:', error.message);
            return this.getFallbackSkills();
        }
    }

    async getAvailableJobRoles() {
        try {
            const response = await axios.get(`${this.aiServiceUrl}/api/v1/job-roles`, {
                timeout: 10000
            });
            return response.data.job_roles;
        } catch (error) {
            logger.error('Error fetching available job roles:', error.message);
            return this.getFallbackJobRoles();
        }
    }

    async checkAIServiceHealth() {
        try {
            const response = await axios.get(`${this.aiServiceUrl}/api/v1/health`, {
                timeout: 5000
            });
            return response.data;
        } catch (error) {
            logger.error('AI service health check failed:', error.message);
            return { status: 'unhealthy', error: error.message };
        }
    }

    // Fallback methods for when AI service is unavailable
    getFallbackQuestions(skills, count) {
        const fallbackQuestions = [
            {
                id: 'fallback-1',
                skill: 'JavaScript',
                difficulty: 'basic',
                question: 'What is the correct way to declare a variable in JavaScript?',
                options: ['var myVar = 5;', 'variable myVar = 5;', 'v myVar = 5;', 'declare myVar = 5;'],
                correct_answer: 0,
                explanation: 'Variables in JavaScript can be declared using var, let, or const keywords.'
            },
            {
                id: 'fallback-2',
                skill: 'React',
                difficulty: 'basic',
                question: 'What is JSX?',
                options: [
                    'A JavaScript library',
                    'A syntax extension for JavaScript',
                    'A database query language',
                    'A CSS framework'
                ],
                correct_answer: 1,
                explanation: 'JSX is a syntax extension for JavaScript that allows you to write HTML-like code in React.'
            },
            {
                id: 'fallback-3',
                skill: 'Python',
                difficulty: 'basic',
                question: 'Which of the following is the correct way to create a list in Python?',
                options: ['list = (1, 2, 3)', 'list = [1, 2, 3]', 'list = {1, 2, 3}', 'list = <1, 2, 3>'],
                correct_answer: 1,
                explanation: 'Lists in Python are created using square brackets [].'
            }
        ];

        // Filter by requested skills and limit count
        const filteredQuestions = skills.length > 0 
            ? fallbackQuestions.filter(q => skills.includes(q.skill))
            : fallbackQuestions;

        return {
            questions: filteredQuestions.slice(0, count),
            metadata: {
                generated_count: Math.min(filteredQuestions.length, count),
                requested_count: count,
                skills: skills,
                source: 'fallback'
            }
        };
    }

    getFallbackLearningPath(assessmentResults, targetRoles) {
        // Identify weak skills
        const weakSkills = Object.entries(assessmentResults)
            .filter(([_, score]) => score < 70)
            .map(([skill]) => skill);

        const modules = weakSkills.map((skill, index) => ({
            id: `fallback-module-${index + 1}`,
            title: `Master ${skill}`,
            description: `Comprehensive course covering ${skill} from basics to advanced concepts`,
            duration: '2-3 weeks',
            topics: [
                `${skill} Fundamentals`,
                `Advanced ${skill} Concepts`,
                `${skill} Best Practices`,
                `Real-world ${skill} Projects`
            ],
            materials: [
                'Interactive tutorials',
                'Video lectures',
                'Hands-on exercises',
                'Code challenges'
            ],
            completed: false,
            progress: 0
        }));

        return {
            learning_path: {
                id: 'fallback-learning-path-1',
                title: `Learning Path for ${targetRoles.join(', ')}`,
                description: 'Fallback learning path based on assessment results',
                target_roles: targetRoles,
                estimated_duration: '6-8 weeks',
                modules: modules,
                skill_gaps: Object.fromEntries(
                    Object.entries(assessmentResults).filter(([_, score]) => score < 70)
                )
            },
            recommendations: [
                'Focus on hands-on practice',
                'Build projects to reinforce learning',
                'Practice coding daily'
            ],
            metadata: {
                source: 'fallback',
                modules_count: modules.length
            }
        };
    }

    getFallbackSkills() {
        return [
            'JavaScript', 'Python', 'React', 'Node.js', 'Express.js',
            'TypeScript', 'HTML/CSS', 'Git', 'Database Design', 'SQL',
            'MongoDB', 'PostgreSQL', 'API Development', 'Testing'
        ];
    }

    getFallbackJobRoles() {
        return [
            'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
            'React Developer', 'Node.js Developer', 'Python Developer',
            'Software Engineer', 'Web Developer'
        ];
    }
}

module.exports = new AIService();