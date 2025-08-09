import React, { useState } from 'react';
import { CheckCircle, Clock, Play, Award, BookOpen, Target, TrendingUp } from 'lucide-react';
import { LearningPath } from '../../types';

interface ProgressTrackerProps {
  learningPath: LearningPath | null;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ learningPath }) => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  if (!learningPath) {
    return (
      <div className="p-8 text-center">
        <BookOpen className="h-16 w-16 text-white/50 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Learning Path Yet</h3>
        <p className="text-white/70">Complete the previous steps to see your progress tracking.</p>
      </div>
    );
  }

  const completedModules = learningPath.modules.filter(m => m.completed).length;
  const overallProgress = Math.round((completedModules / learningPath.modules.length) * 100);

  const getStatusColor = (progress: number) => {
    if (progress === 100) return 'text-green-400';
    if (progress > 0) return 'text-yellow-400';
    return 'text-white/50';
  };

  const getStatusBg = (progress: number) => {
    if (progress === 100) return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
    if (progress > 0) return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
    return 'from-white/5 to-white/10 border-white/20';
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Learning Progress</h2>
        <p className="text-white/70">Track your journey and celebrate achievements</p>
      </div>

      {/* Overall Progress */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-xl p-6 border border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Overall Progress</p>
              <p className="text-3xl font-bold text-white">{overallProgress}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-xl p-6 border border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm">Completed</p>
              <p className="text-3xl font-bold text-white">{completedModules}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-md rounded-xl p-6 border border-orange-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-200 text-sm">In Progress</p>
              <p className="text-3xl font-bold text-white">
                {learningPath.modules.filter(m => m.progress > 0 && !m.completed).length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-orange-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Total Modules</p>
              <p className="text-3xl font-bold text-white">{learningPath.modules.length}</p>
            </div>
            <Target className="h-8 w-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8">
        <h3 className="text-xl font-semibold text-white mb-6">Learning Timeline</h3>
        
        <div className="space-y-6">
          {learningPath.modules.map((module, index) => (
            <div key={module.id} className="relative">
              <div className="flex items-center space-x-4">
                {/* Timeline dot */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  module.completed 
                    ? 'border-green-500 bg-green-500/20' 
                    : module.progress > 0 
                    ? 'border-yellow-500 bg-yellow-500/20' 
                    : 'border-white/30 bg-white/10'
                }`}>
                  {module.completed ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : module.progress > 0 ? (
                    <Clock className="h-4 w-4 text-yellow-400" />
                  ) : (
                    <span className="text-white/50 text-sm font-bold">{index + 1}</span>
                  )}
                </div>
                
                {/* Module info */}
                <div 
                  className={`flex-1 p-4 rounded-lg border cursor-pointer transition-all bg-gradient-to-r ${getStatusBg(module.progress)}`}
                  onClick={() => setSelectedModule(selectedModule === module.id ? null : module.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white mb-1">{module.title}</h4>
                      <p className="text-white/70 text-sm mb-2">{module.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-cyan-400" />
                          <span className="text-white/80">{module.duration}</span>
                        </span>
                        <span className={`font-semibold ${getStatusColor(module.progress)}`}>
                          {module.progress}% Complete
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {!module.completed && (
                        <button className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg border border-cyan-500/30 transition-colors">
                          <Play className="h-4 w-4 text-cyan-400" />
                        </button>
                      )}
                      {module.completed && (
                        <div className="p-2 bg-green-500/20 rounded-lg border border-green-500/30">
                          <Award className="h-4 w-4 text-green-400" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${module.progress}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Expanded details */}
                  {selectedModule === module.id && (
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-white font-medium mb-2">Topics:</h5>
                          <ul className="space-y-1">
                            {module.topics.map((topic, topicIndex) => (
                              <li key={topicIndex} className="text-white/70 text-sm flex items-center space-x-2">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                                <span>{topic}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-white font-medium mb-2">Materials:</h5>
                          <ul className="space-y-1">
                            {module.materials.map((material, materialIndex) => (
                              <li key={materialIndex} className="text-white/70 text-sm flex items-center space-x-2">
                                <BookOpen className="h-3 w-3 text-purple-400" />
                                <span>{material}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex space-x-3">
                        <button className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 rounded-lg border border-cyan-500/30 transition-colors text-sm">
                          Continue Learning
                        </button>
                        <button className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 rounded-lg border border-purple-500/30 transition-colors text-sm">
                          Take Test
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Timeline line */}
              {index < learningPath.modules.length - 1 && (
                <div className="absolute left-4 top-8 w-0.5 h-6 bg-white/20"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30">
        <div className="flex items-center space-x-2 mb-4">
          <Award className="h-6 w-6 text-yellow-400" />
          <h3 className="text-xl font-semibold text-white">Achievements</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-lg border text-center ${
            completedModules >= 1 ? 'bg-yellow-500/20 border-yellow-500/50' : 'bg-white/10 border-white/20'
          }`}>
            <Award className={`h-8 w-8 mx-auto mb-2 ${
              completedModules >= 1 ? 'text-yellow-400' : 'text-white/30'
            }`} />
            <p className={`text-sm font-semibold ${
              completedModules >= 1 ? 'text-yellow-200' : 'text-white/50'
            }`}>
              First Step
            </p>
          </div>
          
          <div className={`p-4 rounded-lg border text-center ${
            completedModules >= 3 ? 'bg-orange-500/20 border-orange-500/50' : 'bg-white/10 border-white/20'
          }`}>
            <Target className={`h-8 w-8 mx-auto mb-2 ${
              completedModules >= 3 ? 'text-orange-400' : 'text-white/30'
            }`} />
            <p className={`text-sm font-semibold ${
              completedModules >= 3 ? 'text-orange-200' : 'text-white/50'
            }`}>
              On Track
            </p>
          </div>
          
          <div className={`p-4 rounded-lg border text-center ${
            overallProgress >= 75 ? 'bg-green-500/20 border-green-500/50' : 'bg-white/10 border-white/20'
          }`}>
            <TrendingUp className={`h-8 w-8 mx-auto mb-2 ${
              overallProgress >= 75 ? 'text-green-400' : 'text-white/30'
            }`} />
            <p className={`text-sm font-semibold ${
              overallProgress >= 75 ? 'text-green-200' : 'text-white/50'
            }`}>
              Almost There
            </p>
          </div>
          
          <div className={`p-4 rounded-lg border text-center ${
            overallProgress === 100 ? 'bg-purple-500/20 border-purple-500/50' : 'bg-white/10 border-white/20'
          }`}>
            <CheckCircle className={`h-8 w-8 mx-auto mb-2 ${
              overallProgress === 100 ? 'text-purple-400' : 'text-white/30'
            }`} />
            <p className={`text-sm font-semibold ${
              overallProgress === 100 ? 'text-purple-200' : 'text-white/50'
            }`}>
              Complete
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};