
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { User, UserRole, Complaint } from './types';
import { INITIAL_COMPLAINTS } from './constants';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Navigation from './components/Navigation';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const navigate = useNavigate();

  const handleLogin = (u: User) => {
    setUser(u);
    if (u.role === UserRole.ADMIN) {
      navigate('/admin');
    } else {
      navigate('/student');
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  const addComplaint = (newComplaint: Complaint) => {
    setComplaints(prev => [newComplaint, ...prev]);
  };

  const updateComplaint = (id: string, updates: Partial<Complaint>) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {user && <Navigation user={user} onLogout={handleLogout} />}
      <main className="flex-1">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route 
            path="/student/*" 
            element={user?.role === UserRole.STUDENT ? (
              <StudentDashboard user={user} complaints={complaints} onAddComplaint={addComplaint} />
            ) : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin/*" 
            element={user?.role === UserRole.ADMIN ? (
              <AdminDashboard user={user} complaints={complaints} onUpdateComplaint={updateComplaint} />
            ) : <Navigate to="/login" />} 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </main>
      
      {/* Premium Footer */}
      <footer className="py-8 bg-white border-t border-slate-200">
        <div className="container mx-auto px-6 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} StudentGrievance. Built for Modern Campus Efficiency.
        </div>
      </footer>
    </div>
  );
};

export default App;
