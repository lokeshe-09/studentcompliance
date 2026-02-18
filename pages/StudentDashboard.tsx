
import React, { useState, useRef } from 'react';
import { User, Complaint, ComplaintCategory, Priority, ComplaintStatus, Attachment } from '../types';

interface StudentDashboardProps {
  user: User;
  complaints: Complaint[];
  onAddComplaint: (c: Complaint) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, complaints, onAddComplaint }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'new' | 'history'>('overview');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>(ComplaintCategory.ACADEMIC);
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [attachments, setAttachments] = useState<File[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const myComplaints = complaints.filter(c => c.studentId === user.id);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const mockAttachments: Attachment[] = attachments.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file)
    }));

    const newComplaint: Complaint = {
      id: `CMP-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: user.id,
      studentName: user.fullName,
      title,
      description,
      category,
      priority,
      status: ComplaintStatus.SUBMITTED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      remarks: [],
      attachments: mockAttachments
    };
    onAddComplaint(newComplaint);
    setTitle('');
    setDescription('');
    setAttachments([]);
    setActiveTab('history');
  };

  const getStatusConfig = (status: ComplaintStatus) => {
    switch (status) {
      case ComplaintStatus.RESOLVED: return { bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', icon: 'M5 13l4 4L19 7', label: 'Case Resolved' };
      case ComplaintStatus.ACTION_TAKEN: return { bg: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: 'M13 10V3L4 14h7v7l9-11h-7z', label: 'Action Taken' };
      case ComplaintStatus.UNDER_REVIEW: return { bg: 'bg-amber-500/10 text-amber-600 border-amber-500/20', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z', label: 'In Review' };
      case ComplaintStatus.ASSIGNED: return { bg: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0z', label: 'Dispatched' };
      default: return { bg: 'bg-slate-500/10 text-slate-500 border-slate-500/20', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', label: 'Filing Phase' };
    }
  };

  return (
    <div className="flex h-[calc(100vh-100px)] overflow-hidden bg-[#F8FAFC]">
      {/* Sidebar - Premium Minimalist */}
      <aside className="w-80 h-full bg-white border-r border-slate-100 flex flex-col px-8 py-10">
        <div className="mb-12">
          <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Operations</h3>
          <nav className="space-y-2">
            {[
              { id: 'overview', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
              { id: 'new', label: 'New Filing', icon: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z' },
              { id: 'history', label: 'Tracking Logs', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' }
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => { setActiveTab(item.id as any); setSelectedComplaint(null); }}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-sm ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} /></svg>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl transition-transform duration-700 group-hover:scale-150"></div>
            <h4 className="text-lg font-black leading-tight mb-2 relative z-10">Institutional <br/>Redressal Center</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6 relative z-10">48-Hour Response SLA</p>
            <button className="w-full py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-colors relative z-10">Live Support</button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-12 lg:p-16">
        <div className="max-w-6xl mx-auto">
          
          {activeTab === 'overview' && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-12">
              <header className="flex justify-between items-end">
                <div className="space-y-2">
                  <h1 className="text-5xl font-black text-slate-900 tracking-tight">Institutional <span className="text-indigo-600">Insights</span></h1>
                  <p className="text-slate-400 text-lg font-medium">Monitoring resolution health for {user.fullName}.</p>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm">
                   <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Nominal</span>
                </div>
              </header>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { label: 'Pending Dispatches', val: myComplaints.filter(c => c.status !== ComplaintStatus.RESOLVED).length, color: 'indigo', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                  { label: 'Total Resolutions', val: myComplaints.filter(c => c.status === ComplaintStatus.RESOLVED).length, color: 'emerald', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                  { label: 'Active Grievances', val: myComplaints.length, color: 'violet', icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' }
                ].map(stat => (
                  <div key={stat.label} className="bg-white p-10 rounded-[3rem] border border-slate-50 neo-shadow group hover:border-indigo-100 transition-all">
                    <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 mb-8 group-hover:scale-110 transition-transform`}>
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={stat.icon} /></svg>
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{stat.label}</p>
                    <h3 className="text-5xl font-black text-slate-900 tracking-tighter">{stat.val}</h3>
                  </div>
                ))}
              </div>

              {/* Recent Activity Table */}
              <div className="bg-white rounded-[3.5rem] border border-slate-50 neo-shadow overflow-hidden">
                <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Tracking Protocol</h3>
                  <button onClick={() => setActiveTab('history')} className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">View Global History</button>
                </div>
                <div className="divide-y divide-slate-50">
                  {myComplaints.slice(0, 4).map(c => (
                    <div key={c.id} className="p-10 hover:bg-slate-50/50 transition-all flex items-center gap-10 group cursor-pointer" onClick={() => { setSelectedComplaint(c); setActiveTab('history'); }}>
                      <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-2xl border transition-colors ${getStatusConfig(c.status).bg}`}>
                        {c.category === ComplaintCategory.ACADEMIC ? '📚' : c.category === ComplaintCategory.HOSTEL ? '🏠' : '🛠️'}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-black text-slate-800 group-hover:text-indigo-600 transition-colors mb-1">{c.title}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.category} Dept • {new Date(c.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                         <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${getStatusConfig(c.status).bg}`}>
                            {c.status}
                         </span>
                         <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Live Status</span>
                      </div>
                    </div>
                  ))}
                  {myComplaints.length === 0 && (
                    <div className="p-32 text-center">
                       <p className="text-slate-300 font-black uppercase tracking-[0.4em] text-sm italic">No Pending Dispatches Found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'new' && (
            <div className="animate-in slide-in-from-right-8 duration-700 max-w-4xl mx-auto">
               <div className="bg-white rounded-[4rem] p-16 lg:p-24 border border-slate-50 neo-shadow">
                  <header className="mb-16">
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-3 block">Service Protocol</span>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">Submit Institutional Grievance</h2>
                    <p className="text-slate-400 text-lg font-medium mt-4">Provide categorical details and evidence to facilitate rapid departmental assignment.</p>
                  </header>

                  <form onSubmit={handleSubmit} className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <div className="space-y-4">
                          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-3">Target Department</label>
                          <select 
                            value={category}
                            onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                            className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 outline-none transition-all font-bold text-slate-800"
                          >
                            {Object.values(ComplaintCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                       </div>
                       <div className="space-y-4">
                          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-3">Impact Level</label>
                          <select 
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as Priority)}
                            className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 outline-none transition-all font-bold text-slate-800"
                          >
                            {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-3">Complaint Narrative Header</label>
                       <input 
                         type="text"
                         value={title}
                         onChange={(e) => setTitle(e.target.value)}
                         placeholder="e.g., HVAC Malfunction in Hall-4..."
                         className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 outline-none transition-all font-bold text-slate-800"
                         required
                       />
                    </div>

                    <div className="space-y-4">
                       <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-3">Detailed Evidence Summary</label>
                       <textarea 
                         value={description}
                         onChange={(e) => setDescription(e.target.value)}
                         placeholder="Explain the technical or administrative failure in detail. Mention specific dates, names, and exact campus locations..."
                         rows={6}
                         className="w-full px-10 py-8 bg-slate-50 border border-slate-100 rounded-[3rem] focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 outline-none transition-all font-medium text-slate-800 resize-none leading-relaxed"
                         required
                       />
                    </div>

                    {/* Enhanced Multiple File Upload Area */}
                    <div className="space-y-4">
                       <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-3">Proof of Incident (Multiple Attachments)</label>
                       <div 
                         onClick={() => fileInputRef.current?.click()}
                         className="w-full border-2 border-dashed rounded-[3rem] p-16 flex flex-col items-center justify-center transition-all cursor-pointer bg-slate-50 border-slate-100 hover:border-indigo-400 hover:bg-white"
                       >
                          <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            className="hidden" 
                            accept="image/*,.pdf" 
                            multiple 
                          />
                          <div className="w-20 h-20 rounded-3xl mb-6 flex items-center justify-center bg-white text-slate-300 shadow-sm border border-slate-100">
                             <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                          </div>
                          <p className="text-xl font-black text-slate-800">Select Evidence Files</p>
                          <p className="text-[11px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Supports multiple PNG, JPG, or PDF (Max 10MB each)</p>
                       </div>

                       {/* List of uploaded files */}
                       {attachments.length > 0 && (
                         <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                           {attachments.map((file, idx) => (
                             <div key={idx} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-sm group">
                               <div className="flex items-center gap-3 overflow-hidden">
                                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                  </div>
                                  <span className="text-xs font-bold text-slate-700 truncate">{file.name}</span>
                               </div>
                               <button 
                                 type="button" 
                                 onClick={(e) => { e.stopPropagation(); removeFile(idx); }} 
                                 className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                               >
                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                               </button>
                             </div>
                           ))}
                         </div>
                       )}
                    </div>

                    <div className="pt-12 border-t border-slate-100 flex justify-end">
                       <button type="submit" className="px-16 py-6 bg-slate-900 hover:bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-4">
                          Initiate Resolution
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                       </button>
                    </div>
                  </form>
               </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="animate-in fade-in duration-1000">
               {!selectedComplaint ? (
                 <div className="bg-white rounded-[4rem] border border-slate-50 neo-shadow overflow-hidden">
                    <div className="p-16 border-b border-slate-50">
                       <h2 className="text-3xl font-black text-slate-900 tracking-tight">Resolution Archive</h2>
                       <p className="text-slate-400 text-lg font-medium mt-2">Comprehensive lifecycle tracking for all submitted filings.</p>
                    </div>
                    <div className="overflow-x-auto">
                       <table className="w-full">
                          <thead>
                             <tr className="bg-slate-50/50 text-left text-[11px] uppercase tracking-[0.3em] font-black text-slate-400">
                                <th className="px-12 py-8">Internal ID</th>
                                <th className="px-12 py-8">Subject Narrative</th>
                                <th className="px-12 py-8">Dispatch Phase</th>
                                <th className="px-12 py-8 text-right">Process</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                             {myComplaints.map(c => (
                               <tr key={c.id} className="group hover:bg-slate-50/50 transition-colors">
                                  <td className="px-12 py-10">
                                     <div className="flex flex-col">
                                        <span className="text-[12px] font-black text-slate-400 font-mono tracking-tighter mb-1">{c.id}</span>
                                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Filed {new Date(c.createdAt).toLocaleDateString()}</span>
                                     </div>
                                  </td>
                                  <td className="px-12 py-10">
                                     <div className="flex items-center gap-6">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl border ${getStatusConfig(c.status).bg}`}>
                                           {c.category === ComplaintCategory.ACADEMIC ? '📚' : c.category === ComplaintCategory.HOSTEL ? '🏠' : '🛠️'}
                                        </div>
                                        <div className="flex flex-col">
                                           <span className="text-base font-black text-slate-800">{c.title}</span>
                                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.category} Dept</span>
                                        </div>
                                     </div>
                                  </td>
                                  <td className="px-12 py-10">
                                     <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${getStatusConfig(c.status).bg}`}>
                                        {c.status}
                                     </span>
                                  </td>
                                  <td className="px-12 py-10 text-right">
                                     <button 
                                       onClick={() => setSelectedComplaint(c)}
                                       className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
                                     >
                                        Track Intel
                                     </button>
                                  </td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
               ) : (
                 <div className="bg-white rounded-[4rem] border border-slate-50 neo-shadow p-16 lg:p-24 animate-in slide-in-from-right-12 duration-700">
                    <header className="flex flex-wrap items-start justify-between gap-10 mb-20">
                       <div className="space-y-6">
                          <button 
                            onClick={() => setSelectedComplaint(null)}
                            className="flex items-center gap-3 text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 mb-8"
                          >
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                             Return to Registry
                          </button>
                          <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-tight max-w-3xl">{selectedComplaint.title}</h2>
                          <div className="flex items-center gap-6 mt-8">
                             <span className={`px-8 py-3 rounded-2xl text-[12px] font-black uppercase tracking-widest border ${getStatusConfig(selectedComplaint.status).bg}`}>{selectedComplaint.status}</span>
                             <div className="h-8 w-px bg-slate-100"></div>
                             <span className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">{selectedComplaint.id} • FILED {new Date(selectedComplaint.createdAt).toLocaleString()}</span>
                          </div>
                       </div>
                    </header>

                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-20">
                       <div className="xl:col-span-8 space-y-20">
                          <section>
                             <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-300 mb-10 flex items-center gap-6">
                                CASE intel analysis 
                                <div className="h-px bg-slate-50 flex-1"></div>
                             </h4>
                             <div className="bg-[#F8FAFC] p-16 rounded-[4rem] border border-slate-50 leading-relaxed relative">
                                <div className="absolute top-8 left-8 text-indigo-100 font-serif text-8xl leading-none opacity-50 italic">"</div>
                                <p className="text-slate-700 text-2xl font-medium whitespace-pre-wrap relative z-10">{selectedComplaint.description}</p>
                                
                                {selectedComplaint.attachments && selectedComplaint.attachments.length > 0 && (
                                  <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                     {selectedComplaint.attachments.map((att, idx) => (
                                       <div key={idx} className="p-6 bg-white rounded-[2rem] border border-slate-100 flex items-center gap-6 group hover:border-indigo-200 transition-all shadow-sm">
                                          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner group-hover:scale-110 transition-transform"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg></div>
                                          <div className="flex-1 overflow-hidden">
                                             <p className="text-sm font-black text-slate-800 truncate">{att.name}</p>
                                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Verified Evidence</p>
                                          </div>
                                          <a href={att.url} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-slate-900 text-white rounded-[1.25rem] text-[9px] font-black uppercase tracking-widest shadow-xl hover:bg-indigo-600 transition-colors">View</a>
                                       </div>
                                     ))}
                                  </div>
                                )}
                             </div>
                          </section>

                          <section>
                             <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-300 mb-10 flex items-center gap-6">
                                OFFICIAL department feedback 
                                <div className="h-px bg-slate-50 flex-1"></div>
                             </h4>
                             <div className="space-y-8">
                                {selectedComplaint.remarks.map((remark, i) => (
                                  <div key={i} className="flex gap-10 group animate-in slide-in-from-left-6" style={{ animationDelay: `${i * 150}ms` }}>
                                     <div className="w-14 h-14 rounded-[1.5rem] bg-slate-900 flex items-center justify-center text-white font-black text-xl flex-shrink-0 shadow-2xl relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                                        R
                                     </div>
                                     <div className="bg-white p-12 rounded-[3.5rem] border border-slate-50 neo-shadow flex-1 relative">
                                        <div className="absolute -left-3 top-8 w-6 h-6 bg-white border-l border-b border-slate-100 rotate-45"></div>
                                        <p className="text-slate-700 text-xl font-medium leading-relaxed">{remark}</p>
                                        <div className="flex items-center gap-3 mt-6">
                                           <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                           <p className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.2em]">Verified Response • Internal Dispatch Cell</p>
                                        </div>
                                     </div>
                                  </div>
                                ))}
                                {selectedComplaint.remarks.length === 0 && (
                                  <div className="py-32 text-center border-4 border-dashed border-slate-50 rounded-[4rem]">
                                     <p className="text-slate-300 font-black uppercase tracking-[0.5em] text-sm">Protocol Pending Departmental Processing</p>
                                  </div>
                                )}
                             </div>
                          </section>
                       </div>

                       <div className="xl:col-span-4">
                          <div className="sticky top-12 space-y-10">
                             <div className="bg-slate-900 rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full -mr-40 -mt-40 blur-[100px]"></div>
                                <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-12 text-center">Resolution roadmap</h4>
                                <div className="space-y-0 relative max-w-[240px] mx-auto">
                                   <div className="absolute left-[15px] top-3 bottom-16 w-[3px] bg-white/5"></div>
                                   {[
                                     ComplaintStatus.SUBMITTED,
                                     ComplaintStatus.ASSIGNED,
                                     ComplaintStatus.UNDER_REVIEW,
                                     ComplaintStatus.ACTION_TAKEN,
                                     ComplaintStatus.RESOLVED
                                   ].map((s, i) => {
                                     const statuses = [
                                       ComplaintStatus.SUBMITTED,
                                       ComplaintStatus.ASSIGNED,
                                       ComplaintStatus.UNDER_REVIEW,
                                       ComplaintStatus.ACTION_TAKEN,
                                       ComplaintStatus.RESOLVED
                                     ];
                                     const currentIdx = statuses.indexOf(selectedComplaint.status);
                                     const isReached = i <= currentIdx;
                                     const isCurrent = i === currentIdx;

                                     return (
                                       <div key={s} className="flex gap-10 pb-16 relative z-10">
                                          <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-all duration-700 ${isReached ? 'bg-indigo-500 border-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.5)]' : 'bg-slate-900 border-white/10'}`}>
                                             {isReached && !isCurrent && <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                                             {isCurrent && <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse shadow-[0_0_15px_white]"></div>}
                                          </div>
                                          <div className="pt-1">
                                             <p className={`text-[12px] font-black uppercase tracking-[0.2em] transition-colors duration-700 ${isReached ? 'text-white' : 'text-slate-600'}`}>{s}</p>
                                             {isCurrent && <p className="text-[10px] font-bold text-indigo-400 mt-2 uppercase tracking-tighter">Current Lifecycle State</p>}
                                          </div>
                                       </div>
                                     );
                                   })}
                                </div>
                             </div>

                             <div className="bg-white p-10 rounded-[3.5rem] border border-slate-50 neo-shadow">
                                <h5 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] mb-6">Concierge Direct</h5>
                                <div className="flex items-center gap-4 mb-4">
                                   <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs">CS</div>
                                   <div className="flex flex-col">
                                      <p className="text-sm font-black text-slate-800">Support Lead</p>
                                      <p className="text-[11px] font-bold text-slate-400">grievance@university.edu</p>
                                   </div>
                                </div>
                                <button className="w-full mt-6 py-5 bg-[#F8FAFC] border border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all">Encrypted Admin Chat</button>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
               )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
