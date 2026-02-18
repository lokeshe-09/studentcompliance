
import React, { useState } from 'react';
import { User } from '../types';

interface NavigationProps {
  user: User;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ user, onLogout }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-[100] w-full px-6 py-4">
      <div className="mx-auto max-w-7xl glass-morphism rounded-[2rem] px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
              S
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-black text-slate-900 tracking-tight">StudentGrievance</span>
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Enterprise</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-1 ml-4">
             <div className="h-4 w-[1px] bg-slate-200 mx-2"></div>
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{user.role} PORTAL</span>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Notification Bell - Feature Requirement 4.3 */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100 relative group"
            >
              <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Alert Center</h4>
                  <span className="text-[9px] font-bold text-indigo-600">Mark all read</span>
                </div>
                <div className="space-y-4">
                  {[
                    { title: 'Status Update', desc: 'CMP-1001 moved to Under Review', time: '2m ago' },
                    { title: 'New Remark', desc: 'Admin added a note to your filing', time: '1h ago' }
                  ].map((n, i) => (
                    <div key={i} className="flex gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{n.title}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{n.desc}</p>
                        <p className="text-[9px] font-black text-slate-300 uppercase mt-1">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-2xl">
             <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
                {user.fullName.charAt(0)}
             </div>
             <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800">{user.fullName}</span>
                <span className="text-[10px] font-medium text-slate-500 capitalize">{user.role.toLowerCase()}</span>
             </div>
          </div>
          <button 
            onClick={onLogout}
            className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
