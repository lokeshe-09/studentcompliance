
import React, { useState, useMemo } from 'react';
import { User, Complaint, ComplaintStatus, ComplaintCategory, Priority } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface AdminDashboardProps {
  user: User;
  complaints: Complaint[];
  onUpdateComplaint: (id: string, updates: Partial<Complaint>) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, complaints, onUpdateComplaint }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'inbox'>('analytics');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterBranch, setFilterBranch] = useState<string>('All');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [remark, setRemark] = useState('');

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkTargetStatus, setBulkTargetStatus] = useState<ComplaintStatus | null>(null);

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const branches = ['Central Block', 'Innovation Hub', 'North Campus', 'South Wing', 'Research Annex'];

  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => {
      const matchCat = filterCategory === 'All' || c.category === filterCategory;
      const matchStatus = filterStatus === 'All' || c.status === filterStatus;
      const matchBranch = filterBranch === 'All' || c.branch === filterBranch;
      return matchCat && matchStatus && matchBranch;
    });
  }, [complaints, filterCategory, filterStatus, filterBranch]);

  const analyticsData = useMemo(() => {
    return [
      { period: '09:00', inflow: 4, resolved: 2 },
      { period: '11:00', inflow: 12, resolved: 5 },
      { period: '13:00', inflow: 8, resolved: 9 },
      { period: '15:00', inflow: 15, resolved: 11 },
      { period: '17:00', inflow: 10, resolved: 14 },
      { period: '19:00', inflow: 6, resolved: 8 },
      { period: '21:00', inflow: 2, resolved: 3 },
    ];
  }, []);

  const departmentData = useMemo(() => {
    return Object.values(ComplaintCategory).map(cat => ({
      name: cat,
      count: complaints.filter(c => c.category === cat).length
    }));
  }, [complaints]);

  // Resolution Time Analytics
  const resolutionAnalytics = useMemo(() => {
    const resolved = complaints.filter(c => c.status === ComplaintStatus.RESOLVED);
    if (resolved.length === 0) return { avg: 0, chartData: [] };

    const totalResTime = resolved.reduce((acc, c) => {
      const resTime = new Date(c.updatedAt).getTime() - new Date(c.createdAt).getTime();
      return acc + resTime;
    }, 0);

    const avgMs = totalResTime / resolved.length;
    const avgDays = (avgMs / (1000 * 60 * 60 * 24)).toFixed(1);

    // Grouping by week for the chart to show trends over time
    const groups: Record<string, { total: number; count: number }> = {};
    resolved.forEach(c => {
      const date = new Date(c.updatedAt);
      const weekStr = `Week ${Math.ceil(date.getDate() / 7)} of ${date.toLocaleString('default', { month: 'short' })}`;
      const resDays = (new Date(c.updatedAt).getTime() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      
      if (!groups[weekStr]) groups[weekStr] = { total: 0, count: 0 };
      groups[weekStr].total += resDays;
      groups[weekStr].count += 1;
    });

    const chartData = Object.keys(groups).map(key => ({
      week: key,
      days: parseFloat((groups[key].total / groups[key].count).toFixed(1))
    })).sort((a, b) => a.week.localeCompare(b.week));

    return { avg: avgDays, chartData };
  }, [complaints]);

  const handleUpdateStatus = (id: string, status: ComplaintStatus) => {
    const updates: any = { status };
    if (remark.trim()) {
      updates.remarks = [...(selectedComplaint?.remarks || []), remark];
    }
    onUpdateComplaint(id, updates);
    setRemark('');
    setSelectedComplaint(null);
  };

  const handleBulkUpdate = () => {
    if (!bulkTargetStatus) return;
    selectedIds.forEach(id => {
      onUpdateComplaint(id, { status: bulkTargetStatus });
    });
    setSelectedIds([]);
    setShowBulkModal(false);
    setBulkTargetStatus(null);
  };

  const startEditing = (c: Complaint) => {
    setEditingId(c.id);
    setEditTitle(c.title);
    setEditDescription(c.description);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const saveInlineEdit = (id: string) => {
    onUpdateComplaint(id, { title: editTitle, description: editDescription });
    setEditingId(null);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredComplaints.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredComplaints.map(c => c.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex h-[calc(100vh-100px)] overflow-hidden bg-[#F8FAFC]">
      {/* Admin Operations Control Rail */}
      <aside className="w-24 h-full bg-slate-900 flex flex-col items-center py-12 gap-12 border-r border-slate-800 shadow-2xl z-50">
         <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-900/50 transform hover:scale-105 transition-transform">
           Ω
         </div>
         <nav className="flex flex-col gap-8">
            {[
              { id: 'analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
              { id: 'inbox', icon: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4' }
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-16 h-16 rounded-[2rem] flex items-center justify-center transition-all duration-500 relative group ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} /></svg>
                {activeTab === item.id && <div className="absolute -left-1 w-2 h-2 bg-indigo-400 rounded-full blur-[2px]"></div>}
              </button>
            ))}
         </nav>
      </aside>

      {/* Main Command Console */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-[1700px] mx-auto p-12 lg:p-16 space-y-16">
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="px-3 py-1 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-[0.4em] rounded-md">HQ Admin</div>
                <div className="h-4 w-px bg-slate-200"></div>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <h1 className="text-6xl font-black text-slate-900 tracking-tight leading-tight">Administrative <span className="text-indigo-600">Command</span></h1>
              <p className="text-slate-500 text-xl font-medium max-w-2xl">Enterprise-level institutional oversight and multi-department resolution analytics for {user.fullName}.</p>
            </div>
            
            <div className="flex items-center gap-4 bg-white p-3 rounded-[2rem] border border-slate-100 shadow-sm">
               <button className="px-10 py-4 bg-slate-900 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-3 shadow-2xl">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                 Generate Operations Audit
               </button>
            </div>
          </div>

          {activeTab === 'analytics' ? (
            <div className="space-y-16 animate-in fade-in duration-1000">
               {/* Intelligence Grid */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                  {[
                    { label: 'System Inflow', val: complaints.length, sub: 'Daily Load Increase 12%', icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: 'indigo' },
                    { label: 'Closure Success', val: complaints.filter(c => c.status === ComplaintStatus.RESOLVED).length, sub: 'Resolution Rate 88.4%', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'emerald' },
                    { label: 'Avg Closure Time', val: `${resolutionAnalytics.avg}d`, sub: 'SLA Target: <3 days', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'amber' },
                    { label: 'Critical Tier', val: complaints.filter(c => c.priority === Priority.HIGH && c.status !== ComplaintStatus.RESOLVED).length, sub: 'High Priority Alert', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', color: 'red' }
                  ].map(stat => (
                    <div key={stat.label} className="bg-white p-12 rounded-[4rem] neo-shadow border border-slate-50 group hover:border-indigo-100 transition-all">
                       <div className={`w-16 h-16 rounded-[1.75rem] bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 mb-10 shadow-sm group-hover:scale-110 transition-transform`}>
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={stat.icon} /></svg>
                       </div>
                       <p className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-300 mb-2">{stat.label}</p>
                       <h3 className="text-6xl font-black text-slate-900 tracking-tighter mb-3">{stat.val}</h3>
                       <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full bg-${stat.color}-500`}></div>
                          <p className={`text-[11px] font-black text-${stat.color}-500 uppercase tracking-widest`}>{stat.sub}</p>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  {/* System Performance Chart */}
                  <div className="lg:col-span-8 bg-white p-16 rounded-[4.5rem] border border-slate-50 neo-shadow">
                     <div className="flex items-center justify-between mb-20">
                        <div>
                           <h4 className="text-3xl font-black text-slate-900 tracking-tight">System Performance Timeline</h4>
                           <p className="text-lg font-medium text-slate-400 mt-2">Real-time comparison: Inflow vs Resolution velocity.</p>
                        </div>
                        <div className="flex gap-6">
                           <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                              <span className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Inflow</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                              <span className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Closure</span>
                           </div>
                        </div>
                     </div>
                     <div className="h-[450px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={analyticsData}>
                              <defs>
                                 <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                 </linearGradient>
                                 <linearGradient id="colorRe" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                 </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                              <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 900}} dy={15} />
                              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 900}} />
                              <Tooltip contentStyle={{borderRadius: '32px', border: 'none', boxShadow: '0 30px 50px -10px rgb(0 0 0 / 0.15)', padding: '30px'}} />
                              <Area type="monotone" dataKey="inflow" stroke="#6366f1" fillOpacity={1} fill="url(#colorIn)" strokeWidth={5} dot={{ r: 6, fill: '#6366f1', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 10, strokeWidth: 0 }} />
                              <Area type="monotone" dataKey="resolved" stroke="#10b981" fillOpacity={1} fill="url(#colorRe)" strokeWidth={5} dot={{ r: 6, fill: '#10b981', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 10, strokeWidth: 0 }} />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>
                  </div>

                  {/* Department Distribution */}
                  <div className="lg:col-span-4 bg-slate-900 rounded-[4.5rem] p-16 text-white shadow-2xl overflow-hidden relative">
                     <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full -mr-48 -mt-48 blur-[120px]"></div>
                     <h4 className="text-2xl font-black mb-16 relative z-10">Departmental Distribution</h4>
                     <div className="space-y-12 relative z-10">
                        {departmentData.map((dept, i) => {
                          const percentage = Math.round((dept.count / (complaints.length || 1)) * 100);
                          return (
                            <div key={dept.name} className="space-y-4">
                               <div className="flex justify-between items-end">
                                  <span className="text-[12px] font-black uppercase tracking-[0.2em]">{dept.name}</span>
                                  <span className="text-indigo-400 font-black text-xl">{percentage}%</span>
                               </div>
                               <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                                  <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(99,102,241,0.5)]" style={{ width: `${percentage}%` }}></div>
                               </div>
                               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{dept.count} ACTIVE CASES FILED</p>
                            </div>
                          );
                        })}
                     </div>
                     <div className="mt-20 pt-12 border-t border-white/5">
                        <button className="w-full py-6 bg-white text-slate-900 rounded-[2rem] text-[11px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl">Detailed Departmental Audit</button>
                     </div>
                  </div>
               </div>

               {/* Resolution Velocity Analytics (New Component) */}
               <div className="bg-white p-16 rounded-[4.5rem] border border-slate-50 neo-shadow">
                  <div className="flex items-center justify-between mb-20">
                     <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tight">Resolution Velocity Analytics</h4>
                        <p className="text-lg font-medium text-slate-400 mt-2">Historical data tracking average days taken per closure phase.</p>
                     </div>
                     <div className="px-10 py-5 bg-amber-50 rounded-[2rem] border border-amber-100 flex items-center gap-6">
                        <div className="flex flex-col">
                           <span className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-600">Avg Efficiency</span>
                           <span className="text-3xl font-black text-slate-900 tracking-tighter">{resolutionAnalytics.avg} Days</span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-amber-600 shadow-sm">
                           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                     </div>
                  </div>

                  <div className="h-[350px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={resolutionAnalytics.chartData} barGap={0} barSize={60}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                           <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 900}} dy={15} />
                           <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 900}} unit="d" />
                           <Tooltip 
                              cursor={{fill: '#F8FAFC', radius: 24}}
                              contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px -10px rgb(0 0 0 / 0.1)', padding: '20px'}} 
                           />
                           <Bar dataKey="days" radius={[20, 20, 0, 0]}>
                              {resolutionAnalytics.chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#10b981'} fillOpacity={0.8} />
                              ))}
                           </Bar>
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
                  <div className="mt-12 flex items-center justify-center gap-12 pt-8 border-t border-slate-50">
                     <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]"></div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Institutional Average</p>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Efficiency (SLA)</p>
                     </div>
                  </div>
               </div>
            </div>
          ) : (
            <div className="animate-in slide-in-from-bottom-12 duration-800 space-y-12 relative">
               
               {/* Bulk Action Bar - High Fidelity */}
               {selectedIds.length > 0 && (
                 <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[150] w-[600px] bg-slate-900 rounded-[2.5rem] p-6 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] flex items-center justify-between animate-in slide-in-from-bottom-20 duration-500 border border-white/10">
                    <div className="flex items-center gap-6 pl-4">
                       <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg">
                          {selectedIds.length}
                       </div>
                       <div className="flex flex-col">
                          <span className="text-white text-sm font-black uppercase tracking-widest">Items Selected</span>
                          <button onClick={() => setSelectedIds([])} className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest hover:text-indigo-300 transition-colors text-left">Clear Selection</button>
                       </div>
                    </div>
                    <button 
                      onClick={() => setShowBulkModal(true)}
                      className="px-10 py-4 bg-white text-slate-900 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center gap-3"
                    >
                       Mass Status Update
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    </button>
                 </div>
               )}

               {/* Advanced Management Filters */}
               <div className="bg-white p-10 rounded-[3.5rem] border border-slate-50 neo-shadow flex flex-wrap gap-12 items-end">
                  <div className="space-y-4">
                     <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 ml-3">Campus Infrastructure</label>
                     <select 
                       value={filterBranch}
                       onChange={(e) => setFilterBranch(e.target.value)}
                       className="bg-[#F8FAFC] border border-slate-100 rounded-[1.5rem] px-8 py-5 text-sm font-black outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all min-w-[240px]"
                     >
                        <option value="All">Institutional Branches</option>
                        {branches.map(b => <option key={b} value={b}>{b}</option>)}
                     </select>
                  </div>
                  <div className="space-y-4">
                     <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 ml-3">Department Segment</label>
                     <select 
                       value={filterCategory}
                       onChange={(e) => setFilterCategory(e.target.value)}
                       className="bg-[#F8FAFC] border border-slate-100 rounded-[1.5rem] px-8 py-5 text-sm font-black outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all min-w-[220px]"
                     >
                        <option value="All">All Operations</option>
                        {Object.values(ComplaintCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                     </select>
                  </div>
                  <div className="space-y-4">
                     <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 ml-3">Lifecycle Phase</label>
                     <select 
                       value={filterStatus}
                       onChange={(e) => setFilterStatus(e.target.value)}
                       className="bg-[#F8FAFC] border border-slate-100 rounded-[1.5rem] px-8 py-5 text-sm font-black outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all min-w-[220px]"
                     >
                        <option value="All">All Status Tiers</option>
                        {Object.values(ComplaintStatus).map(s => <option key={s} value={s}>{s}</option>)}
                     </select>
                  </div>
                  <div className="flex-1"></div>
                  <div className="relative pb-2">
                     <input type="text" placeholder="Filter by System ID..." className="bg-white border border-slate-200 rounded-[1.5rem] px-14 py-5 text-sm font-black w-80 focus:ring-4 focus:ring-indigo-500/10 outline-none shadow-inner" />
                     <svg className="w-6 h-6 absolute left-5 top-[50%] translate-y-[-50%] text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
               </div>

               {/* Command Registry Table */}
               <div className="bg-white rounded-[4rem] border border-slate-50 neo-shadow overflow-hidden relative">
                  <div className="overflow-x-auto custom-scrollbar">
                     <table className="w-full">
                        <thead>
                           <tr className="bg-slate-50/50 text-left text-[12px] uppercase tracking-[0.4em] font-black text-slate-400">
                              <th className="px-14 py-10 w-20">
                                 <div 
                                    onClick={toggleSelectAll}
                                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${selectedIds.length === filteredComplaints.length ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-200'}`}
                                 >
                                    {selectedIds.length === filteredComplaints.length && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                                 </div>
                              </th>
                              <th className="px-14 py-10">CONTROL NODE</th>
                              <th className="px-14 py-10">INITIATOR PROFILE</th>
                              <th className="px-14 py-10">DISPATCH NARRATIVE</th>
                              <th className="px-14 py-10">URGENCY TIER</th>
                              <th className="px-14 py-10 text-right">OPERATIONS</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                           {filteredComplaints.map(c => (
                             <tr key={c.id} className={`group hover:bg-[#F8FAFC] transition-colors ${selectedIds.includes(c.id) ? 'bg-indigo-50/30' : ''} ${editingId === c.id ? 'bg-indigo-50/50' : ''}`}>
                                <td className="px-14 py-12">
                                   <div 
                                      onClick={() => toggleSelect(c.id)}
                                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${selectedIds.includes(c.id) ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-200 group-hover:border-slate-300'}`}
                                   >
                                      {selectedIds.includes(c.id) && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                                   </div>
                                </td>
                                <td className="px-14 py-12">
                                   <div className="flex flex-col">
                                      <span className="text-[14px] font-black text-slate-400 font-mono tracking-tighter mb-1 group-hover:text-indigo-600 transition-colors">{c.id}</span>
                                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{c.branch || 'Central Block'}</span>
                                   </div>
                                </td>
                                <td className="px-14 py-12">
                                   <div className="flex items-center gap-5">
                                      <div className="w-12 h-12 rounded-[1.25rem] bg-indigo-50 flex items-center justify-center font-black text-indigo-600 text-base shadow-inner group-hover:scale-110 transition-transform">
                                         {c.studentName.charAt(0)}
                                      </div>
                                      <div className="flex flex-col">
                                         <span className="text-lg font-black text-slate-800">{c.studentName}</span>
                                         <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{c.studentId}</span>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-14 py-12">
                                   {editingId === c.id ? (
                                     <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                                        <input 
                                           value={editTitle}
                                           onChange={(e) => setEditTitle(e.target.value)}
                                           className="px-4 py-3 bg-white border border-indigo-200 rounded-xl text-sm font-black focus:ring-4 focus:ring-indigo-500/10 outline-none w-full shadow-sm"
                                           placeholder="Edit Title..."
                                        />
                                        <textarea 
                                           value={editDescription}
                                           onChange={(e) => setEditDescription(e.target.value)}
                                           className="px-4 py-3 bg-white border border-indigo-200 rounded-xl text-[12px] font-medium focus:ring-4 focus:ring-indigo-500/10 outline-none w-full shadow-sm min-h-[80px] resize-none"
                                           placeholder="Edit Description..."
                                        />
                                     </div>
                                   ) : (
                                     <div className="flex flex-col">
                                        <span className="text-lg font-bold text-slate-800 truncate max-w-[280px] mb-1">{c.title}</span>
                                        <span className="text-[11px] font-black text-indigo-400 uppercase tracking-widest">{c.category}</span>
                                     </div>
                                   )}
                                </td>
                                <td className="px-14 py-12">
                                   <span className={`px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest border shadow-sm ${
                                     c.priority === Priority.HIGH ? 'bg-red-50 text-red-600 border-red-100' :
                                     c.priority === Priority.MEDIUM ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                     'bg-slate-50 text-slate-500 border-slate-100'
                                   }`}>
                                      {c.priority}
                                   </span>
                                </td>
                                <td className="px-14 py-12 text-right">
                                   {editingId === c.id ? (
                                      <div className="flex items-center justify-end gap-3 animate-in fade-in duration-300">
                                         <button 
                                            onClick={() => saveInlineEdit(c.id)}
                                            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg"
                                         >
                                            Save
                                         </button>
                                         <button 
                                            onClick={cancelEditing}
                                            className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-sm"
                                         >
                                            Cancel
                                         </button>
                                      </div>
                                   ) : (
                                      <div className="flex items-center justify-end gap-3">
                                         <button 
                                            onClick={() => startEditing(c)}
                                            className="p-3 bg-white border border-slate-200 hover:border-indigo-600 text-slate-400 hover:text-indigo-600 rounded-xl transition-all shadow-sm group/btn"
                                            title="Edit Narrative"
                                         >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                         </button>
                                         <button 
                                           onClick={() => setSelectedComplaint(c)}
                                           className="px-8 py-3 bg-slate-900 hover:bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-slate-200 transform active:scale-95"
                                         >
                                            Console
                                         </button>
                                      </div>
                                   )}
                                </td>
                             </tr>
                           ))}
                        </tbody>
                      </table>
                  </div>
                  {filteredComplaints.length === 0 && (
                    <div className="py-48 text-center bg-[#F8FAFC]/50">
                       <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                          <svg className="w-12 h-12 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                       </div>
                       <p className="text-slate-300 font-black uppercase tracking-[0.5em] text-sm">System Queue Empty</p>
                    </div>
                  )}
               </div>
            </div>
          )}

          {/* Mass Status Update Confirmation Modal */}
          {showBulkModal && (
            <div className="fixed inset-0 z-[250] flex items-center justify-center p-8 bg-slate-950/80 backdrop-blur-3xl animate-in fade-in duration-500">
               <div className="w-full max-w-2xl bg-white rounded-[4rem] p-16 animate-in zoom-in-95 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-violet-500"></div>
                  
                  <div className="mb-10 text-center">
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Confirm Mass Transition</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">You are about to modify the lifecycle phase for <span className="text-indigo-600 font-black">{selectedIds.length} active grievances</span>. This action is logged and final.</p>
                  </div>

                  <div className="space-y-8">
                     <div className="grid grid-cols-2 gap-4">
                        {[
                          ComplaintStatus.ASSIGNED,
                          ComplaintStatus.UNDER_REVIEW,
                          ComplaintStatus.ACTION_TAKEN,
                          ComplaintStatus.RESOLVED
                        ].map(status => (
                          <button 
                            key={status}
                            onClick={() => setBulkTargetStatus(status)}
                            className={`py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border ${bulkTargetStatus === status ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-400'}`}
                          >
                             {status}
                          </button>
                        ))}
                     </div>

                     <div className="flex gap-4 pt-6">
                        <button 
                          onClick={() => { setShowBulkModal(false); setBulkTargetStatus(null); }}
                          className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                        >
                           Cancel
                        </button>
                        <button 
                          onClick={handleBulkUpdate}
                          disabled={!bulkTargetStatus}
                          className="flex-[2] py-5 bg-slate-900 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           Execute Transitions
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* Ultra-Premium Dispatch Console Modal */}
          {selectedComplaint && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-slate-950/90 backdrop-blur-3xl animate-in fade-in duration-500">
               <div className="w-full max-w-6xl bg-white rounded-[5rem] p-20 animate-in zoom-in-95 relative overflow-hidden shadow-[0_0_150px_-30px_rgba(0,0,0,0.6)]">
                  <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500"></div>
                  
                  <div className="flex justify-between items-start mb-20">
                     <div className="space-y-4">
                        <div className="flex items-center gap-4">
                           <span className="text-[12px] font-black uppercase tracking-[0.5em] text-indigo-500">Operations Protocol</span>
                           <div className="h-4 w-px bg-slate-200"></div>
                           <span className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-300">{selectedComplaint.id}</span>
                        </div>
                        <h3 className="text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl">{selectedComplaint.title}</h3>
                        <p className="text-slate-400 font-bold mt-4 uppercase text-[12px] tracking-[0.3em] flex items-center gap-4">
                           Initiator: {selectedComplaint.studentName} 
                           <span className="text-slate-200">•</span> 
                           Dept: {selectedComplaint.category}
                        </p>
                     </div>
                     <button onClick={() => setSelectedComplaint(null)} className="w-20 h-20 rounded-[2.5rem] bg-[#F8FAFC] flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all border border-slate-100 text-4xl group">
                        <span className="group-hover:rotate-90 transition-transform">&times;</span>
                     </button>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-20">
                     <div className="xl:col-span-7 space-y-16">
                        <div className="bg-[#F8FAFC] p-16 rounded-[4.5rem] border border-slate-50 relative">
                           <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-300 mb-8">CASE intelligence narrative</h4>
                           <p className="text-slate-700 text-2xl font-medium leading-relaxed">{selectedComplaint.description}</p>
                           {selectedComplaint.attachments && selectedComplaint.attachments.length > 0 && (
                              <div className="mt-12 space-y-4">
                                 <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Attached Evidence:</h5>
                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {selectedComplaint.attachments.map((att, idx) => (
                                       <div key={idx} className="p-4 bg-white rounded-2xl border border-indigo-100 flex items-center gap-4 shadow-sm group hover:border-indigo-400 transition-all">
                                          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shadow-inner"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg></div>
                                          <div className="flex flex-col overflow-hidden">
                                             <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest truncate">{att.name}</span>
                                             <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest mt-1 hover:underline">View File</a>
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           )}
                        </div>

                        <div className="space-y-6">
                           <label className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-300 ml-6">Dispatch Remark / ACTION LOG</label>
                           <textarea 
                             value={remark}
                             onChange={(e) => setRemark(e.target.value)}
                             placeholder="Provide precise resolution details or internal departmental notes..."
                             rows={5}
                             className="w-full px-12 py-10 bg-white border border-slate-200 rounded-[4rem] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all text-xl font-medium shadow-inner resize-none leading-relaxed"
                           />
                        </div>
                     </div>

                     <div className="xl:col-span-5 flex flex-col gap-10">
                        <div className="bg-slate-900 rounded-[4.5rem] p-16 text-white shadow-2xl relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full -mr-40 -mt-40 blur-[100px]"></div>
                           <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-12 text-center">Transition Protocol</h4>
                           <div className="grid grid-cols-1 gap-5">
                              {[
                                ComplaintStatus.ASSIGNED,
                                ComplaintStatus.UNDER_REVIEW,
                                ComplaintStatus.ACTION_TAKEN,
                                ComplaintStatus.RESOLVED
                              ].map(s => (
                                <button 
                                  key={s}
                                  onClick={() => handleUpdateStatus(selectedComplaint.id, s)}
                                  className={`group py-7 rounded-[2rem] text-[12px] font-black uppercase tracking-[0.2em] transition-all transform active:scale-95 flex items-center justify-center gap-4 ${
                                    s === ComplaintStatus.RESOLVED 
                                      ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xl shadow-emerald-900/40' 
                                      : 'bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 hover:border-indigo-500'
                                  }`}
                                >
                                   {s}
                                   <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </button>
                              ))}
                           </div>
                        </div>

                        <div className="mt-auto p-12 bg-indigo-50/50 rounded-[4rem] border border-indigo-100/50 text-center flex flex-col items-center">
                           <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-200">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                           </div>
                           <p className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-3">Live Dispatch Notification</p>
                           <p className="text-sm font-bold text-slate-800 leading-relaxed max-w-sm">Status transitions trigger immediate encrypted alerts to the initiator's portal and official university log.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
