
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
      
      {/* Minimal Footer */}
      <footer className="py-6 bg-white border-t border-slate-100 mt-auto">
        <div className="mx-auto max-w-[1600px] px-12 flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center text-white font-black text-[10px]">SN</div>
            <div className="flex flex-col">
              <span className="text-slate-900 text-[10px] font-black uppercase tracking-[0.2em]">SNIST</span>
              <span className="text-slate-400 text-[8px] font-bold uppercase tracking-[0.1em]">Sreenidhi Institute of Science and Technology</span>
            </div>
          </div>
          <div className="text-slate-400 text-[9px] font-black uppercase tracking-[0.4em]">
            &copy; {new Date().getFullYear()} Central Redressal Mechanism
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
