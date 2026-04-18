import React, { useState, useEffect } from 'react';
import { X, User, Calendar, ClipboardList, CheckCircle2, XCircle, AlertCircle, FileText } from 'lucide-react';
import { getStudents } from '../services/studentService';
import { createAttendance } from '../services/attendanceService';
import { Student } from '../types';

interface LogSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialStudentId?: number;
}

const LogSessionModal: React.FC<LogSessionModalProps> = ({ isOpen, onClose, onSuccess, initialStudentId }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    student_id: initialStudentId || 0,
    class_date: new Date().toISOString().split('T')[0],
    status: 'Present',
    notes: '',
  });

  useEffect(() => {
    if (isOpen) {
      const fetchStudents = async () => {
        try {
          const data = await getStudents();
          setStudents(data);
          if (!initialStudentId && data.length > 0) {
            setFormData(prev => ({ ...prev, student_id: data[0].id }));
          }
        } catch (err) {
          console.error("Failed to fetch students:", err);
        }
      };
      fetchStudents();
    }
  }, [isOpen, initialStudentId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createAttendance({
        student_id: formData.student_id,
        class_date: formData.class_date,
        status: formData.status,
        notes: formData.notes
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to log session");
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: 'Present', label: 'Present', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' },
    { value: 'Absent', label: 'Absent', icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    { value: 'Excused', label: 'Excused', icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-brand-bg/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-brand-surface border-t sm:border border-white/10 rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-brand-gold/10 rounded-xl">
              <ClipboardList className="text-brand-gold w-5 h-5" />
            </div>
            <h2 className="text-xl font-serif font-bold text-white">Log Session</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5 text-brand-darkMuted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">{error}</div>}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-brand-darkMuted tracking-widest flex items-center">
                <User className="w-3 h-3 mr-2" /> Student
              </label>
              <select
                required
                disabled={!!initialStudentId}
                className="premium-input appearance-none disabled:opacity-50"
                value={formData.student_id}
                onChange={(e) => setFormData({ ...formData, student_id: parseInt(e.target.value) })}
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-brand-darkMuted tracking-widest flex items-center">
                <Calendar className="w-3 h-3 mr-2" /> Date
              </label>
              <input
                type="date"
                required
                className="premium-input"
                value={formData.class_date}
                onChange={(e) => setFormData({ ...formData, class_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-brand-darkMuted tracking-widest flex items-center">
                Status
              </label>
              <div className="grid grid-cols-3 gap-3">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, status: opt.value })}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                      formData.status === opt.value
                        ? `${opt.bg} ${opt.border} ${opt.color}`
                        : 'bg-brand-surface border-white/5 text-brand-darkMuted opacity-50'
                    }`}
                  >
                    <opt.icon className="w-5 h-5 mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-brand-darkMuted tracking-widest flex items-center">
                <FileText className="w-3 h-3 mr-2" /> Session Notes
              </label>
              <textarea
                className="premium-input min-h-[100px] resize-none"
                placeholder="What did you work on today? Any homework for the student?"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-4 grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={onClose}
              className="premium-btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="premium-btn-primary"
            >
              {loading ? "Logging..." : "Save Session"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogSessionModal;
