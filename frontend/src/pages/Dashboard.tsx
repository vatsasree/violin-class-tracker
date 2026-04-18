import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudents } from '../services/studentService';
import { getAttendances } from '../services/attendanceService';
import { getLessons } from '../services/lessonService';
import { Student, Attendance, Lesson } from '../types';
import { 
  Users, CheckCircle2, XCircle, Calendar, 
  Plus, Music, ChevronRight, Clock, Star,
  ChevronDown
} from 'lucide-react';
import { format, addDays, isToday, isTomorrow, startOfDay } from 'date-fns';

// Day name → JS getDay() number (0=Sunday)
const DAY_MAP: Record<string, number> = {
  Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
  Thursday: 4, Friday: 5, Saturday: 6,
};

interface UpcomingSession {
  lesson: Lesson;
  student: Student;
  date: Date;
}

const buildUpcomingSessions = (lessons: Lesson[], students: Student[], count: number): UpcomingSession[] => {
  const today = startOfDay(new Date());
  const todayDow = today.getDay();

  const sessions: UpcomingSession[] = lessons.flatMap(lesson => {
    const targetDow = DAY_MAP[lesson.day_of_week];
    if (targetDow === undefined) return [];

    const student = students.find(s => s.id === lesson.student_id);
    if (!student) return [];

    // Calculate days until next occurrence (0 = today)
    const daysUntil = (targetDow - todayDow + 7) % 7;
    const nextDate = addDays(today, daysUntil);

    return [{ lesson, student, date: nextDate }];
  });

  return sessions
    .sort((a, b) => {
      const dateDiff = a.date.getTime() - b.date.getTime();
      if (dateDiff !== 0) return dateDiff;
      return a.lesson.start_time.localeCompare(b.lesson.start_time);
    })
    .slice(0, count);
};

