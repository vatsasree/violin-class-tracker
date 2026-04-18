import api from './api';
import { Attendance, AttendanceCreate, AttendanceUpdate } from '../types';

export const getAttendances = async (studentId?: number): Promise<Attendance[]> => {
  const params = studentId ? { student_id: studentId } : {};
  const response = await api.get('/attendance/', { params });
  return response.data;
};

export const createAttendance = async (attendance: AttendanceCreate): Promise<Attendance> => {
  const response = await api.post('/attendance/', attendance);
  return response.data;
};

export const updateAttendance = async (id: number, attendance: AttendanceUpdate): Promise<Attendance> => {
  const response = await api.patch(`/attendance/${id}`, attendance);
  return response.data;
};
