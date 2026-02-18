
import React, { useState, useMemo } from 'react';
import { User, Complaint, ComplaintStatus, ComplaintCategory, Priority } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminDashboardProps {
  user: User;
  complaints: Complaint[];
  onUpdateComplaint: (id: string, updates: Partial<Complaint>) => void;
}

const CategoryIcon = ({ category, className }: { category: ComplaintCategory, className?: string }) => {
  switch (category) {
    case ComplaintCategory.ACADEMIC:
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
    case ComplaintCategory.HOSTEL:
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
    case ComplaintCategory.INFRASTRUCTURE:
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
    case ComplaintCategory.ADMINISTRATION:
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
    default:
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  }
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, complaints, onUpdateComplaint }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'inbox' | 'students'>('analytics');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterBranch, setFilterBranch] = useState<string>('All');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [remark, setRemark] = useState('');
  
  const branches = ['Central Block', 'Innovation Hub', 'North Campus', 'South Wing', 'Research Annex'];

  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => {
      const matchCat = filterCategory === 'All' || c.category === filterCategory;
      const matchBranch = filterBranch === 'All' || c.branch === filterBranch;
      return matchCat && matchBranch;
    });
  }, [complaints, filterCategory, filterBranch]);

  const studentProfiles = useMemo(() => {
    const studentsMap = new Map<string, { id: string, name: string, count: number, resolved: number, dept: string }>();
    complaints.forEach(c => {
      const existing = studentsMap.get(c.studentId);
      if (existing) {
        existing.count++;
        if (c.status === ComplaintStatus.RESOLVED) existing.resolved++;
      } else {
        studentsMap.set(c.studentId, {
          id: c.studentId,
          name: c.studentName,
          count: 1,
          resolved: c.status === ComplaintStatus.RESOLVED ? 1 : 0,
          dept: c.category === ComplaintCategory.ACADEMIC ? 'CST' : 'Engineering'
        });
      }
    });
    return Array.from(studentsMap.values());
  }, [complaints]);

  const analyticsData = [
    { period: '09:00', inflow: 4, resolved: 2 },
    { period: '11:00', inflow: 12, resolved: 5 },
    { period: '13:00', inflow: 8, resolved: 9 },
    { period: '15:00', inflow: 15, resolved: 11 },
    { period: '17:00', inflow: 10, resolved: 14 },
    { period: '19:00', inflow: 6, resolved: 8 },
    { period: '21:00', inflow: 2, resolved: 3 },
  ];

  const resolutionAnalytics = useMemo(() => {
    const resolved = complaints.filter(c => c.status === ComplaintStatus.RESOLVED);
    if (resolved.length === 0) return { avg: 0 };
    const avgDays = (resolved.reduce((acc, c) => acc + (new Date(c.updatedAt).getTime() - new Date(c.createdAt).getTime()), 0) / resolved.length / 86400000).toFixed(1);
    return { avg: avgDays };
  }, [complaints]);

  const handleUpdateStatus = (id: string, status: ComplaintStatus) => {
    onUpdateComplaint(id, { status, remarks: remark ? [...(selectedComplaint?.remarks || []), remark] : selectedComplaint?.remarks });
    setRemark('');
    setSelectedComplaint(null);
  };

  return (
    <div className="flex h-[calc(100vh-120px)] overflow-hidden bg-slate-50/50">
      {/* Side Command Rail */}
      <aside className="w-20 h-full bg-slate-950 flex flex-col items-center py-8 gap-10 z-[50] shadow-2xl">
         <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg">SN</div>
         <nav className="flex flex-col gap-6">
            {[
              { id: 'analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: 'indigo' },
              { id: 'inbox', icon: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4', color: 'teal' },
              { id: 'students', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'violet' }
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 relative group ${
                  activeTab === item.id 
                    ? `bg-${item.color}-600 text-white shadow-xl scale-110` 
                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} /></svg>
              </button>
            ))}
         </nav>
      </aside>

      {/* Main Command Center */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-10 lg:p-14">
        <div className="max-w-[1400px] mx-auto space-y-12">
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4 border-b border-slate-100">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg">Admin Node</span>
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none">
                {activeTab === 'analytics' && <>Console <span className="text-indigo-600">Operations</span></>}
                {activeTab === 'inbox' && <>Case <span className="text-teal-600">Registry</span></>}
                {activeTab === 'students' && <>Student <span className="text-violet-600">Directory</span></>}
              </h1>
              <p className="text-slate-400 text-lg font-medium max-w-2xl">
                {activeTab === 'analytics' && 'Real-time telemetry and categorical dispatch control.'}
                {activeTab === 'inbox' && 'Auditing institutional dispatches and resolution flows.'}
                {activeTab === 'students' && 'Profiles of active campus participants and activity metrics.'}
              </p>
            </div>
          </div>

          {activeTab === 'analytics' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Inflow Load', val: complaints.length, color: 'indigo', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                    { label: 'Closure Rate', val: complaints.filter(c => c.status === ComplaintStatus.RESOLVED).length, color: 'teal', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                    { label: 'Avg Velocity', val: `${resolutionAnalytics.avg}d`, color: 'amber', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                    { label: 'Urgent Alerts', val: complaints.filter(c => c.priority === Priority.HIGH && c.status !== ComplaintStatus.RESOLVED).length, color: 'rose', icon: 'M12 9v2m0 4h.01' }
                  ].map(stat => (
                    <div key={stat.label} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 group hover:shadow-md transition-all">
                       <div className={`w-12 h-12 rounded-xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 mb-6 group-hover:scale-110 transition-transform`}>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={stat.icon} /></svg>
                       </div>
                       <p className="text-[11px] font-black uppercase tracking-widest text-slate-300 mb-1">{stat.label}</p>
                       <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{stat.val}</h3>
                    </div>
                  ))}
               </div>

               <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm">
                  <h4 className="text-xl font-black text-slate-900 mb-12">Institutional Performance</h4>
                  <div className="h-[350px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analyticsData}>
                           <defs>
                              <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                 <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                              </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                           <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 900}} />
                           <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 900}} />
                           <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'}} />
                           <Area type="monotone" dataKey="inflow" stroke="#6366f1" fillOpacity={1} fill="url(#colorIn)" strokeWidth={4} />
                           <Area type="monotone" dataKey="resolved" stroke="#14b8a6" fillOpacity={1} strokeWidth={4} fill="none" />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'inbox' && (
            <div className="animate-in slide-in-from-bottom-8 duration-700 space-y-12">
               <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-wrap gap-8 items-end">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Node Filter</label>
                     <select 
                       value={filterBranch}
                       onChange={(e) => setFilterBranch(e.target.value)}
                       className="bg-slate-50 border border-slate-200 rounded-xl px-6 py-3 text-sm font-bold outline-none focus:border-indigo-500 transition-all min-w-[240px] shadow-inner"
                     >
                        <option value="All">All Operations Nodes</option>
                        {branches.map(b => <option key={b} value={b}>{b}</option>)}
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Sector Filter</label>
                     <select 
                       value={filterCategory}
                       onChange={(e) => setFilterCategory(e.target.value)}
                       className="bg-slate-50 border border-slate-200 rounded-xl px-6 py-3 text-sm font-bold outline-none focus:border-indigo-500 transition-all min-w-[220px] shadow-inner"
                     >
                        <option value="All">All Functional Units</option>
                        {Object.values(ComplaintCategory).map(cat => <option key={cat} value={cat}>{cat} Unit</option>)}
                     </select>
                  </div>
               </div>

               <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                  <table className="w-full">
                     <thead>
                        <tr className="bg-slate-50 text-left text-[11px] uppercase tracking-widest font-black text-slate-400">
                           <th className="px-8 py-5">Node ID</th>
                           <th className="px-8 py-5">Initiator</th>
                           <th className="px-8 py-5">Case Narrative</th>
                           <th className="px-8 py-5">Tier</th>
                           <th className="px-8 py-5 text-right">Operations</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {filteredComplaints.map(c => (
                          <tr key={c.id} className="group hover:bg-slate-50 transition-all cursor-pointer">
                             <td className="px-8 py-6 text-sm font-black text-slate-400 font-mono tracking-tighter uppercase">{c.id}</td>
                             <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-indigo-600 text-sm">{c.studentName.charAt(0)}</div>
                                   <div className="flex flex-col">
                                      <span className="text-sm font-black text-slate-800">{c.studentName}</span>
                                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{c.studentId}</span>
                                   </div>
                                </div>
                             </td>
                             <td className="px-8 py-6">
                                <div className="flex flex-col max-w-[350px]">
                                   <div className="flex items-center gap-2 mb-1">
                                      <CategoryIcon category={c.category} className="w-3.5 h-3.5 text-slate-300" />
                                      <span className="text-base font-black text-slate-800 truncate">{c.title}</span>
                                   </div>
                                   <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{c.category} Unit</span>
                                </div>
                             </td>
                             <td className="px-8 py-6">
                                <span className={`px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                                  c.priority === Priority.HIGH ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                  c.priority === Priority.MEDIUM ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                  'bg-slate-50 text-slate-500 border-slate-100'
                                }`}>
                                   {c.priority}
                                </span>
                             </td>
                             <td className="px-8 py-6 text-right">
                                <button onClick={() => setSelectedComplaint(c)} className="px-6 py-2 bg-slate-950 hover:bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all active:scale-95">Console</button>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                   </table>
               </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="animate-in slide-in-from-bottom-8 duration-700 space-y-8">
               <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                     <h3 className="text-2xl font-black text-slate-900 tracking-tight">Active Campus Profiles</h3>
                     <span className="px-4 py-1.5 bg-violet-50 text-violet-600 text-[11px] font-black uppercase tracking-widest rounded-xl">{studentProfiles.length} Members Logged</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                       <thead>
                          <tr className="bg-slate-50 text-left text-[11px] uppercase tracking-widest font-black text-slate-400">
                             <th className="px-8 py-5">Profile</th>
                             <th className="px-8 py-5">Institutional ID</th>
                             <th className="px-8 py-5">Department</th>
                             <th className="px-8 py-5">Activity Index</th>
                             <th className="px-8 py-5 text-right">Status</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {studentProfiles.map(s => (
                            <tr key={s.id} className="hover:bg-slate-50 transition-all cursor-pointer">
                               <td className="px-8 py-8">
                                  <div className="flex items-center gap-5">
                                     <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-black text-xl shadow-lg transform group-hover:rotate-6 transition-transform">
                                        {s.name.charAt(0)}
                                     </div>
                                     <div className="flex flex-col">
                                        <span className="text-lg font-black text-slate-900 tracking-tight">{s.name}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enrolled Member</span>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-8 py-8">
                                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest font-mono">{s.id}</span>
                               </td>
                               <td className="px-8 py-8">
                                  <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg uppercase tracking-widest">{s.dept} Unit</span>
                               </td>
                               <td className="px-8 py-8">
                                  <div className="flex flex-col gap-3">
                                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        <span>{s.resolved} / {s.count} Phase Closure</span>
                                        <span className="text-indigo-600">{Math.round((s.resolved / s.count) * 100)}%</span>
                                     </div>
                                     <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000" style={{ width: `${(s.resolved / s.count) * 100}%` }}></div>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-8 py-8 text-right">
                                  <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-emerald-50 rounded-xl border border-emerald-100">
                                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                     <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Active Node</span>
                                  </div>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                  </div>
               </div>
            </div>
          )}
        </div>
      </main>

      {/* Action Console Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-500">
           <div className="w-full max-w-4xl bg-white rounded-3xl p-10 animate-in zoom-in-95 relative overflow-hidden shadow-2xl">
              <div className="flex justify-between items-start mb-10">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <CategoryIcon category={selectedComplaint.category} className="w-4 h-4 text-indigo-600" />
                       <span className="text-[11px] font-black uppercase tracking-widest text-indigo-600">Protocol Update</span>
                       <span className="text-[11px] font-black uppercase tracking-widest text-slate-300 font-mono">{selectedComplaint.id}</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-tight max-w-2xl">{selectedComplaint.title}</h3>
                 </div>
                 <button onClick={() => setSelectedComplaint(null)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 hover:text-rose-500 transition-all border border-slate-100 text-3xl">
                    &times;
                 </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                 <div className="lg:col-span-7 space-y-8">
                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                       <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-300 mb-4">Case Narrative</h4>
                       <p className="text-slate-700 text-lg font-medium leading-relaxed">{selectedComplaint.description}</p>
                    </div>
                    <textarea 
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      placeholder="Enter departmental notes..."
                      rows={4}
                      className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:border-indigo-500 outline-none transition-all text-base font-medium shadow-sm resize-none"
                    />
                 </div>

                 <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
                       <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-400 mb-8 text-center">Dispatch Status</h4>
                       <div className="grid grid-cols-1 gap-3">
                          {[
                            ComplaintStatus.ASSIGNED,
                            ComplaintStatus.UNDER_REVIEW,
                            ComplaintStatus.ACTION_TAKEN,
                            ComplaintStatus.RESOLVED
                          ].map(s => (
                            <button 
                              key={s}
                              onClick={() => handleUpdateStatus(selectedComplaint.id, s)}
                              className={`py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all transform active:scale-95 flex items-center justify-center gap-3 ${
                                s === ComplaintStatus.RESOLVED 
                                  ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                                  : 'bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 hover:border-indigo-500'
                              }`}
                            >
                               {s}
                            </button>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
