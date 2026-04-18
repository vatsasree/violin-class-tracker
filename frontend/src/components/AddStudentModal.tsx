import React, { useState } from 'react';
import { X, User, Mail, Globe, BookOpen } from 'lucide-react';
import { StudentCreate } from '../types';
import { createStudent } from '../services/studentService';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<StudentCreate>({
    name: '',
    contact_email: '',
    parent_name: '',
    level: 'Beginner',
    timezone: 'UTC',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timezones = [
    "UTC", "Asia/Kolkata", "Asia/Singapore", "Europe/London", 
    "America/New_York", "America/Los_Angeles", "Australia/Sydney"
  ];

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Clean up the data: don't send empty strings for optional fields
      const submissionData = {
        ...formData,
        contact_email: formData.contact_email?.trim() || undefined,
        parent_name: formData.parent_name?.trim() || undefined,
      };
      
      await createStudent(submissionData);
      onSuccess();
      onClose();
      setFormData({ name: '', contact_email: '', parent_name: '', level: 'Beginner', timezone: 'UTC' });
    } catch (err: any) {
      console.error("Creation error details:", err.response?.data || err.message);
      
      let message = "Failed to create student. Please check your inputs.";
      
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        message = Array.isArray(detail) 
          ? detail.map((d: any) => d.msg).join(", ") 
          : detail;
      } else if (err.message === "Network Error") {
        message = `Network Error: Cloud instance detected (${window.location.hostname}). If you are using localhost as the API URL, ensure you have an SSH tunnel (e.g., ssh -L 8000:localhost:8000) or update the VITE_API_URL in docker-compose.yml to the server's IP.`;
      } else if (err.message) {
        message = err.message;
      }
      
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800">Add New Student</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">{error}</div>}
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center">
              <User className="w-3 h-3 mr-1" /> Student Name
            </label>
            <input
              required
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center">
              <Mail className="w-3 h-3 mr-1" /> Contact Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="john@example.com"
              value={formData.contact_email}
              onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center">
                <BookOpen className="w-3 h-3 mr-1" /> Level
              </label>
              <select
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none bg-white font-medium"
                value={formData.level}
                onChange={(e) => setFormData({...formData, level: e.target.value})}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center">
                <Globe className="w-3 h-3 mr-1" /> Timezone
              </label>
              <select
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none bg-white font-medium"
                value={formData.timezone}
                onChange={(e) => setFormData({...formData, timezone: e.target.value})}
              >
                {timezones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center"
            >
              {loading ? "Adding..." : "Register Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;
