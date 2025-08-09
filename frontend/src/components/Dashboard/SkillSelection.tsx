import React, { useState } from 'react';
import { Search, Plus, X, Code, Database, Globe, Smartphone, Cloud, Shield } from 'lucide-react';

interface SkillSelectionProps {
  selectedSkills: string[];
  setSelectedSkills: (skills: string[]) => void;
  selectedJobRoles: string[];
  setSelectedJobRoles: (roles: string[]) => void;
  onNext: () => void;
}

const skillCategories = [
  {
    category: 'Frontend',
    icon: Globe,
    skills: ['React', 'Angular', 'Vue.js', 'JavaScript', 'TypeScript', 'CSS', 'HTML', 'Tailwind CSS']
  },
  {
    category: 'Backend',
    icon: Database,
    skills: ['Node.js', 'Python', 'Java', 'C#', 'Go', 'PHP', 'Express.js', 'FastAPI']
  },
  {
    category: 'Mobile',
    icon: Smartphone,
    skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Xamarin', 'Ionic']
  },
  {
    category: 'Cloud & DevOps',
    icon: Cloud,
    skills: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform']
  },
  {
    category: 'Security',
    icon: Shield,
    skills: ['Cybersecurity', 'Penetration Testing', 'OWASP', 'Cryptography', 'Network Security']
  },
  {
    category: 'Data Science',
    icon: Code,
    skills: ['Machine Learning', 'Data Analysis', 'Python', 'R', 'SQL', 'Tableau', 'TensorFlow']
  }
];

const jobRoles = [
  { id: 'fullstack', title: 'Full Stack Developer', skills: ['React', 'Node.js', 'JavaScript', 'Database'] },
  { id: 'frontend', title: 'Frontend Developer', skills: ['React', 'JavaScript', 'CSS', 'HTML'] },
  { id: 'backend', title: 'Backend Developer', skills: ['Node.js', 'Python', 'Database', 'API'] },
  { id: 'mobile', title: 'Mobile Developer', skills: ['React Native', 'Flutter', 'iOS', 'Android'] },
  { id: 'devops', title: 'DevOps Engineer', skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins'] },
  { id: 'data', title: 'Data Scientist', skills: ['Python', 'Machine Learning', 'SQL', 'Statistics'] },
  { id: 'security', title: 'Security Engineer', skills: ['Cybersecurity', 'Network Security', 'Penetration Testing'] },
];

export const SkillSelection: React.FC<SkillSelectionProps> = ({
  selectedSkills,
  setSelectedSkills,
  selectedJobRoles,
  setSelectedJobRoles,
  onNext,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'skills' | 'roles'>('skills');

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const toggleJobRole = (roleId: string) => {
    if (selectedJobRoles.includes(roleId)) {
      setSelectedJobRoles(selectedJobRoles.filter(r => r !== roleId));
    } else {
      setSelectedJobRoles([...selectedJobRoles, roleId]);
    }
  };

  const filteredCategories = skillCategories.map(category => ({
    ...category,
    skills: category.skills.filter(skill =>
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.skills.length > 0);

  const filteredJobRoles = jobRoles.filter(role =>
    role.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          {activeTab === 'skills' ? 'Select Your Skills' : 'Choose Target Job Roles'}
        </h2>
        <p className="text-white/70">
          {activeTab === 'skills' 
            ? 'Choose the skills you currently have or want to learn' 
            : 'Select the job roles you\'re targeting for personalized recommendations'
          }
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('skills')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'skills'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
              : 'bg-white/10 text-white/70 hover:text-white'
          }`}
        >
          Skills ({selectedSkills.length})
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'roles'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
              : 'bg-white/10 text-white/70 hover:text-white'
          }`}
        >
          Job Roles ({selectedJobRoles.length})
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent"
        />
      </div>

      {/* Selected Items */}
      {(selectedSkills.length > 0 || selectedJobRoles.length > 0) && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">
            Selected {activeTab === 'skills' ? 'Skills' : 'Job Roles'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {activeTab === 'skills' && selectedSkills.map((skill) => (
              <span
                key={skill}
                className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full text-cyan-200"
              >
                <span>{skill}</span>
                <button
                  onClick={() => toggleSkill(skill)}
                  className="text-cyan-300 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            ))}
            {activeTab === 'roles' && selectedJobRoles.map((roleId) => {
              const role = jobRoles.find(r => r.id === roleId);
              return (
                <span
                  key={roleId}
                  className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full text-purple-200"
                >
                  <span>{role?.title}</span>
                  <button
                    onClick={() => toggleJobRole(roleId)}
                    className="text-purple-300 hover:text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Content */}
      {activeTab === 'skills' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {filteredCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.category} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-center space-x-3 mb-4">
                  <Icon className="h-6 w-6 text-cyan-400" />
                  <h3 className="text-lg font-semibold text-white">{category.category}</h3>
                </div>
                <div className="space-y-2">
                  {category.skills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                        selectedSkills.includes(skill)
                          ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border border-cyan-500/50 text-white'
                          : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{skill}</span>
                        {selectedSkills.includes(skill) && (
                          <Plus className="h-4 w-4 rotate-45" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredJobRoles.map((role) => (
            <div
              key={role.id}
              onClick={() => toggleJobRole(role.id)}
              className={`cursor-pointer p-6 rounded-xl border transition-all ${
                selectedJobRoles.includes(role.id)
                  ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/50'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <h3 className="text-lg font-semibold text-white mb-2">{role.title}</h3>
              <div className="space-y-2">
                <p className="text-sm text-white/70 mb-3">Required skills:</p>
                <div className="flex flex-wrap gap-2">
                  {role.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/80"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={onNext}
          disabled={selectedSkills.length === 0 || selectedJobRoles.length === 0}
          className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Proceed to Assessment
        </button>
      </div>
    </div>
  );
};