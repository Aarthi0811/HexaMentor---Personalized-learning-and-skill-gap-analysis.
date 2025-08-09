import React, { useState, useEffect } from 'react';
import { Clock, BookOpen, Play, CheckCircle, Settings, Calendar, Loader, AlertTriangle } from 'lucide-react';
import { Module, LearningPath } from '../../types';
import { aiService } from '../../services/aiService';

interface LearningPathGeneratorProps {
  results: any;
  selectedJobRoles: string[];
  onPathGenerated: (path: LearningPath) => void;
}

// This function is now replaced by AI-powered generation

export const LearningPathGenerator: React.FC<LearningPathGeneratorProps> = ({ 
  results, 
  selectedJobRoles, 
  onPathGenerated 
}) => {
  const [dailyHours, setDailyHours] = useState(2);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingPath, setIsLoadingPath] = useState(false);
  const [pathError, setPathError] = useState<string | null>(null);
  const [generatedPath, setGeneratedPath] = useState<LearningPath | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  // Show loading state while generating learning path
  if (isLoadingPath) {
    return (
      <div className="p-8 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Loader className="h-16 w-16 text-cyan-400 mx-auto mb-4 animate-spin" />
            <h2 className="text-3xl font-bold text-white mb-4">Generating Your Learning Path</h2>
            <p className="text-white/70 text-lg mb-6">
              AI is creating a personalized learning journey based on your assessment results and target roles: {selectedJobRoles.join(', ')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if learning path generation failed
  if (pathError) {
    return (
      <div className="p-8 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Learning Path Generation Failed</h2>
            <p className="text-white/70 text-lg mb-6">{pathError}</p>
            <button
              onClick={() => setPathError(null)}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-200 mr-4"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const generateLearningPath = async () => {
    setIsGenerating(true);
    setIsLoadingPath(true);
    setPathError(null);
    
    try {
      // Map daily hours to time commitment string
      const timeCommitmentMap: Record<number, string> = {
        1: '1-2 hours per week',
        2: '2-3 hours per week',
        3: '3-4 hours per week',
        4: '4-5 hours per week'
      };
      
      const timeCommitment = timeCommitmentMap[dailyHours] || `${dailyHours} hours per week`;
      
      const response = await aiService.generateLearningPath({
        assessmentResults: results.skillScores,
        targetRoles: selectedJobRoles,
        experienceLevel: 'beginner', // Can be made configurable
        timeCommitment: timeCommitment
      });
      
      const learningPath: LearningPath = {
        ...response.learning_path,
        userId: 'current-user',
        dailyHours,
        progress: 0
      };
      
      setGeneratedPath(learningPath);
      setRecommendations(response.recommendations);
      onPathGenerated(learningPath);
      
    } catch (error) {
      console.error('Failed to generate learning path:', error);
      setPathError('Failed to generate learning path. Please try again.');
    } finally {
      setIsGenerating(false);
      setIsLoadingPath(false);
    }
  };

  if (generatedPath) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Your Learning Path</h2>
          <p className="text-white/70">Personalized roadmap to achieve your career goals</p>
        </div>

        {/* Path Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-md rounded-xl p-6 border border-cyan-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-200 text-sm">Total Duration</p>
                <p className="text-2xl font-bold text-white">{generatedPath.totalDuration}</p>
              </div>
              <Clock className="h-8 w-8 text-cyan-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Daily Commitment</p>
                <p className="text-2xl font-bold text-white">{generatedPath.dailyHours}h/day</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-xl p-6 border border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm">Completion Target</p>
                <p className="text-lg font-bold text-white">{generatedPath.estimatedCompletion}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        {recommendations.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">AI Recommendations</h3>
            <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-xl p-6">
              <div className="grid gap-3">
                {recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                    <p className="text-white/80 text-sm">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Interactive Learning Modules */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white">Learning Modules</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {generatedPath.modules.map((module, index) => (
              <div key={module.id} className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden hover:bg-white/15 transition-all group">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500">
                        <span className="text-white font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">{module.title}</h4>
                        <p className="text-white/70 text-sm">{module.duration}</p>
                      </div>
                    </div>
                    <Play className="h-6 w-6 text-cyan-400 group-hover:text-cyan-300 transition-colors cursor-pointer" />
                  </div>
                  
                  <p className="text-white/80 text-sm mb-4">{module.description}</p>
                  
                  {/* Topics */}
                  <div className="mb-4">
                    <h5 className="text-white font-medium text-sm mb-2">Topics Covered:</h5>
                    <div className="flex flex-wrap gap-2">
                      {module.topics.slice(0, 3).map((topic, topicIndex) => (
                        <span key={topicIndex} className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/80">
                          {topic}
                        </span>
                      ))}
                      {module.topics.length > 3 && (
                        <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/80">
                          +{module.topics.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 text-sm">Progress</span>
                      <span className="text-white/70 text-sm">{module.progress}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${module.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Start Learning Button */}
        <div className="text-center mt-8">
          <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] text-lg">
            Start Learning Journey
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Generate Learning Path</h2>
        <p className="text-white/70">Customize your learning journey based on your preferences</p>
      </div>

      {/* Customization Options */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8">
        <div className="flex items-center space-x-2 mb-6">
          <Settings className="h-6 w-6 text-cyan-400" />
          <h3 className="text-xl font-semibold text-white">Customize Your Path</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white font-medium mb-2">Daily Study Time</label>
            <select
              value={dailyHours}
              onChange={(e) => setDailyHours(Number(e.target.value))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent"
            >
              <option value={1} className="bg-gray-900">1 hour/day</option>
              <option value={2} className="bg-gray-900">2 hours/day</option>
              <option value={3} className="bg-gray-900">3 hours/day</option>
              <option value={4} className="bg-gray-900">4 hours/day</option>
            </select>
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Preferred Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Assessment Summary */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Assessment Results</h3>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(results.skillScores || {}).map(([skill, score]) => (
              <div key={skill} className="text-center">
                <h4 className="text-white font-medium text-sm mb-2">{skill}</h4>
                <div className="relative">
                  <div className="w-16 h-16 mx-auto mb-2">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={score < 50 ? "#ef4444" : score < 70 ? "#f59e0b" : "#10b981"}
                        strokeWidth="2"
                        strokeDasharray={`${score}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-bold text-xs">{score}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Preferences */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-6 mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="h-6 w-6 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Your Learning Preferences</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-purple-400">{dailyHours}h</p>
            <p className="text-white/70 text-sm">Daily Commitment</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-400">{selectedJobRoles.join(', ')}</p>
            <p className="text-white/70 text-sm">Target Roles</p>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="text-center">
        <button
          onClick={generateLearningPath}
          disabled={isGenerating}
          className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          {isGenerating ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Generating Your Path...</span>
            </div>
          ) : (
            'Generate Personalized Learning Path'
          )}
        </button>
      </div>
    </div>
  );
};