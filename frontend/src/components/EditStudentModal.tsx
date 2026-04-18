import React, { useState, useEffect } from 'react';
import { X, User, Mail, Globe, Award, Save } from 'lucide-react';
import { updateStudent } from '../services/studentService';
import { Student } from '../types';

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  student: Student;
}

const EditStudentModal: React.FC<EditStudentModalProps> = ({ isOpen, onClose, onSuccess, student }) => {
  const [formData, setFormData] = useState({
    name: student.name,
    level: student.level || 'Beginner',
    contact_email: student.contact_email || '',
    timezone: student.timezone || 'UTC',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
      name: student.name,
      level: student.level || 'Beginner',
      contact_email: student.contact_email || '',
      timezone: student.timezone || 'UTC',
    });
  }, [student]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await updateStudent(student.id, formData);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to update student");
    } finally {
      setLoading(false);
    }
  };

  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-brand-bg/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-brand-surface border-t sm:border border-white/10 rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-brand-gold/10 rounded-xl">
              <User className="text-brand-gold w-5 h-5" />
            </div>
            <h2 className="text-xl font-serif font-bold text-white">Edit Student Profile</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5 text-brand-darkMuted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium">{error}</div>}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-brand-darkMuted tracking-widest flex items-center">
                <User className="w-3 h-3 mr-2" /> Student Name
              </label>
              <input
                type="text"
                required
                className="premium-input"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-brand-darkMuted tracking-widest flex items-center">
                <Award className="w-3 h-3 mr-2" /> Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {levels.map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setFormData({ ...formData, level: lvl })}
                    className={`px-4 py-3 rounded-xl border text-xs font-bold transition-all ${
                      formData.level === lvl
                        ? 'bg-brand-gold/10 border-brand-gold text-brand-gold'
                        : 'bg-brand-surface border-white/5 text-brand-darkMuted'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-brand-darkMuted tracking-widest flex items-center">
                <Mail className="w-3 h-3 mr-2" /> Email
              </label>
              <input
                type="email"
                className="premium-input"
                placeholder="email@example.com"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-brand-darkMuted tracking-widest flex items-center">
                <Globe className="w-3 h-3 mr-2" /> Timezone
              </label>
              <select
                className="premium-input appearance-none"
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              >
                <option value="UTC">UTC (Universal)</option>
                <option value="Asia/Kolkata">IST (India)</option>
                <option value="America/New_York">EST (New York)</option>
                <option value="Europe/London">GMT/BST (London)</option>
                <option value="Asia/Singapore">SGT (Singapore)</option>
              </select>
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
              {loading ? "Saving..." : (
                <>
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudentModal;
