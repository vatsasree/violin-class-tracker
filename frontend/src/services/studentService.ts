import api from './api';
import { Student, StudentCreate, StudentUpdate } from '../types';

export const getStudents = async (): Promise<Student[]> => {
  const response = await api.get('/students/');
  return response.data;
};

export const getStudent = async (id: number): Promise<Student> => {
  const response = await api.get(`/students/${id}`);
  return response.data;
};

export const createStudent = async (student: StudentCreate): Promise<Student> => {
  const response = await api.post('/students/', student);
  return response.data;
};

export const updateStudent = async (id: number, student: StudentUpdate): Promise<Student> => {
  const response = await api.patch(`/students/${id}`, student);
  return response.data;
};

export const deleteStudent = async (id: number): Promise<void> => {
  await api.delete(`/students/${id}`);
};

