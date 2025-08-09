import React, { useState } from 'react';
import { Layout } from '../Layout';
import { SkillSelection } from './SkillSelection';
import { Assessment } from './Assessment';
import {ResultsDashboard} from './ResultsDashboard';
import { LearningPathGenerator } from './LearningPathGenerator';
import { ProgressTracker } from './ProgressTracker';
import { BookOpen, Target, TrendingUp, Award, Clock, CheckCircle } from 'lucide-react';

type DashboardStep = 'skills' | 'assessment' | 'results' | 'courses' | 'progress';

export const EmployeeDashboard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<DashboardStep>('skills');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedJobRoles, setSelectedJobRoles] = useState<string[]>([]);
  const [assessmentResults, setAssessmentResults] = useState<any>(null);
  const [generatedPath, setGeneratedPath] = useState<any>(null);

  const steps = [
    { id: 'skills', title: 'Skills & Roles', icon: Target, completed: selectedSkills.length > 0 },
    { id: 'assessment', title: 'Assessment', icon: BookOpen, completed: assessmentResults !== null },
    { id: 'results', title: 'Results', icon: TrendingUp, completed: assessmentResults !== null },
    { id: 'courses', title: 'Learning Path', icon: Award, completed: generatedPath !== null },
    { id: 'progress', title: 'Progress', icon: CheckCircle, completed: false },
  ];

  const renderContent = () => {
    switch (currentStep) {
      case 'skills':
        return (
          <SkillSelection
            selectedSkills={selectedSkills}
            setSelectedSkills={setSelectedSkills}
            selectedJobRoles={selectedJobRoles}
            setSelectedJobRoles={setSelectedJobRoles}
            onNext={() => setCurrentStep('assessment')}
          />
        );
      case 'assessment':
        return (
          <Assessment
            selectedJobRoles={selectedJobRoles}
            onComplete={(results) => {
              setAssessmentResults(results);
              setCurrentStep('results');
            }}
          />
        );
      case 'results':
        return (
          <ResultsDashboard
            results={assessmentResults}
            onGenerateCourse={() => setCurrentStep('courses')}
          />
        );
      case 'courses':
        return (
          <LearningPathGenerator
            results={assessmentResults}
            selectedJobRoles={selectedJobRoles}
            onPathGenerated={(path) => {
              setGeneratedPath(path);
              setCurrentStep('progress');
            }}
          />
        );
      case 'progress':
        return <ProgressTracker learningPath={generatedPath} />;
      default:
        return null;
    }
  };

  return (
    <Layout title="Employee Dashboard">
      <div className="space-y-8">
        {/* Progress Steps */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = step.completed;
              
              return (
                <React.Fragment key={step.id}>
                  <div 
                    className={`flex flex-col items-center space-y-2 cursor-pointer transition-all ${
                      isActive ? 'text-cyan-400' : isCompleted ? 'text-green-400' : 'text-white/50'
                    }`}
                    onClick={() => {
                      if (index === 0 || steps[index - 1].completed) {
                        setCurrentStep(step.id as DashboardStep);
                      }
                    }}
                  >
                    <div className={`p-3 rounded-full border-2 transition-all ${
                      isActive 
                        ? 'border-cyan-400 bg-cyan-400/20' 
                        : isCompleted 
                        ? 'border-green-400 bg-green-400/20' 
                        : 'border-white/30 bg-white/10'
                    }`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-medium">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-400' : 'bg-white/20'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-md rounded-xl p-6 border border-cyan-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-200 text-sm">Skills Selected</p>
                <p className="text-2xl font-bold text-white">{selectedSkills.length}</p>
              </div>
              <Target className="h-8 w-8 text-cyan-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Job Roles</p>
                <p className="text-2xl font-bold text-white">{selectedJobRoles.length}</p>
              </div>
              <Award className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-xl p-6 border border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm">Assessment Score</p>
                <p className="text-2xl font-bold text-white">{assessmentResults?.score || 0}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-md rounded-xl p-6 border border-orange-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-200 text-sm">Study Time</p>
                <p className="text-2xl font-bold text-white">2h/day</p>
              </div>
              <Clock className="h-8 w-8 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 min-h-[600px]">
          {renderContent()}
        </div>
      </div>
    </Layout>
  );
};