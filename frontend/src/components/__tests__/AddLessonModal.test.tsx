import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AddLessonModal from '../AddLessonModal';
import * as lessonService from '../../services/lessonService';
import * as studentService from '../../services/studentService';

// Mock the services
vi.mock('../../services/lessonService', () => ({
  createLesson: vi.fn(),
}));

vi.mock('../../services/studentService', () => ({
  getStudents: vi.fn(),
}));

describe('AddLessonModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSuccess: vi.fn(),
  };

  const mockStudents = [
    { id: 1, name: 'Student One', level: 'Beginner', timezone: 'UTC', join_date: '2024-01-01' },
    { id: 2, name: 'Student Two', level: 'Intermediate', timezone: 'UTC', join_date: '2024-01-01' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(studentService.getStudents).mockResolvedValue(mockStudents);
  });

  it('renders correctly when open', async () => {
    render(<AddLessonModal {...defaultProps} />);
    expect(screen.getByText('Schedule Lesson')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Student One')).toBeInTheDocument();
    });
  });

  it('submits correctly with valid data', async () => {
    const mockCreateLesson = vi.mocked(lessonService.createLesson);
    mockCreateLesson.mockResolvedValueOnce({ 
      id: 10, 
      student_id: 1, 
      day_of_week: 'Monday', 
      start_time: '14:00', 
      duration_minutes: 60 
    });

    render(<AddLessonModal {...defaultProps} />);
    
    await waitFor(() => expect(screen.getByText('Student One')).toBeInTheDocument());

    // Submit
    fireEvent.click(screen.getByText('Create Weekly Lesson'));

    await waitFor(() => {
      expect(mockCreateLesson).toHaveBeenCalledWith(expect.objectContaining({
        student_id: 1,
        day_of_week: 'Monday',
        start_time: '12:00', // default
      }));
      expect(defaultProps.onSuccess).toHaveBeenCalled();
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  it('pre-selects student when initialStudentId is provided', async () => {
    render(<AddLessonModal {...defaultProps} initialStudentId={2} />);
    
    await waitFor(() => {
      const select = screen.getByLabelText(/student/i) as HTMLSelectElement;
      expect(select.value).toBe('2');
      expect(select).toBeDisabled();
    });
  });

  it('shows error on API failure', async () => {
    const mockCreateLesson = vi.mocked(lessonService.createLesson);
    mockCreateLesson.mockRejectedValueOnce({
      response: { data: { detail: 'Schedule Conflict' } }
    });

    render(<AddLessonModal {...defaultProps} />);
    
    await waitFor(() => expect(screen.getByText('Student One')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Create Weekly Lesson'));

    await waitFor(() => {
      expect(screen.getByText('Schedule Conflict')).toBeInTheDocument();
    });
  });
});
