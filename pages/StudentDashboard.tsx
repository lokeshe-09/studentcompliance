
import React, { useState, useRef } from 'react';
import { User, Complaint, ComplaintCategory, Priority, ComplaintStatus, Attachment } from '../types';

interface StudentDashboardProps {
  user: User;
  complaints: Complaint[];
  onAddComplaint: (c: Complaint) => void;
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
      setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
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
      case ComplaintStatus.RESOLVED: return { bg: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: 'M5 13l4 4L19 7' };
      case ComplaintStatus.ACTION_TAKEN: return { bg: 'bg-teal-50 text-teal-600 border-teal-100', icon: 'M13 10V3L4 14h7v7l9-11h-7z' };
      case ComplaintStatus.UNDER_REVIEW: return { bg: 'bg-amber-50 text-amber-600 border-amber-100', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' };
      case ComplaintStatus.ASSIGNED: return { bg: 'bg-indigo-50 text-indigo-600 border-indigo-100', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0z' };
      default: return { bg: 'bg-slate-50 text-slate-500 border-slate-100', icon: 'M9 12h6m-6 4h6' };
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 h-full bg-white border-r border-slate-200 flex flex-col px-6 py-10 z-[50]">
        <div className="space-y-10">
          <div>
            <h3 className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Navigation</h3>
            <nav className="space-y-3">
              {[
                { id: 'overview', label: 'Command Center', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                { id: 'new', label: 'File Complaint', icon: 'M12 4v16m8-8H4' },
                { id: 'history', label: 'View Registry', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' }
              ].map(item => (
                <button 
                  key={item.id}
                  onClick={() => { setActiveTab(item.id as any); setSelectedComplaint(null); }}
                  className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all font-bold text-xs group ${
                    activeTab === item.id 
                      ? `bg-slate-950 text-white shadow-xl` 
                      : `text-slate-500 hover:bg-slate-50 hover:text-indigo-600`
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} /></svg>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-auto">
          <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl">
            <h4 className="text-sm font-black mb-2">Support Unit</h4>
            <p className="text-[10px] text-slate-400 mb-4 leading-tight">Direct line for urgent campus assistance.</p>
            <button className="w-full py-2.5 bg-white text-slate-950 rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-indigo-500 hover:text-white transition-all">Contact Now</button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-10 lg:p-14 relative bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto">
          
          {activeTab === 'overview' && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-12">
              <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-md">Account: Active</span>
                  </div>
                  <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none">Console <span className="text-indigo-600">Overview</span></h1>
                  <p className="text-slate-400 text-lg font-medium max-w-xl">Central telemetry for your institutional filings.</p>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { label: 'Active Issues', val: myComplaints.filter(c => c.status !== ComplaintStatus.RESOLVED).length, color: 'indigo', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                  { label: 'Resolved Phase', val: myComplaints.filter(c => c.status === ComplaintStatus.RESOLVED).length, color: 'teal', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                  { label: 'Total Logs', val: myComplaints.length, color: 'violet', icon: 'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5' }
                ].map(stat => (
                  <div key={stat.label} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 group transition-all duration-500 hover:shadow-md">
                    <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 mb-8`}>
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={stat.icon} /></svg>
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-300 mb-1">{stat.label}</p>
                    <h3 className="text-5xl font-black text-slate-900 tracking-tighter">{stat.val}</h3>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Recent Dispatches</h3>
                  <button onClick={() => setActiveTab('history')} className="text-xs font-black text-indigo-600 hover:underline">Full Registry</button>
                </div>
                <div className="divide-y divide-slate-50">
                  {myComplaints.slice(0, 4).map(c => (
                    <div key={c.id} className="p-8 hover:bg-slate-50/50 transition-all flex items-center gap-8 group cursor-pointer" onClick={() => { setSelectedComplaint(c); setActiveTab('history'); }}>
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-slate-100 bg-white shadow-sm group-hover:border-indigo-200 transition-colors`}>
                        <CategoryIcon category={c.category} className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                           <span className="text-[11px] font-black text-indigo-500 uppercase tracking-widest font-mono">{c.id}</span>
                           <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{c.category} Unit</span>
                        </div>
                        <h4 className="text-xl font-black text-slate-800 truncate group-hover:text-indigo-600 transition-colors">{c.title}</h4>
                      </div>
                      <div className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusConfig(c.status).bg}`}>
                         {c.status}
                      </div>
                    </div>
                  ))}
                  {myComplaints.length === 0 && (
                    <div className="py-24 text-center">
                       <p className="text-slate-300 font-black uppercase tracking-widest text-sm">Registry is Empty</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'new' && (
            <div className="animate-in slide-in-from-right-8 duration-700 max-w-5xl mx-auto py-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4 space-y-8">
                  <div className="bg-indigo-600 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-10 backdrop-blur-md">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </div>
                      <h2 className="text-4xl font-black tracking-tight mb-6">Lodge Dispatch</h2>
                      <p className="text-indigo-100 text-base font-medium leading-relaxed">
                        Ensure all details are accurate for high-speed triage.
                      </p>
                      <div className="mt-12 pt-8 border-t border-white/10 space-y-4">
                         <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                            <span className="text-[11px] font-black uppercase tracking-widest">End-to-End Secure</span>
                         </div>
                         <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                            <span className="text-[11px] font-black uppercase tracking-widest">Priority Routing</span>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8">
                  <form onSubmit={handleSubmit} className="space-y-10 bg-white rounded-[3rem] p-10 lg:p-14 border border-slate-100 shadow-sm">
                    <div className="space-y-6">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-4">Dispatch Classification</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {Object.values(ComplaintCategory).map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setCategory(cat)}
                            className={`flex flex-col items-center gap-4 p-6 rounded-[2rem] border-2 transition-all group ${
                              category === cat 
                                ? 'bg-indigo-50 border-indigo-500 shadow-xl shadow-indigo-500/10' 
                                : 'bg-white border-slate-100 hover:border-indigo-200'
                            }`}
                          >
                            <div className={`p-4 rounded-2xl transition-all ${category === cat ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-indigo-500'}`}>
                              <CategoryIcon category={cat} className="w-6 h-6" />
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${category === cat ? 'text-indigo-700' : 'text-slate-500'}`}>{cat}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <div className="space-y-3">
                          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-4">Subject Headline</label>
                          <input 
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Primary issue subject"
                            className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-500 outline-none transition-all font-bold text-slate-800 text-base"
                            required
                          />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-4">Tier Level</label>
                          <div className="flex bg-slate-50 p-2 rounded-[1.5rem] border border-slate-100">
                             {Object.values(Priority).map((p) => (
                               <button
                                 key={p}
                                 type="button"
                                 onClick={() => setPriority(p)}
                                 className={`flex-1 py-4 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                   priority === p 
                                     ? p === Priority.HIGH ? 'bg-rose-500 text-white shadow-lg' : p === Priority.MEDIUM ? 'bg-amber-500 text-white shadow-lg' : 'bg-slate-900 text-white shadow-lg'
                                     : 'text-slate-400 hover:text-slate-600'
                                 }`}
                               >
                                  {p}
                               </button>
                             ))}
                          </div>
                       </div>
                    </div>

                    <div className="space-y-3">
                       <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-4">Detailed Narrative</label>
                       <textarea 
                         value={description}
                         onChange={(e) => setDescription(e.target.value)}
                         placeholder="Comprehensive narrative of the dispatch..."
                         rows={6}
                         className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-500 outline-none transition-all font-medium text-slate-800 text-base resize-none"
                         required
                       />
                    </div>

                    <div className="pt-6">
                       <button type="submit" className="w-full py-6 bg-slate-950 hover:bg-indigo-600 text-white rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-4 group">
                          Initialize Protocol
                          <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                       </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="animate-in fade-in duration-700">
               {!selectedComplaint ? (
                 <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-10 border-b border-slate-50">
                       <h2 className="text-3xl font-black text-slate-900 tracking-tight">Audit Registry</h2>
                       <p className="text-slate-400 text-base font-medium mt-1">Timeline of all historical dispatches.</p>
                    </div>
                    <div className="overflow-x-auto">
                       <table className="w-full">
                          <thead>
                             <tr className="bg-slate-50 text-left text-[11px] uppercase tracking-widest font-black text-slate-400">
                                <th className="px-10 py-6">ID</th>
                                <th className="px-10 py-6">Subject</th>
                                <th className="px-10 py-6">Status</th>
                                <th className="px-10 py-6 text-right">Action</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                             {myComplaints.map(c => (
                               <tr key={c.id} className="group hover:bg-slate-50 transition-all cursor-pointer" onClick={() => setSelectedComplaint(c)}>
                                  <td className="px-10 py-7">
                                     <span className="text-base font-black text-slate-400 font-mono tracking-tighter uppercase">{c.id}</span>
                                  </td>
                                  <td className="px-10 py-7">
                                     <div className="flex items-center gap-6">
                                        <CategoryIcon category={c.category} className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                                        <span className="text-lg font-black text-slate-800 truncate max-w-[400px]">{c.title}</span>
                                     </div>
                                  </td>
                                  <td className="px-10 py-7">
                                     <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusConfig(c.status).bg}`}>
                                        {c.status}
                                     </span>
                                  </td>
                                  <td className="px-10 py-7 text-right">
                                     <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-300 group-hover:text-indigo-600 group-hover:bg-white transition-all ml-auto">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7" /></svg>
                                     </div>
                                  </td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
               ) : (
                 <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-10 lg:p-14 animate-in slide-in-from-right-8 duration-700">
                    <header className="mb-14">
                       <button onClick={() => setSelectedComplaint(null)} className="flex items-center gap-3 text-[10px] font-black text-slate-400 hover:text-indigo-600 mb-8 transition-all uppercase tracking-[0.2em]">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                          Return to Registry
                       </button>
                       <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl">{selectedComplaint.title}</h2>
                       <div className="flex items-center gap-8 mt-8">
                          <span className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${getStatusConfig(selectedComplaint.status).bg}`}>{selectedComplaint.status}</span>
                          <span className="text-base font-bold text-slate-300 uppercase tracking-[0.2em] font-mono">{selectedComplaint.id}</span>
                       </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                       <div className="lg:col-span-8 space-y-16">
                          <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 relative">
                             <div className="absolute top-8 right-10 opacity-10">
                                <CategoryIcon category={selectedComplaint.category} className="w-20 h-20" />
                             </div>
                             <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-300 mb-6">Dispatch Details</h4>
                             <p className="text-slate-700 text-xl leading-relaxed whitespace-pre-wrap font-medium">{selectedComplaint.description}</p>
                          </div>

                          <div className="space-y-8">
                             <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-300 ml-4">Administrative Feedback</h4>
                             <div className="space-y-6">
                                {selectedComplaint.remarks.map((remark, i) => (
                                  <div key={i} className="flex gap-6 group">
                                     <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow-lg">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                     </div>
                                     <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex-1 group-hover:shadow-md transition-shadow">
                                        <p className="text-slate-700 text-lg leading-relaxed">{remark}</p>
                                        <div className="mt-6 flex items-center gap-3">
                                           <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                                           <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Administrative Response</p>
                                        </div>
                                     </div>
                                  </div>
                                ))}
                                {selectedComplaint.remarks.length === 0 && (
                                  <div className="py-20 flex flex-col items-center justify-center border-4 border-dashed rounded-[3rem] border-slate-50">
                                     <p className="text-slate-300 font-black uppercase tracking-widest text-sm">Response Loop Pending</p>
                                  </div>
                                )}
                             </div>
                          </div>
                       </div>

                       <div className="lg:col-span-4">
                          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl">
                             <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-12 text-center">Lifecycle Tracking</h4>
                             <div className="space-y-0 relative max-w-[240px] mx-auto">
                                <div className="absolute left-[23px] top-6 bottom-20 w-[2px] bg-white/5"></div>
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
                                    <div key={s} className="flex gap-8 pb-14 relative z-10">
                                       <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-all duration-700 ${
                                         isReached ? 'bg-indigo-500 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]' : 'bg-slate-900 border-white/10'
                                       }`}>
                                          {isReached && !isCurrent && <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                                          {isCurrent && <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>}
                                       </div>
                                       <div className="pt-3">
                                          <p className={`text-sm font-black uppercase tracking-widest transition-colors duration-500 ${isReached ? 'text-white' : 'text-slate-600'}`}>{s}</p>
                                       </div>
                                    </div>
                                  );
                                })}
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
