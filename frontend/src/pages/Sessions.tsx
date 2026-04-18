import React, { useState, useEffect } from 'react';
import { getAttendances } from '../services/attendanceService';
import { getStudents } from '../services/studentService';
import { Attendance, Student } from '../types';
import { 
  ClipboardList, Search, Filter, 
  Clock, Trash2, Edit3
} from 'lucide-react';
import { format } from 'date-fns';
import LogSessionModal from '../components/LogSessionModal';

const Sessions: React.FC = () => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    try {
      const [aData, sData] = await Promise.all([
        getAttendances(),
        getStudents()
      ]);
      setAttendances(aData);
      setStudents(sData);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStudentName = (id: number) => {
    return students.find(s => s.id === id)?.name || "Unknown Student";
  };

  const filteredHistory = attendances.filter(a => 
    getStudentName(a.student_id).toLowerCase().includes(search.toLowerCase()) ||
    a.notes?.toLowerCase().includes(search.toLowerCase())
  ).sort((a,b) => b.id - a.id);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-white mb-2 tracking-tight">Session History</h1>
          <p className="text-brand-muted font-medium flex items-center">
            <ClipboardList className="w-4 h-4 mr-2 text-brand-gold" />
            Archive of all logged studio classes
          </p>
        </div>
        <button 
          onClick={() => setIsLogModalOpen(true)}
          className="premium-btn-primary"
        >
          <Edit3 className="w-5 h-5 mr-2" /> Log Class
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-brand-surface border border-white/5 p-2 rounded-2xl">
        <div className="relative flex-grow max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-darkMuted" />
          <input 
            type="text" 
            placeholder="Search by student or notes..."
            className="w-full bg-brand-bg/50 border-none rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:ring-1 focus:ring-brand-gold/20 transition-all text-white placeholder:text-brand-darkMuted"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center px-4 text-brand-darkMuted text-xs font-black uppercase tracking-widest border-l border-white/5 ml-2">
           <Filter className="w-4 h-4 mr-2" /> All Logs
        </div>
      </div>

      {/* Session List */}
      <div className="space-y-4">
        {filteredHistory.map((record) => (
          <div 
            key={record.id} 
            className="card flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-white/10 animate-in slide-in-from-left duration-300"
          >
            <div className="flex items-center space-x-6">
              {/* Date Box */}
              <div className="bg-brand-surfaceLight border border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center min-w-[72px] shadow-lg">
                <span className="text-[10px] font-black uppercase tracking-tighter text-brand-gold opacity-80">
                  {format(new Date(record.class_date), 'MMM')}
                </span>
                <span className="text-2xl font-serif font-bold text-white leading-none mt-1">
                  {format(new Date(record.class_date), 'dd')}
                </span>
              </div>

              {/* Info */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <h4 className="text-lg font-serif font-bold text-white group-hover:text-brand-gold transition-colors">
                    {getStudentName(record.student_id)}
                  </h4>
                  <div className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${
                    record.status === 'Present' 
                    ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                    : 'bg-red-500/10 text-red-500 border-red-500/20'
                  }`}>
                    {record.status}
                  </div>
                </div>
                {record.notes ? (
                  <p className="text-xs text-brand-muted italic max-w-sm line-clamp-1">
                    &quot;{record.notes}&quot;
                  </p>
                ) : (
                  <p className="text-[11px] text-brand-darkMuted italic italic">No session notes recorded</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
               <div className="flex items-center text-brand-darkMuted space-x-4">
                  <span className="text-[10px] font-bold flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> {format(new Date(record.class_date), 'hh:mm a')}
                  </span>
               </div>
               <div className="flex space-x-2">
                 <button className="p-2 hover:bg-white/5 rounded-xl transition-all text-brand-darkMuted hover:text-white">
                   <Edit3 className="w-4 h-4" />
                 </button>
                 <button className="p-2 hover:bg-red-500/10 rounded-xl transition-all text-brand-darkMuted hover:text-red-500">
                   <Trash2 className="w-4 h-4" />
                 </button>
               </div>
            </div>
          </div>
        ))}
        {filteredHistory.length === 0 && (
          <div className="card p-20 text-center flex flex-col items-center justify-center space-y-4 border-dashed border-2 border-white/5">
            <ClipboardList className="w-12 h-12 text-brand-darkMuted" />
            <p className="text-brand-muted italic">No attendance records found.</p>
          </div>
        )}
      </div>

      <LogSessionModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default Sessions;
