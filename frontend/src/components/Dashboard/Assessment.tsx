import React, { useState, useEffect } from 'react';
import { Clock, Shield, AlertTriangle, CheckCircle, X, Loader } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { Question } from '../../types';

interface AssessmentProps {
  selectedJobRoles: string[];
  onComplete: (results: any) => void;
}

// Get skills based on job roles
const getSkillsForJobRoles = (jobRoles: string[]): string[] => {
  const skillMapping: Record<string, string[]> = {
    'Frontend Developer': ['JavaScript', 'React', 'HTML/CSS', 'TypeScript'],
    'Backend Developer': ['Node.js', 'Python', 'Database Design', 'API Development'],
    'Full Stack Developer': ['JavaScript', 'React', 'Node.js', 'Database Design', 'API Development'],
    'React Developer': ['JavaScript', 'React', 'TypeScript', 'HTML/CSS'],
    'Python Developer': ['Python', 'Database Design', 'API Development'],
    'Software Engineer': ['JavaScript', 'Python', 'Algorithms', 'System Design'],
    'Web Developer': ['JavaScript', 'HTML/CSS', 'React', 'Node.js']
  };

  const skills = new Set<string>();
  jobRoles.forEach(role => {
    const roleSkills = skillMapping[role] || ['JavaScript', 'HTML/CSS'];
    roleSkills.forEach(skill => skills.add(skill));
  });

  return Array.from(skills);
};

export const Assessment: React.FC<AssessmentProps> = ({ selectedJobRoles, onComplete }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [questionsError, setQuestionsError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [isProctoring, setIsProctoring] = useState(false);
  const [violations, setViolations] = useState<string[]>([]);
  const [isStarted, setIsStarted] = useState(false);

  // Generate AI-powered questions when component mounts
  useEffect(() => {
    const generateAIQuestions = async () => {
      setIsLoadingQuestions(true);
      setQuestionsError(null);
      
      try {
        const skills = getSkillsForJobRoles(selectedJobRoles);
        const response = await aiService.generateQuestions({
          jobRoles: selectedJobRoles,
          skills: skills,
          difficultyLevels: ['basic', 'medium', 'advanced'],
          count: 10
        });
        
        setQuestions(response.questions);
      } catch (error) {
        console.error('Failed to generate questions:', error);
        setQuestionsError('Failed to load assessment questions. Please try again.');
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    generateAIQuestions();
  }, [selectedJobRoles]);

  useEffect(() => {
    if (!isStarted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitAssessment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted]);

  useEffect(() => {
    if (!isProctoring) return;

    // Simulate proctoring features
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setViolations(prev => [...prev, `Tab switched at ${new Date().toLocaleTimeString()}`]);
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setViolations(prev => [...prev, `Exited fullscreen at ${new Date().toLocaleTimeString()}`]);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isProctoring]);

  const startAssessment = async () => {
    setIsProctoring(true);
    
    // Request fullscreen
    try {
      await document.documentElement.requestFullscreen();
    } catch (error) {
      console.log('Fullscreen not supported');
    }
    
    setIsStarted(true);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmitAssessment(newAnswers);
    }
  };

  const handleSubmitAssessment = (finalAnswers = answers) => {
    setIsProctoring(false);
    
    // Exit fullscreen
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }

    // Calculate results
    let totalScore = 0;
    const skillScores: Record<string, { correct: number; total: number }> = {};

    questions.forEach((question, index) => {
      const isCorrect = finalAnswers[index] === question.correctAnswer;
      if (isCorrect) totalScore++;

      if (!skillScores[question.skill]) {
        skillScores[question.skill] = { correct: 0, total: 0 };
      }
      skillScores[question.skill].total++;
      if (isCorrect) skillScores[question.skill].correct++;
    });

    const results = {
      totalQuestions: questions.length,
      correctAnswers: totalScore,
      score: Math.round((totalScore / questions.length) * 100),
      skillScores: Object.entries(skillScores).reduce((acc, [skill, scores]) => {
        acc[skill] = Math.round((scores.correct / scores.total) * 100);
        return acc;
      }, {} as Record<string, number>),
      violations,
      completedAt: new Date(),
      answers: finalAnswers,
      questions
    };

    onComplete(results);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Show loading state while generating questions
  if (isLoadingQuestions) {
    return (
      <div className="p-8 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Loader className="h-16 w-16 text-cyan-400 mx-auto mb-4 animate-spin" />
            <h2 className="text-3xl font-bold text-white mb-4">Generating Your Assessment</h2>
            <p className="text-white/70 text-lg mb-6">
              AI is creating personalized questions based on your selected job roles: {selectedJobRoles.join(', ')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if question generation failed
  if (questionsError) {
    return (
      <div className="p-8 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Assessment Unavailable</h2>
            <p className="text-white/70 text-lg mb-6">{questionsError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="p-8 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Shield className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">AI-Powered Assessment Ready</h2>
            <p className="text-white/70 text-lg mb-6">
              Your personalized assessment with {questions.length} AI-generated questions is ready. The system will monitor your activity for integrity.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Assessment Guidelines</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-cyan-400" />
                <span className="text-white/80">Duration: 30 minutes</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-white/80">Questions adapt based on your performance</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-yellow-400" />
                <span className="text-white/80">Proctoring enabled - stay focused on this tab</span>
              </div>
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <span className="text-white/80">Switching tabs or exiting fullscreen will be recorded</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-8">
            <p className="text-yellow-200 text-sm">
              <AlertTriangle className="h-4 w-4 inline mr-2" />
              This assessment will enter fullscreen mode and monitor your activity. Make sure you're in a quiet environment.
            </p>
          </div>

          <button
            onClick={startAssessment}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] text-lg"
          >
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Shield className="h-8 w-8 text-green-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Adaptive Assessment</h2>
            <p className="text-white/70">Question {currentQuestion + 1} of {questions.length}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          {violations.length > 0 && (
            <div className="flex items-center space-x-2 text-red-400">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">{violations.length} violation(s)</span>
            </div>
          )}
          <div className="flex items-center space-x-2 text-cyan-400">
            <Clock className="h-5 w-5" />
            <span className="text-xl font-mono">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 mb-8">
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-200 rounded-full text-sm">
              {currentQ.skill}
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-sm">
              {currentQ.difficulty}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-white leading-relaxed">
            {currentQ.question}
          </h3>
        </div>

        <div className="space-y-4">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                selectedAnswer === index
                  ? 'bg-gradient-to-r from-cyan-500/30 to-purple-500/30 border-cyan-500/50 text-white'
                  : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10 hover:border-white/30'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedAnswer === index ? 'border-cyan-400 bg-cyan-400/20' : 'border-white/40'
                }`}>
                  {selectedAnswer === index && <CheckCircle className="h-4 w-4 text-cyan-400" />}
                </div>
                <span className="flex-1">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <button
          onClick={handleNextQuestion}
          disabled={selectedAnswer === null}
          className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQuestion === questions.length - 1 ? 'Submit Assessment' : 'Next Question'}
        </button>
      </div>
    </div>
  );
};