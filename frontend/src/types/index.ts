export interface Student {
  id: number;
  name: string;
  level: string;
  join_date: string;
  contact_email?: string;
  parent_name?: string;
  timezone: string;
}

export interface StudentCreate {
  name: string;
  level: string;
  contact_email?: string;
  parent_name?: string;
  timezone: string;
}

export interface StudentUpdate {
  name?: string;
  level?: string;
  contact_email?: string;
  parent_name?: string;
  timezone?: string;
}


export interface Lesson {
  id: number;
  student_id: number;
  day_of_week: string;
  start_time: string;
  duration_minutes: number;
}

export interface LessonCreate {
  student_id: number;
  day_of_week: string;
  start_time: string;
  duration_minutes?: number;
}

export interface Attendance {
  id: number;
  student_id: number;
  class_date: string;
  status: string;
  notes?: string;
}

export interface AttendanceCreate {
  student_id: number;
  class_date: string;
  status?: string;
  notes?: string;
}

export interface AttendanceUpdate {
  status?: string;
  notes?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  email: string;
  role: string;
}
