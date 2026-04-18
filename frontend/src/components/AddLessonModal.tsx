import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar, User, Hash } from 'lucide-react';
import { LessonCreate, Student } from '../types';
import { createLesson } from '../services/lessonService';
import { getStudents } from '../services/studentService';

interface AddLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialStudentId?: number;
}

const AddLessonModal: React.FC<AddLessonModalProps> = ({ isOpen, onClose, onSuccess, initialStudentId }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [formData, setFormData] = useState<Partial<LessonCreate>>({
    student_id: initialStudentId,
    day_of_week: 'Monday',
    start_time: '12:00',
    duration_minutes: 60,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    if (isOpen) {
      const fetchStudents = async () => {
        try {
          const data = await getStudents();
          setStudents(data);
          if (!formData.student_id && data.length > 0) {
            setFormData(prev => ({ ...prev, student_id: data[0].id }));
          }
        } catch (err) {
          console.error("Failed to fetch students for modal:", err);
        }
      };
      fetchStudents();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialStudentId) {
      setFormData(prev => ({ ...prev, student_id: initialStudentId }));
    }
  }, [initialStudentId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.student_id) {
      setError("Please select a student.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await createLesson(formData as LessonCreate);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Lesson creation error:", err.response?.data || err.message);
      const detail = err.response?.data?.detail;
      setError(Array.isArray(detail) ? detail.map((d: any) => d.msg).join(", ") : detail || "Failed to schedule lesson.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-slate-50">
          <h3 className="text-xl font-bold text-slate-800">Schedule Lesson</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && <div className="p-4 text-sm text-red-600 bg-red-50 rounded-2xl border border-red-100">{error}</div>}
          
          <div className="space-y-1.5">
            <label htmlFor="student_id" className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center">
              <User className="w-3 h-3 mr-2" /> Student
            </label>
            <select
              id="student_id"
              required
              disabled={!!initialStudentId}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none bg-slate-50 font-semibold text-slate-700 disabled:opacity-50"
              value={formData.student_id || ''}
              onChange={(e) => setFormData({...formData, student_id: parseInt(e.target.value)})}
            >
              <option value="" disabled>Select a student</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center">
                <Calendar className="w-3 h-3 mr-2" /> Day
              </label>
              <select
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none bg-slate-50 font-semibold text-slate-700"
                value={formData.day_of_week}
                onChange={(e) => setFormData({...formData, day_of_week: e.target.value})}
              >
                {daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center">
                <Clock className="w-3 h-3 mr-2" /> Time
              </label>
              <input
                type="time"
                required
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 font-semibold text-slate-700"
                value={formData.start_time}
                onChange={(e) => setFormData({...formData, start_time: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center">
              <Hash className="w-3 h-3 mr-2" /> Duration (Minutes)
            </label>
            <input
              type="number"
              min="15"
              step="15"
              required
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 font-semibold text-slate-700"
              value={formData.duration_minutes}
              onChange={(e) => setFormData({...formData, duration_minutes: parseInt(e.target.value)})}
            />
          </div>

          <div className="pt-6">
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 disabled:opacity-50"
            >
              {loading ? "Scheduling..." : "Create Weekly Lesson"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLessonModal;
