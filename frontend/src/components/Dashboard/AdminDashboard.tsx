import React, { useState } from 'react';
import { Layout } from '../Layout';
import { Users, BookOpen, TrendingUp, Settings, Eye, Check, X, Clock, Award } from 'lucide-react';

const mockUsers = [
  {
    id: '1',
    name: 'John Developer',
    email: 'john@company.com',
    department: 'Engineering',
    progress: 75,
    skillGaps: ['React', 'Node.js'],
    completedModules: 4,
    totalModules: 6,
    lastActive: '2 hours ago'
  },
  {
    id: '2',
    name: 'Sarah Designer',
    email: 'sarah@company.com',
    department: 'Design',
    progress: 50,
    skillGaps: ['JavaScript', 'Vue.js'],
    completedModules: 2,
    totalModules: 5,
    lastActive: '1 day ago'
  },
  {
    id: '3',
    name: 'Mike Engineer',
    email: 'mike@company.com',
    department: 'Engineering',
    progress: 90,
    skillGaps: ['Python', 'DevOps'],
    completedModules: 5,
    totalModules: 6,
    lastActive: '30 minutes ago'
  }
];

const mockCourseModules = [
  {
    id: '1',
    title: 'Advanced React Patterns',
    description: 'Learn advanced React patterns and best practices',
    status: 'pending',
    createdBy: 'AI Generator',
    createdAt: '2024-01-15',
    enrolledUsers: 12
  },
  {
    id: '2',
    title: 'Node.js Performance Optimization',
    description: 'Optimize Node.js applications for better performance',
    status: 'approved',
    createdBy: 'AI Generator',
    createdAt: '2024-01-14',
    enrolledUsers: 8
  },
  {
    id: '3',
    title: 'Database Design Fundamentals',
    description: 'Master database design principles and normalization',
    status: 'rejected',
    createdBy: 'AI Generator',
    createdAt: '2024-01-13',
    enrolledUsers: 0
  }
];

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'courses' | 'settings'>('overview');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [skillGapFilter, setSkillGapFilter] = useState<string>('all');
  const [moduleStatuses, setModuleStatuses] = useState<Record<string, 'pending' | 'approved' | 'rejected'>>(
    mockCourseModules.reduce((acc, module) => {
      acc[module.id] = module.status as 'pending' | 'approved' | 'rejected';
      return acc;
    }, {} as Record<string, 'pending' | 'approved' | 'rejected'>)
  );

  const updateModuleStatus = (moduleId: string, status: 'approved' | 'rejected') => {
    setModuleStatuses(prev => ({ ...prev, [moduleId]: status }));
  };

  const stats = {
    totalUsers: mockUsers.length,
    activeUsers: mockUsers.filter(u => u.lastActive.includes('hour')).length,
    averageProgress: Math.round(mockUsers.reduce((acc, user) => acc + user.progress, 0) / mockUsers.length),
    pendingModules: Object.values(moduleStatuses).filter(status => status === 'pending').length
  };

  const filteredUsers = mockUsers.filter(user => {
    const departmentMatch = departmentFilter === 'all' || user.department === departmentFilter;
    const skillGapMatch = skillGapFilter === 'all' || 
      (skillGapFilter === 'high' && user.progress < 50) ||
      (skillGapFilter === 'medium' && user.progress >= 50 && user.progress < 80) ||
      (skillGapFilter === 'low' && user.progress >= 80);
    
    return departmentMatch && skillGapMatch;
  });

  const departments = ['all', ...Array.from(new Set(mockUsers.map(user => user.department)))];

  const renderOverview = () => (
    <div className="space-y-8 bg-white rounded-xl p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm">Active Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeUsers}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm">Avg. Progress</p>
              <p className="text-3xl font-bold text-gray-900">{stats.averageProgress}%</p>
            </div>
            <Award className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm">Pending Reviews</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pendingModules}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent User Activity</h3>
          <div className="space-y-4">
            {mockUsers.slice(0, 5).map(user => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">{user.name}</p>
                    <p className="text-gray-600 text-sm">Progress: {user.progress}%</p>
                  </div>
                </div>
                <span className="text-gray-500 text-sm">{user.lastActive}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">System Overview</h3>
          <div className="space-y-4">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <span className="text-green-700">System Status</span>
                <span className="text-green-600 font-semibold">Operational</span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-blue-700">AI Generator</span>
                <span className="text-blue-600 font-semibold">Online</span>
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <span className="text-purple-700">Database</span>
                <span className="text-purple-600 font-semibold">Connected</span>
              </div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-between">
                <span className="text-yellow-700">Pending Reviews</span>
                <span className="text-yellow-600 font-semibold">{stats.pendingModules} items</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6 bg-white rounded-xl p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">User Management</h3>
        
        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept === 'all' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skill Gap</label>
            <select
              value={skillGapFilter}
              onChange={(e) => setSkillGapFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">All Levels</option>
              <option value="high">High Gap (&lt;50%)</option>
              <option value="medium">Medium Gap (50-80%)</option>
              <option value="low">Low Gap (&gt;80%)</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Skill Gaps</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Modules</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium">{user.name}</p>
                        <p className="text-gray-600 text-sm">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {user.department}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-gray-200 rounded-full h-2 max-w-20">
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full"
                          style={{ width: `${user.progress}%` }}
                        />
                      </div>
                      <span className="text-gray-900 font-medium text-sm">{user.progress}%</span>
                    </div>  
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {user.skillGaps.map(skill => (
                        <span key={skill} className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900">{user.completedModules}/{user.totalModules}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.lastActive}</td>
                  <td className="px-6 py-4">
                    <button className="p-2 text-cyan-600 hover:text-cyan-500 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white">Course Module Management</h3>
      
      <div className="grid grid-cols-1 gap-6">
        {mockCourseModules.map(module => (
          <div key={module.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-semibold text-white">{module.title}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    moduleStatuses[module.id] === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                    moduleStatuses[module.id] === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/50' :
                    'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                  }`}>
                    {moduleStatuses[module.id]}
                  </span>
                </div>
                <p className="text-white/70 mb-4">{module.description}</p>
                
                <div className="flex items-center space-x-6 text-sm text-white/60">
                  <span>Created by: {module.createdBy}</span>
                  <span>Date: {module.createdAt}</span>
                  <span>Enrolled: {module.enrolledUsers} users</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => updateModuleStatus(module.id, 'approved')}
                  disabled={moduleStatuses[module.id] === 'approved'}
                  className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg border border-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() => updateModuleStatus(module.id, 'rejected')}
                  disabled={moduleStatuses[module.id] === 'rejected'}
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg border border-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="h-4 w-4" />
                </button>
                <button className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg border border-blue-500/30 transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white">System Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h4 className="text-lg font-semibold text-white mb-4">AI Configuration</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm mb-2">Assessment Difficulty Adaptation</label>
              <select className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50">
                <option value="aggressive" className="bg-gray-900">Aggressive</option>
                <option value="moderate" className="bg-gray-900" selected>Moderate</option>
                <option value="conservative" className="bg-gray-900">Conservative</option>
              </select>
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-2">Course Generation Model</label>
              <select className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50">
                <option value="gpt-4" className="bg-gray-900">GPT-4</option>
                <option value="claude" className="bg-gray-900" selected>Claude</option>
                <option value="custom" className="bg-gray-900">Custom Model</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h4 className="text-lg font-semibold text-white mb-4">Platform Settings</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white/80">Auto-approve AI modules</span>
              <button className="w-12 h-6 bg-white/20 rounded-full relative transition-colors">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80">Proctoring enabled</span>
              <button className="w-12 h-6 bg-cyan-500 rounded-full relative transition-colors">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80">Email notifications</span>
              <button className="w-12 h-6 bg-cyan-500 rounded-full relative transition-colors">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout title="Admin Dashboard">
      <div className="space-y-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-xl p-1">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'courses', label: 'Course Modules', icon: BookOpen },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="min-h-[600px]">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'courses' && renderCourses()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </div>
    </Layout>
  );
};