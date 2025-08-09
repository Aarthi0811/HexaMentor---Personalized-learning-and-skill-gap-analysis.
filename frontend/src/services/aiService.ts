import { Question, LearningPath } from '../types';

interface QuestionRequest {
  jobRoles: string[];
  skills: string[];
  difficultyLevels?: string[];
  count?: number;
}

interface LearningPathRequest {
  assessmentResults: Record<string, number>;
  targetRoles: string[];
  experienceLevel?: string;
  timeCommitment?: string;
}

interface QuestionResponse {
  questions: Question[];
  metadata: {
    generated_count: number;
    requested_count: number;
    jobRoles: string[];
    skills: string[];
    source?: string;
  };
}

interface LearningPathResponse {
  learning_path: LearningPath;
  recommendations: string[];
  metadata: {
    assessment_skills: string[];
    target_roles: string[];
    experience_level: string;
    modules_count: number;
    source?: string;
  };
}

class AIService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  }

  setAuthToken(token: string) {
    this.token = token;
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  async generateQuestions(request: QuestionRequest): Promise<QuestionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/ai/generate-questions`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          jobRoles: request.jobRoles,
          skills: request.skills,
          difficultyLevels: request.difficultyLevels || ['basic', 'medium', 'advanced'],
          count: request.count || 10,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating questions:', error);
      
      // Return fallback questions on error
      return this.getFallbackQuestions(request);
    }
  }

  async generateLearningPath(request: LearningPathRequest): Promise<LearningPathResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/ai/generate-learning-path`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          assessmentResults: request.assessmentResults,
          targetRoles: request.targetRoles,
          experienceLevel: request.experienceLevel || 'beginner',
          timeCommitment: request.timeCommitment || '2-3 hours per week',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating learning path:', error);
      
      // Return fallback learning path on error
      return this.getFallbackLearningPath(request);
    }
  }

  async getAvailableSkills(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/ai/skills`, {
        headers: this.getHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.skills;
    } catch (error) {
      console.error('Error fetching available skills:', error);
      return this.getFallbackSkills();
    }
  }

  async getAvailableJobRoles(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/ai/job-roles`, {
        headers: this.getHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.jobRoles;
    } catch (error) {
      console.error('Error fetching available job roles:', error);
      return this.getFallbackJobRoles();
    }
  }

  async checkHealth(): Promise<{ backend: any; aiService: any }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/ai/health`, {
        headers: this.getHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking health:', error);
      throw error;
    }
  }

  // Fallback methods for offline/error scenarios
  private getFallbackQuestions(request: QuestionRequest): QuestionResponse {
    const fallbackQuestions: Question[] = [
      {
        id: 'fallback-1',
        skill: 'JavaScript',
        difficulty: 'basic',
        question: 'What is the correct way to declare a variable in JavaScript?',
        options: ['var myVar = 5;', 'variable myVar = 5;', 'v myVar = 5;', 'declare myVar = 5;'],
        correctAnswer: 0,
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
        correctAnswer: 1,
        explanation: 'JSX is a syntax extension for JavaScript that allows you to write HTML-like code in React.'
      },
      {
        id: 'fallback-3',
        skill: 'Python',
        difficulty: 'basic',
        question: 'Which of the following is the correct way to create a list in Python?',
        options: ['list = (1, 2, 3)', 'list = [1, 2, 3]', 'list = {1, 2, 3}', 'list = <1, 2, 3>'],
        correctAnswer: 1,
        explanation: 'Lists in Python are created using square brackets [].'
      }
    ];

    // Filter by requested skills
    const filteredQuestions = request.skills.length > 0 
      ? fallbackQuestions.filter(q => request.skills.includes(q.skill))
      : fallbackQuestions;

    return {
      questions: filteredQuestions.slice(0, request.count || 10),
      metadata: {
        generated_count: Math.min(filteredQuestions.length, request.count || 10),
        requested_count: request.count || 10,
        jobRoles: request.jobRoles,
        skills: request.skills,
        source: 'fallback'
      }
    };
  }

  private getFallbackLearningPath(request: LearningPathRequest): LearningPathResponse {
    // Identify weak skills
    const weakSkills = Object.entries(request.assessmentResults)
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

    const learningPath: LearningPath = {
      id: 'fallback-learning-path-1',
      title: `Learning Path for ${request.targetRoles.join(', ')}`,
      description: 'Fallback learning path based on assessment results',
      targetRoles: request.targetRoles,
      estimatedDuration: '6-8 weeks',
      modules: modules,
      skillGaps: Object.fromEntries(
        Object.entries(request.assessmentResults).filter(([_, score]) => score < 70)
      )
    };

    return {
      learning_path: learningPath,
      recommendations: [
        'Focus on hands-on practice',
        'Build projects to reinforce learning',
        'Practice coding daily'
      ],
      metadata: {
        assessment_skills: Object.keys(request.assessmentResults),
        target_roles: request.targetRoles,
        experience_level: request.experienceLevel || 'beginner',
        modules_count: modules.length,
        source: 'fallback'
      }
    };
  }

  private getFallbackSkills(): string[] {
    return [
      'JavaScript', 'Python', 'React', 'Node.js', 'Express.js',
      'TypeScript', 'HTML/CSS', 'Git', 'Database Design', 'SQL',
      'MongoDB', 'PostgreSQL', 'API Development', 'Testing'
    ];
  }

  private getFallbackJobRoles(): string[] {
    return [
      'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
      'React Developer', 'Node.js Developer', 'Python Developer',
      'Software Engineer', 'Web Developer'
    ];
  }
}

export const aiService = new AIService();