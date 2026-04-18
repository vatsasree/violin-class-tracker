import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudent, deleteStudent } from '../services/studentService';
import { getLessons } from '../services/lessonService';
import { getAttendances } from '../services/attendanceService';
import { Student, Lesson, Attendance } from '../types';
import { 
  ArrowLeft, Mail, Clock, Music, Calendar, 
  ClipboardList, Plus, Edit2, Trash2, 
  ChevronRight, CheckCircle2, XCircle, AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import AddLessonModal from '../components/AddLessonModal';
import EditStudentModal from '../components/EditStudentModal';
import LogSessionModal from '../components/LogSessionModal';

const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [history, setHistory] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const fetchStudentData = async () => {
    if (!id) return;
    try {
      const studentId = parseInt(id);
      const [sData, lData, hData] = await Promise.all([
        getStudent(studentId),
        getLessons(studentId),
        getAttendances(studentId)
      ]);
      setStudent(sData);
      setLessons(lData);
      setHistory(hData);
    } catch (error) {
      console.error("Failed to fetch student profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [id]);

  const handleDelete = async () => {
    if (!student || !window.confirm(`Are you sure you want to unregister ${student.name}? All lesson and attendance history will be permanently deleted.`)) return;
    try {
      await deleteStudent(student.id);
      navigate('/students');
    } catch (error) {
      alert("Failed to delete student");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!student) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-serif text-white mb-4">Student not found</h2>
      <button onClick={() => navigate('/students')} className="premium-btn-secondary">
        Go Back to Students
      </button>
    </div>
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Present': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'Absent': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertCircle className="w-4 h-4 text-amber-500" />;
    }
  };

  const initials = student.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/students')}
          className="p-2 hover:bg-white/5 rounded-full transition-colors group"
        >
          <ArrowLeft className="w-6 h-6 text-brand-darkMuted group-hover:text-white" />
        </button>
        <div className="flex space-x-3">
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="p-2 bg-white/5 hover:bg-white/10 text-brand-muted hover:text-white rounded-xl transition-all border border-white/5"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button 
            onClick={handleDelete}
            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all border border-red-500/10"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8 space-y-6 md:space-y-0">
        <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-brand-gold to-brand-goldLight rounded-[2.5rem] flex items-center justify-center text-brand-bg text-4xl md:text-5xl font-serif font-black shadow-2xl shadow-brand-gold/20 flex-shrink-0">
          {initials}
        </div>
        <div className="flex-grow text-center md:text-left space-y-4">
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            <span className="px-3 py-1 bg-brand-gold/10 text-brand-gold text-[10px] font-black uppercase tracking-widest rounded-full border border-brand-gold/20">
              {student.level || 'Beginner'}
            </span>
            <span className="px-3 py-1 bg-brand-surfaceLight text-brand-muted text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/5 flex items-center">
              <Clock className="w-3 h-3 mr-1.5" /> {student.timezone}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
            {student.name}
          </h1>
          {student.contact_email && (
            <div className="flex items-center justify-center md:justify-start text-brand-muted hover:text-white transition-colors cursor-pointer group">
              <Mail className="w-4 h-4 mr-2 text-brand-gold" />
              <span className="text-sm font-medium">{student.contact_email}</span>
            </div>
          )}
        </div>
        <div className="flex-shrink-0 pt-4">
          <button 
            onClick={() => setIsLogModalOpen(true)}
            className="premium-btn-primary shadow-xl shadow-brand-gold/20"
          >
            <Plus className="w-5 h-5 mr-2" /> Log Attendance
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        {/* Left Column: Stats and Schedule */}
        <div className="lg:col-span-1 space-y-6">
          {/* Stats Bar */}
          <div className="card grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-[10px] uppercase font-black text-brand-darkMuted tracking-widest mb-1">Total</p>
              <p className="text-3xl font-serif font-bold text-white">{history.length}</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-green-500/10 border border-green-500/10">
              <p className="text-[10px] uppercase font-black text-brand-darkMuted tracking-widest mb-1">Attended</p>
              <p className="text-3xl font-serif font-bold text-green-500">
                {history.filter(h => h.status === 'Present').length}
              </p>
            </div>
          </div>

          {/* Weekly Schedule */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-brand-darkMuted uppercase tracking-widest flex items-center">
                <Calendar className="w-4 h-4 mr-2" /> Weekly Schedule
              </h3>
              <button 
                onClick={() => setIsLessonModalOpen(true)}
                className="p-1 px-2.5 bg-brand-gold/10 text-brand-gold rounded-lg border border-brand-gold/10 text-[10px] font-black uppercase tracking-widest hover:bg-brand-gold hover:text-brand-bg transition-colors"
              >
                + Add
              </button>
            </div>
            <div className="space-y-3">
              {lessons.map(lesson => (
                <div key={lesson.id} className="card flex items-center justify-between bg-white/2 hover:bg-white/5">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-brand-surfaceLight rounded-xl">
                      <Music className="w-4 h-4 text-brand-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{lesson.day_of_week}</p>
                      <p className="text-[11px] text-brand-darkMuted">{lesson.start_time.substring(0, 5)} &middot; {lesson.duration_minutes}m</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-brand-darkMuted" />
                </div>
              ))}
              {lessons.length === 0 && (
                <div className="p-6 text-center border-2 border-dashed border-white/5 rounded-2xl">
                  <p className="text-xs text-brand-darkMuted italic">No classes scheduled</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Attendance History */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-black text-brand-darkMuted uppercase tracking-widest flex items-center">
            <ClipboardList className="w-4 h-4 mr-2" /> Attendance History
          </h3>
          <div className="space-y-4">
            {history.sort((a,b) => b.id - a.id).map(record => (
              <div key={record.id} className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-white/10">
                <div className="flex items-start space-x-4">
                  <div className={`p-4 rounded-2xl flex flex-col items-center justify-center min-w-[64px] ${
                    record.status === 'Present' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    <span className="text-[10px] font-black uppercase tracking-tighter opacity-70">
                      {format(new Date(record.class_date), 'MMM')}
                    </span>
                    <span className="text-2xl font-serif font-bold leading-none">
                      {format(new Date(record.class_date), 'dd')}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                       {getStatusIcon(record.status)}
                       <span className="text-sm font-bold text-white">{record.status}</span>
                    </div>
                    {record.notes ? (
                      <p className="text-xs text-brand-muted italic line-clamp-2 max-w-sm">
                        &quot;{record.notes}&quot;
                      </p>
                    ) : (
                      <p className="text-[11px] text-brand-darkMuted italic">No notes recorded</p>
                    )}
                  </div>
                </div>
                <button className="flex items-center space-x-1 text-[11px] font-bold text-brand-darkMuted group-hover:text-brand-gold transition-colors">
                  <span>Details</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            ))}
            {history.length === 0 && (
              <div className="card p-12 text-center border-2 border-dashed border-white/5 flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-white/5 rounded-full">
                  <ClipboardList className="w-8 h-8 text-brand-darkMuted" />
                </div>
                <p className="text-sm text-brand-muted">No sessions have been logged for this student yet.</p>
                <button 
                  onClick={() => setIsLogModalOpen(true)}
                  className="premium-btn-secondary py-1.5 px-4 text-xs"
                >
                  Log the First Session
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddLessonModal
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        onSuccess={fetchStudentData}
        initialStudentId={student.id}
      />
      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchStudentData}
        student={student}
      />
      <LogSessionModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onSuccess={fetchStudentData}
        initialStudentId={student.id}
      />
    </div>
  );
};

export default StudentDetail;
