import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Award,
  AlertTriangle,
  Target,
  BookOpen,
  Brain,
  Zap
} from 'lucide-react';

// Define type for skillScores
type SkillScores = Record<string, number>;

// Define interface for results
interface Results {
  score: number;
  skillScores: SkillScores;
  violations: string[];
}

// Props interface
interface ResultsDashboardProps {
  results: Results;
  onGenerateCourse: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  results,
  onGenerateCourse
}) => {
  const [animatedScores, setAnimatedScores] = useState<Record<string, number>>(
    {}
  );

  useEffect(() => {
    // Animate score counters for each skill
    const skillScores = results.skillScores || {};
    const animationDuration = 2000;
    const steps = 60;
    const stepDuration = animationDuration / steps;
    // For each skill, animate the score
    Object.keys(skillScores).forEach((skill) => {
      let currentStep = 0;
      const targetScore = skillScores[skill];
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        const currentScore = Math.round(targetScore * easedProgress);

        setAnimatedScores((prev) => ({ ...prev, [skill]: currentScore }));

        if (currentStep >= steps) {
          clearInterval(interval);
        }
      }, stepDuration);
    });
    // Only run when results/skills change
  }, [JSON.stringify(results.skillScores)]);

  // Skill level colors and labels
  const getSkillLevel = (score: number) => {
    if (score >= 80)
      return {
        level: 'Expert',
        color: 'text-green-400',
        bg: 'bg-green-500/20',
        border: 'border-green-500/50'
      };
    if (score >= 60)
      return {
        level: 'Intermediate',
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/20',
        border: 'border-yellow-500/50'
      };
    return {
      level: 'Beginner',
      color: 'text-red-400',
      bg: 'bg-red-500/20',
      border: 'border-red-500/50'
    };
  };

  const getPerformanceInsight = (score: number) => {
    if (score >= 80)
      return 'Excellent performance! You have strong expertise in this area.';
    if (score >= 60)
      return 'Good foundation with room for improvement.';
    return 'This area needs focused attention and practice.';
  };

  const skillScores = results.skillScores || {};
  const overallScore = results.score || 0;
  const strongSkills = Object.entries(skillScores).filter(
    ([_, score]) => score >= 70
  );
  const weakSkills = Object.entries(skillScores).filter(
    ([_, score]) => score < 70
  );
  const violations = results.violations || [];

  // Radar Chart Data
  const radarData = Object.entries(skillScores).map(([skill, score], i, arr) => ({
    skill,
    score,
    angle: (i / arr.length) * 360
  }));

  // Radar Chart
  const RadarChart: React.FC = () => {
    const centerX = 120;
    const centerY = 120;
    const maxRadius = 100;

    const points = radarData
      .map(({ score, angle }) => {
        const radius = (score / 100) * maxRadius;
        const radian = ((angle - 90) * Math.PI) / 180;
        const x = centerX + radius * Math.cos(radian);
        const y = centerY + radius * Math.sin(radian);
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <div className="relative">
        <svg width={240} height={240} className="mx-auto">
          {/* Grid circles */}
          {[20, 40, 60, 80, 100].map((radius) => (
            <circle
              key={radius}
              cx={centerX}
              cy={centerY}
              r={(radius / 100) * maxRadius}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={1}
            />
          ))}

          {/* Grid lines */}
          {radarData.map(({ angle }, index) => {
            const radian = ((angle - 90) * Math.PI) / 180;
            const x = centerX + maxRadius * Math.cos(radian);
            const y = centerY + maxRadius * Math.sin(radian);
            return (
              <line
                key={index}
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={1}
              />
            );
          })}

          {/* Data polygon */}
          {radarData.length > 2 && (
            <polygon
              points={points}
              fill="rgba(6, 182, 212, 0.2)"
              stroke="rgb(6, 182, 212)"
              strokeWidth={2}
            />
          )}

          {/* Data points */}
          {radarData.map(({ score, angle }, index) => {
            const radius = (score / 100) * maxRadius;
            const radian = ((angle - 90) * Math.PI) / 180;
            const x = centerX + radius * Math.cos(radian);
            const y = centerY + radius * Math.sin(radian);
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r={4}
                fill="rgb(6, 182, 212)"
                className="animate-pulse"
              />
            );
          })}
        </svg>

        {/* Skill labels */}
        <div className="absolute inset-0 pointer-events-none">
          {radarData.map(({ skill, angle }, index) => {
            const labelRadius = maxRadius + 20;
            const radian = ((angle - 90) * Math.PI) / 180;
            const x = centerX + labelRadius * Math.cos(radian);
            const y = centerY + labelRadius * Math.sin(radian);
            return (
              <div
                key={index}
                className="absolute text-xs text-white/80 font-medium"
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {skill}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Assessment Results</h2>
        <p className="text-white/70">
          Comprehensive analysis of your skills and performance
        </p>
      </div>

      {/* Overall Score */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-md rounded-xl p-8 border border-cyan-500/30 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-cyan-200 text-lg">Overall Score</p>
                <p className="text-5xl font-bold text-white">{overallScore}%</p>
              </div>
              <div className="relative">
                {/* Circular Progress */}
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 96 96">
                  {/* Background */}
                  <circle
                    cx={48}
                    cy={48}
                    r={40}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth={8}
                    fill="none"
                  />
                  {/* Foreground */}
                  <circle
                    cx={48}
                    cy={48}
                    r={40}
                    stroke="url(#gradient)"
                    strokeWidth={8}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - overallScore / 100)}
                    style={{ transition: 'all 2s cubic-bezier(0.25, 1, 0.5, 1)' }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Award className="h-8 w-8 text-cyan-400" />
                </div>
              </div>
            </div>
            <p className="text-cyan-100 text-sm">
              {getPerformanceInsight(overallScore)}
            </p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-transparent rounded-full blur-xl"></div>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-xl p-6 border border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm">Strong Areas</p>
              <p className="text-3xl font-bold text-white">
                {strongSkills.length}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-6 border border-red-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-200 text-sm">Improvement Areas</p>
              <p className="text-3xl font-bold text-white">{weakSkills.length}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Skills Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Skill Breakdown */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
            <Brain className="h-6 w-6 text-cyan-400" />
            <span>Skill Breakdown</span>
          </h3>

          <div className="space-y-4">
            {Object.entries(skillScores).map(([skill, score]) => {
              const animatedScore = animatedScores[skill] ?? 0;
              const skillInfo = getSkillLevel(score);
              return (
                <div key={skill} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{skill}</span>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${skillInfo.bg} ${skillInfo.color} border ${skillInfo.border}`}
                      >
                        {skillInfo.level}
                      </span>
                      <span className="text-white font-bold">{animatedScore}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-1000 ease-out relative"
                      style={{ width: `${animatedScore}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
            <Target className="h-6 w-6 text-purple-400" />
            <span>Skills Radar</span>
          </h3>

          <RadarChart />
        </div>
      </div>

      {/* Strengths and Weaknesses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Strengths */}
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-md rounded-xl p-6 border border-green-500/30">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <Zap className="h-6 w-6 text-green-400" />
            <span>Your Strengths</span>
          </h3>

          {strongSkills.length > 0 ? (
            <div className="space-y-3">
              {strongSkills.map(([skill, score]) => (
                <div
                  key={skill}
                  className="flex items-center justify-between p-3 bg-green-500/20 rounded-lg border border-green-500/30"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-white font-medium">{skill}</span>
                  </div>
                  <span className="text-green-400 font-bold">{score}%</span>
                </div>
              ))}
              <div className="mt-4 p-3 bg-green-500/10 rounded-lg">
                <p className="text-green-200 text-sm">
                  Great job! These are your strongest areas. Consider mentoring others or taking on advanced projects in these skills.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-white/70">
              No strong areas identified. Focus on improving your skills through targeted learning.
            </p>
          )}
        </div>

        {/* Weaknesses */}
        <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-md rounded-xl p-6 border border-red-500/30">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-red-400" />
            <span>Areas for Improvement</span>
          </h3>

          {weakSkills.length > 0 ? (
            <div className="space-y-3">
              {weakSkills.map(([skill, score]) => (
                <div
                  key={skill}
                  className="flex items-center justify-between p-3 bg-red-500/20 rounded-lg border border-red-500/30"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <span className="text-white font-medium">{skill}</span>
                  </div>
                  <span className="text-red-400 font-bold">{score}%</span>
                </div>
              ))}
              <div className="mt-4 p-3 bg-red-500/10 rounded-lg">
                <p className="text-red-200 text-sm">
                  These areas need focused attention. Our AI will generate personalized learning paths to help you improve.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-white/70">
              Excellent! No significant weak areas identified.
            </p>
          )}
        </div>
      </div>

      {/* Proctoring Report */}
      {violations.length > 0 && (
        <div className="bg-yellow-500/10 backdrop-blur-md rounded-xl p-6 border border-yellow-500/30 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-yellow-400" />
            <span>Proctoring Report</span>
          </h3>

          <div className="space-y-2">
            {violations.map((violation, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 bg-yellow-500/20 rounded-lg">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-yellow-200 text-sm">{violation}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-yellow-500/20 rounded-lg">
            <p className="text-yellow-200 text-sm">
              {violations.length} violation(s) detected during the assessment. This information has been recorded for review.
            </p>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="text-center">
        <button
          onClick={onGenerateCourse}
          className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] text-lg flex items-center space-x-2 mx-auto"
        >
          <BookOpen className="h-6 w-6" />
          <span>Generate Personalized Learning Path</span>
        </button>
      </div>
    </div>
  );
};
