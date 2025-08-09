export interface User {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'admin';
  skills: string[];
  jobRoles: string[];
  createdAt: Date;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface JobRole {
  id: string;
  title: string;
  requiredSkills: string[];
  description: string;
}

export interface Question {
  id: string;
  skill: string;
  difficulty: 'basic' | 'medium' | 'advanced';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Assessment {
  id: string;
  userId: string;
  jobRoles: string[];
  questions: Question[];
  answers: number[];
  score: number;
  skillScores: Record<string, number>;
  completedAt: Date;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  topics: string[];
  materials: string[];
  completed: boolean;
  progress: number;
}

export interface LearningPath {
  id: string;
  userId?: string;
  title: string;
  description: string;
  targetRoles: string[];
  estimatedDuration: string;
  modules: Module[];
  skillGaps: Record<string, number>;
  totalDuration?: string;
  dailyHours?: number;
  estimatedCompletion?: string;
  progress?: number;
}