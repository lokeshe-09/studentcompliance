
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (role === UserRole.ADMIN && username === 'admin' && password === 'admin') {
        onLogin({ id: 'admin-1', username: 'admin', role: UserRole.ADMIN, fullName: 'System Administrator' });
      } else if (role === UserRole.STUDENT && username === 'student' && password === 'student') {
        onLogin({ id: 'student', username: 'student', role: UserRole.STUDENT, fullName: 'Alex Johnson' });
      } else {
        setError('Verification Failed. Access Denied.');
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white selection:bg-indigo-500 selection:text-white">
      
      {/* Cinematic Brand Side */}
      <div className="relative w-full lg:w-1/2 min-h-[40vh] lg:min-h-screen bg-slate-950 flex flex-col justify-between p-8 lg:p-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-teal-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '3s' }}></div>
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        
        <div className="relative z-10">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl animate-float">SN</div>
          <div className="mt-16 lg:mt-24 space-y-6">
            <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight tracking-tighter">
              SNIST <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-teal-400">Excellence</span> <br/> 
              Redefined.
            </h1>
            <p className="text-slate-400 text-lg lg:text-xl font-medium max-w-md leading-relaxed">
              Unified grievance protocol for Sreenidhi Institute of Science and Technology.
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-8 lg:mt-0">
          <div className="inline-flex items-center gap-6 p-6 glass-dark rounded-2xl border border-white/10 shadow-xl">
            <div className="flex -space-x-3">
              {[42, 53, 64].map(i => (
                <img key={i} src={`https://i.pravatar.cc/100?img=${i}`} className="w-10 h-10 rounded-full border-4 border-slate-950 shadow-lg" alt="user" />
              ))}
            </div>
            <div className="h-8 w-px bg-white/10"></div>
            <div>
              <p className="text-white font-bold text-sm">Integrated Campus</p>
              <p className="text-[9px] text-indigo-400 font-black uppercase tracking-wider mt-0.5">Campus Efficiency Standard</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 min-h-screen bg-slate-50 flex flex-col justify-center p-6 sm:p-12 lg:p-20">
        <div className="max-w-md mx-auto w-full space-y-10">
          <header className="space-y-3 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">
              SNIST Portal Access
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none">Secure Login</h2>
            <p className="text-slate-500 text-sm font-medium">Please enter your credentials to access the console.</p>
          </header>

          <div className="p-1 bg-slate-200/50 rounded-2xl flex border border-slate-200 shadow-inner">
            <button 
              type="button"
              onClick={() => setRole(UserRole.STUDENT)}
              className={`flex-1 py-3 px-4 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all duration-300 ${role === UserRole.STUDENT ? 'bg-white text-indigo-600 shadow-md scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Student
            </button>
            <button 
              type="button"
              onClick={() => setRole(UserRole.ADMIN)}
              className={`flex-1 py-3 px-4 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all duration-300 ${role === UserRole.ADMIN ? 'bg-white text-indigo-600 shadow-md scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">ID Identifier</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={`${role.toLowerCase()} ID`}
                className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all text-slate-800 font-bold text-sm shadow-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Password Key</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all text-slate-800 font-bold text-sm shadow-sm"
                required
              />
            </div>

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 animate-in shake duration-500">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">{error}</p>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-slate-950 hover:bg-indigo-600 disabled:bg-slate-800 text-white font-black rounded-xl shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="uppercase tracking-widest text-xs">Initialize Console</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </>
              )}
            </button>
          </form>

          <footer className="pt-10 flex items-center justify-center gap-6">
            <button onClick={() => { setUsername('student'); setPassword('student'); setRole(UserRole.STUDENT); }} className="text-[9px] font-black text-slate-300 hover:text-indigo-500 uppercase tracking-widest transition-colors">Quick Student</button>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
            <button onClick={() => { setUsername('admin'); setPassword('admin'); setRole(UserRole.ADMIN); }} className="text-[9px] font-black text-slate-300 hover:text-indigo-500 uppercase tracking-widest transition-colors">Quick Admin</button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;
