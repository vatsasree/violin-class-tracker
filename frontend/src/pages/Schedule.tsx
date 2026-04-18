import React, { useEffect, useState } from 'react';
import { getLessons } from '../services/lessonService';
import { getStudents } from '../services/studentService';
import { Student, Lesson } from '../types';
import { Clock, Calendar as CalendarIcon, User, Plus } from 'lucide-react';
import AddLessonModal from '../components/AddLessonModal';

const Schedule: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [lData, sData] = await Promise.all([getLessons(), getStudents()]);
      setLessons(lData);
      setStudents(sData);
    } catch (error) {
      console.error("Failed to fetch schedule data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getDayLessons = (day: string) => {
    return lessons
      .filter((l) => l.day_of_week === day)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Weekly Schedule</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" /> Schedule Lesson
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {daysOfWeek.map((day) => {
          const dayLessons = getDayLessons(day);
          return (
            <div key={day} className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col min-h-[300px]">
              <div className="p-4 bg-slate-50 border-b border-slate-100 rounded-t-xl">
                <h3 className="font-bold text-slate-700 flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-2 text-indigo-500" />
                  {day}
                </h3>
              </div>
              <div className="p-4 flex-grow space-y-3">
                {loading ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-12 bg-slate-100 rounded"></div>
                    <div className="h-12 bg-slate-100 rounded"></div>
                  </div>
                ) : dayLessons.length > 0 ? (
                  dayLessons.map((lesson) => (
                    <div key={lesson.id} className="p-3 bg-indigo-50 rounded-lg border border-indigo-100 group relative hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-indigo-700 flex items-center">
                          <Clock className="w-3 h-3 mr-1" /> {lesson.start_time.substring(0, 5)}
                        </span>
                        <span className="text-[10px] text-indigo-400 bg-white px-1.5 py-0.5 rounded border border-indigo-100">
                          {lesson.duration_minutes}m
                        </span>
                      </div>
                      <div className="text-sm font-bold text-slate-800 truncate">
                        {students.find(s => s.id === lesson.student_id)?.name || 'Unknown'}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 flex items-center">
                        <User className="w-3 h-3 mr-1" /> Student Local Time
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400 italic text-center py-8">
                    No lessons
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <AddLessonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default Schedule;