const getDayLabel = (date: Date): string => {
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  return format(date, 'EEEE');
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [upcomingCount, setUpcomingCount] = useState(6);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [sData, aData, lData] = await Promise.all([
          getStudents(),
          getAttendances(),
          getLessons()
        ]);
        setStudents(sData);
        setAttendances(aData);
        setLessons(lData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const stats = [
    { label: 'Students', value: students.length, icon: Users, color: 'text-brand-gold', bg: 'bg-brand-gold/10' },
    { label: 'Attended', value: attendances.filter(a => a.status === 'Present').length, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Missed', value: attendances.filter(a => a.status === 'Absent').length, icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  const recentStudents = students.slice(0, 4);
  const upcomingSessions = buildUpcomingSessions(lessons, students, upcomingCount);
  const countOptions = [3, 6, 9, 12];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-white mb-2 tracking-tight">Studio Overview</h1>
          <p className="text-brand-muted font-medium flex items-center">
            <Star className="w-4 h-4 mr-2 text-brand-gold fill-brand-gold/20" />
            Managing {students.length} active students this week
          </p>
        </div>
        <button 
          onClick={() => navigate('/students')}
          className="premium-btn-primary h-fit"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Student
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-6 flex items-center space-x-6 hover:border-white/10 group cursor-default">
            <div className={`p-4 rounded-[1.5rem] transition-transform duration-300 group-hover:scale-110 ${stat.bg}`}>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black text-brand-darkMuted tracking-[0.2em] mb-1">{stat.label}</p>
              <p className="text-3xl font-serif font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Sessions — Full Width */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-brand-darkMuted uppercase tracking-widest flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-brand-gold" /> Upcoming Sessions
          </h3>
          {/* Count chooser */}
          <div className="relative flex items-center">
            <span className="text-[10px] text-brand-darkMuted mr-2 font-black uppercase tracking-widest">Show</span>
            <div className="relative">
              <select
                value={upcomingCount}
                onChange={(e) => setUpcomingCount(Number(e.target.value))}
                className="appearance-none bg-brand-surfaceLight border border-white/10 rounded-xl pl-3 pr-8 py-1.5 text-xs font-bold text-white outline-none focus:border-brand-gold/50 cursor-pointer"
              >
                {countOptions.map(n => (
                  <option key={n} value={n}>{n} classes</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-darkMuted pointer-events-none" />
            </div>
          </div>
        </div>

        {upcomingSessions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingSessions.map(({ lesson, student, date }, idx) => {
              const dayLabel = getDayLabel(date);
              const isSessionToday = isToday(date);
              
              return (
                <div
                  key={`${lesson.id}-${idx}`}
                  onClick={() => navigate(`/students/${student.id}`)}
                  className={`card group hover:border-brand-gold/30 cursor-pointer flex items-center gap-4 p-4 transition-all hover:shadow-xl hover:shadow-brand-gold/5 ${
                    isSessionToday ? 'border-brand-gold/20 bg-brand-gold/5' : ''
                  }`}
                >
                  {/* Day block */}
                  <div className={`flex-shrink-0 p-3 rounded-2xl flex flex-col items-center justify-center min-w-[58px] ${
                    isSessionToday 
                      ? 'bg-brand-gold text-brand-bg' 
                      : 'bg-brand-surfaceLight text-white'
                  }`}>
                    <span className={`text-[9px] font-black uppercase tracking-tighter mb-0.5 ${
                      isSessionToday ? 'text-brand-bg/70' : 'text-brand-gold'
                    }`}>
                      {format(date, 'MMM')}
                    </span>
                    <span className="text-xl font-serif font-bold leading-none">
                      {format(date, 'dd')}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {isSessionToday && (
                        <span className="px-1.5 py-0.5 bg-brand-gold/20 text-brand-gold text-[8px] font-black uppercase tracking-widest rounded-md border border-brand-gold/20">
                          TODAY
                        </span>
                      )}
                      <span className="text-[10px] text-brand-darkMuted font-bold uppercase tracking-widest truncate">
                        {dayLabel}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white truncate group-hover:text-brand-goldLight transition-colors">
                      {student.name}
                    </h4>
                    <p className="text-[11px] text-brand-darkMuted flex items-center mt-0.5">
                      <Clock className="w-3 h-3 mr-1 text-brand-gold/60" />
                      {lesson.start_time.substring(0, 5)} · {lesson.duration_minutes}m
                    </p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-brand-darkMuted group-hover:text-brand-gold transition-colors flex-shrink-0" />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card p-12 text-center border-dashed border-2 border-white/5 flex flex-col items-center gap-4">
            <div className="p-4 bg-brand-surfaceLight rounded-full">
              <Calendar className="w-8 h-8 text-brand-darkMuted" />
            </div>
            <div>
              <p className="text-sm text-brand-muted font-medium">No upcoming sessions found</p>
              <p className="text-xs text-brand-darkMuted mt-1">Schedule lessons for your students to see them here</p>
            </div>
            <button onClick={() => navigate('/schedule')} className="premium-btn-secondary py-1.5 px-4 text-xs">
              Go to Schedule
            </button>
          </div>
        )}
      </div>

      {/* Bottom Row: Recent Students + Quick Start */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-2">
        {/* Recent Students */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-brand-darkMuted uppercase tracking-widest flex items-center">
              <Users className="w-4 h-4 mr-2" /> Recent Students
            </h3>
            <button 
              onClick={() => navigate('/students')}
              className="text-[10px] font-black uppercase tracking-widest text-brand-gold hover:text-brand-goldLight transition-colors"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentStudents.map(student => (
              <div 
                key={student.id} 
                onClick={() => navigate(`/students/${student.id}`)}
                className="card flex items-center justify-between bg-white/2 hover:bg-brand-surfaceLight cursor-pointer group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-serif font-bold text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-bg transition-all">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{student.name}</h4>
                    <p className="text-[11px] text-brand-darkMuted flex items-center">
                      <Music className="w-3 h-3 mr-1" /> {student.level || 'Beginner'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-brand-darkMuted group-hover:text-brand-gold transition-colors" />
              </div>
            ))}
            {students.length === 0 && (
              <div className="card p-12 text-center border-dashed border-2 border-white/5">
                <p className="text-brand-muted text-sm italic">No students registered yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Start */}
        <div className="space-y-6">
          <h3 className="text-xs font-black text-brand-darkMuted uppercase tracking-widest flex items-center">
            <Clock className="w-4 h-4 mr-2" /> Quick Start
          </h3>
          <div className="card bg-gradient-to-br from-brand-surface to-brand-bg p-8 flex flex-col items-center justify-center text-center space-y-6 border-brand-gold/10">
            <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center">
              <Music className="w-8 h-8 text-brand-gold" />
            </div>
            <div>
              <h4 className="text-lg font-serif font-bold text-white mb-2">Ready for a lesson?</h4>
              <p className="text-sm text-brand-darkMuted max-w-[240px]">
                Log a new session, track practice hours, and keep notes on student progress.
              </p>
            </div>
            <button 
              onClick={() => navigate('/students')}
              className="premium-btn-secondary w-full"
            >
              Select Student to Start
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
