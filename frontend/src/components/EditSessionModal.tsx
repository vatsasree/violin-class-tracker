import React, { useState } from 'react';
import { X, CheckCircle, XCircle, AlertCircle, Save, FileText } from 'lucide-react';
import { Attendance, AttendanceUpdate } from '../types';
import { updateAttendance } from '../services/attendanceService';
import { format } from 'date-fns';

interface EditSessionModalProps {
  isOpen: boolean;
  session: Attendance;
  studentName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const EditSessionModal: React.FC<EditSessionModalProps> = ({ isOpen, session, studentName, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<AttendanceUpdate>({
    status: session.status,
    notes: session.notes || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const statuses = ['Present', 'Absent', 'Excused'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await updateAttendance(session.id, formData);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError("Failed to update session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-brand-card rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white/10 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-white/5">
          <div>
            <h3 className="text-xl font-bold text-white">Edit Session</h3>
            <p className="text-xs font-bold text-brand-gold uppercase tracking-widest mt-0.5">
              {studentName} • {format(new Date(session.class_date), 'MMM d, yyyy')}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && <div className="p-4 text-sm text-red-400 bg-red-400/10 rounded-xl border border-red-400/20">{error}</div>}
          
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
              Attendance Status
            </label>
            <div className="grid grid-cols-3 gap-3">
              {statuses.map(status => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFormData({...formData, status})}
                  className={`py-3 rounded-xl border font-bold text-sm transition-all flex flex-col items-center space-y-2 ${
                    formData.status === status 
                      ? 'bg-brand-gold border-brand-gold text-brand-dark shadow-lg shadow-brand-gold/20' 
                      : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {status === 'Present' && <CheckCircle className="w-5 h-5" />}
                  {status === 'Absent' && <XCircle className="w-5 h-5" />}
                  {status === 'Excused' && <AlertCircle className="w-5 h-5" />}
                  <span>{status}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
              <FileText className="w-3 h-3 mr-2" /> Lesson taught / Notes
            </label>
            <textarea
              rows={5}
              className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-brand-gold outline-none transition-all resize-none"
              placeholder="Record repertoire covered, technical exercises, or goals for the next class..."
              value={formData.notes || ''}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <div className="pt-4">
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-brand-gold text-brand-dark py-4 rounded-2xl font-black hover:bg-yellow-400 transition-all shadow-xl shadow-brand-gold/10 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-brand-dark border-t-transparent animate-spin rounded-full"></div>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Update Session</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSessionModal;
