import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudents } from '../services/studentService';
import { Student } from '../types';
import { 
  Users, Search, Plus, Music, 
  MapPin, ChevronRight, Filter, Grid
} from 'lucide-react';
import AddStudentModal from '../components/AddStudentModal';

const Students: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.level?.toLowerCase().includes(search.toLowerCase())
  );

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
          <h1 className="text-4xl font-serif font-bold text-white mb-2 tracking-tight">Student Directory</h1>
          <p className="text-brand-muted font-medium flex items-center">
            <Users className="w-4 h-4 mr-2 text-brand-gold" />
            Registry of all active studio members
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="premium-btn-primary"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Student
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-brand-surface border border-white/5 p-2 rounded-2xl">
        <div className="relative flex-grow max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-darkMuted" />
          <input 
            type="text" 
            placeholder="Search by name or level..."
            className="w-full bg-brand-bg/50 border-none rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:ring-1 focus:ring-brand-gold/20 transition-all text-white placeholder:text-brand-darkMuted"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2 px-2">
           <button className="p-2.5 text-brand-muted hover:text-white hover:bg-white/5 rounded-xl transition-all">
             <Filter className="w-5 h-5" />
           </button>
           <button className="p-2.5 bg-brand-gold/10 text-brand-gold rounded-xl border border-brand-gold/10">
             <Grid className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => {
          const initials = student.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
          return (
            <div 
              key={student.id}
              onClick={() => navigate(`/students/${student.id}`)}
              className="card group hover:border-brand-gold/20 hover:shadow-2xl hover:shadow-brand-gold/5 cursor-pointer flex flex-col items-center text-center py-10 space-y-6 animate-in zoom-in-95 duration-300"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-brand-surfaceLight to-brand-bg rounded-3xl flex items-center justify-center text-brand-gold text-2xl font-serif font-black border border-white/5 group-hover:scale-110 group-hover:bg-brand-gold group-hover:text-brand-bg transition-all duration-300 shadow-xl">
                {initials}
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-serif font-bold text-white group-hover:text-brand-goldLight transition-colors">
                  {student.name}
                </h3>
                <div className="flex items-center justify-center space-x-2 text-[10px] font-black uppercase tracking-widest text-brand-darkMuted">
                  <Music className="w-3 h-3 text-brand-gold" />
                  <span>{student.level || 'Beginner'}</span>
                  {student.timezone && (
                    <>
                      <span className="opacity-30">•</span>
                      <MapPin className="w-3 h-3" />
                      <span>{student.timezone.split('/').pop()}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-2 w-full px-6">
                <div className="flex items-center justify-center space-x-1 text-xs font-bold text-brand-muted group-hover:text-brand-gold transition-colors">
                  <span>View Full Profile</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
        {filteredStudents.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="inline-flex p-6 bg-brand-surface rounded-full border border-white/5">
              <Plus className="w-10 h-10 text-brand-darkMuted" />
            </div>
            <p className="text-brand-muted font-medium">No students found matching your search.</p>
          </div>
        )}
      </div>

      <AddStudentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchStudents}
      />
    </div>
  );
};

export default Students;
