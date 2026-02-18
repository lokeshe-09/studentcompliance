
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
        setError('Invalid credentials for the selected role.');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-700 relative overflow-hidden">
      
      {/* Reinstating the previous animated background elements */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-violet-200/40 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-100/30 rounded-full mix-blend-multiply filter blur-[100px] pointer-events-none"></div>

      {/* Split Screen Layout */}
      <div className="flex w-full relative z-10">
        
        {/* Visual Side (Left) - Using the previous high-contrast professional look */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center p-16 shadow-2xl">
          {/* Subtle decoration for the dark side */}
          <div className="absolute inset-0 opacity-[0.05]" 
               style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          <div className="relative z-10 w-full max-w-lg">
            <div className="mb-12">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-2xl mb-8">
                S
              </div>
              <h1 className="text-5xl font-extrabold text-white leading-tight tracking-tight mb-6">
                Redefining <br />
                <span className="text-indigo-400">Institutional</span> <br />
                Efficiency.
              </h1>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
                Connect directly with university departments. Resolve grievances with professional speed and complete transparency.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex -space-x-3">
                  {[10, 15, 20].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i}`} className="w-10 h-10 rounded-full border-2 border-slate-900" alt="user" />
                  ))}
                </div>
                <div className="h-4 w-px bg-white/10"></div>
                <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Global University Standard</p>
              </div>
              <p className="text-white text-lg font-medium italic mb-2">
                "Modern systems for modern problems. We close the feedback loop between administration and students."
              </p>
            </div>
          </div>
        </div>

        {/* Form Side (Right) - Clean white background with airy feel */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 min-h-screen">
          <div className="w-full max-w-md bg-white/60 backdrop-blur-sm p-10 rounded-[2.5rem] border border-white/40 shadow-xl lg:shadow-none lg:bg-transparent lg:p-0 lg:border-none">
            
            <div className="mb-12">
              <div className="lg:hidden w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl mb-6 shadow-lg shadow-indigo-100">S</div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Welcome Back</h2>
              <p className="text-slate-500 font-medium">Please sign in to your dashboard to manage issues.</p>
            </div>

            {/* Role Switcher */}
            <div className="bg-slate-200/50 p-1 rounded-2xl flex mb-10 border border-slate-200">
              <button 
                type="button"
                onClick={() => setRole(UserRole.STUDENT)}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-black tracking-widest uppercase transition-all duration-300 ${role === UserRole.STUDENT ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Student
              </button>
              <button 
                type="button"
                onClick={() => setRole(UserRole.ADMIN)}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-black tracking-widest uppercase transition-all duration-300 ${role === UserRole.ADMIN ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Admin
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Identity Code</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={`${role.toLowerCase()} ID`}
                    className="w-full px-6 py-5 bg-white border border-slate-200 rounded-[1.25rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-800 font-medium shadow-sm"
                    required
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security Key</label>
                </div>
                <div className="relative">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-6 py-5 bg-white border border-slate-200 rounded-[1.25rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-800 font-medium shadow-sm"
                    required
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  <p className="text-[11px] font-bold text-red-600 uppercase tracking-tight">{error}</p>
                </div>
              )}

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-black rounded-[1.25rem] shadow-xl shadow-indigo-100 transform transition active:scale-[0.98] flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="uppercase tracking-[0.15em] text-sm">Sign In</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 pt-10 border-t border-slate-100 flex flex-wrap gap-4 items-center justify-center">
              <button onClick={() => { setUsername('student'); setPassword('student'); setRole(UserRole.STUDENT); }} className="px-4 py-2 bg-slate-100 hover:bg-indigo-50 text-[10px] font-black text-slate-500 hover:text-indigo-600 border border-slate-200 rounded-xl transition-all">MOCK STUDENT</button>
              <button onClick={() => { setUsername('admin'); setPassword('admin'); setRole(UserRole.ADMIN); }} className="px-4 py-2 bg-slate-100 hover:bg-indigo-50 text-[10px] font-black text-slate-500 hover:text-indigo-600 border border-slate-200 rounded-xl transition-all">MOCK ADMIN</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
