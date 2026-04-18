import { addDays, format, isAfter, set } from 'date-fns';

const DAY_MAP: { [key: string]: number } = {
  "Sunday": 0,
  "Monday": 1,
  "Tuesday": 2,
  "Wednesday": 3,
  "Thursday": 4,
  "Friday": 5,
  "Saturday": 6,
};

export interface UpcomingLesson {
  id: number;
  studentName: string;
  studentId: number;
  dateTime: Date;
  dayOfWeek: string;
  isToday: boolean;
  isTomorrow: boolean;
  daysAway: number;
}

export const calculateNextOccurrence = (dayOfWeek: string, startTimeStr: string): Date => {
  const now = new Date();
  const targetDay = DAY_MAP[dayOfWeek];
  
  if (targetDay === undefined || !startTimeStr) return now; // Defensive fallback
  
  // Parse 'HH:mm:ss' or 'HH:mm'
  const parts = startTimeStr.split(':').map(Number);
  const hours = parts[0] || 0;
  const minutes = parts[1] || 0;
  
  let occurrence = set(now, { hours, minutes, seconds: 0, milliseconds: 0 });
  
  // Get the date for the target day of the week
  // const nextTargetDate = nextDay(now, targetDay as any); // Removed unused
  
  // If today is the target day
  if (now.getDay() === targetDay) {
    // If the time has already passed today, move to next week
    if (isAfter(now, occurrence)) {
      occurrence = addDays(occurrence, 7);
    }
  } else {
    // Move occurrence to the correct day
    const daysUntil = (targetDay + 7 - now.getDay()) % 7;
    occurrence = addDays(occurrence, daysUntil);
  }
  
  return occurrence;
};

export const getRelativeDay = (date: Date): string => {
  const now = new Date();
  const diff = Math.floor((set(date, {hours:0,minutes:0,seconds:0}).getTime() - set(now, {hours:0,minutes:0,seconds:0}).getTime()) / (1000 * 60 * 60 * 24));
  
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff < 7) return `In ${diff}d`;
  return format(date, "MMM d");
};
