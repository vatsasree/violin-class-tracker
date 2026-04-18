import api from './api';
import { Lesson, LessonCreate } from '../types';

export const getLessons = async (studentId?: number): Promise<Lesson[]> => {
  const params = studentId ? { student_id: studentId } : {};
  const response = await api.get('/lessons/', { params });
  return response.data;
};

export const createLesson = async (lesson: LessonCreate): Promise<Lesson> => {
  const response = await api.post('/lessons/', lesson);
  return response.data;
};
