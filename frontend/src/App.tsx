import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthForm } from './components/Auth/AuthForm';
import { EmployeeDashboard } from './components/Dashboard/EmployeeDashboard';
import { AdminDashboard } from './components/Dashboard/AdminDashboard';

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <AuthForm />;
  }

  if (user.role === 'admin') {
    return <AdminDashboard />;
  }

  return <EmployeeDashboard />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;