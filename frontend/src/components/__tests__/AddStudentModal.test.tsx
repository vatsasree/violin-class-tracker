import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AddStudentModal from '../AddStudentModal';
import * as studentService from '../../services/studentService';

// Mock the service
vi.mock('../../services/studentService', () => ({
  createStudent: vi.fn(),
}));

describe('AddStudentModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSuccess: vi.fn(),
  };

  it('renders correctly when open', () => {
    render(<AddStudentModal {...defaultProps} />);
    expect(screen.getByText('Add New Student')).toBeInTheDocument();
  });

  it('calls createStudent and onSuccess on valid submit', async () => {
    const mockCreateStudent = vi.mocked(studentService.createStudent);
    mockCreateStudent.mockResolvedValueOnce({ 
        id: 1, 
        name: 'John Doe', 
        level: 'Beginner', 
        timezone: 'UTC', 
        join_date: new Date().toISOString() 
    });

    render(<AddStudentModal {...defaultProps} />);
    
    // Fill form
    fireEvent.change(screen.getByPlaceholderText('e.g. John Doe'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('john@example.com'), { target: { value: 'john@example.com' } });
    
    // Submit
    fireEvent.click(screen.getByText('Register Student'));

    await waitFor(() => {
      expect(mockCreateStudent).toHaveBeenCalledWith(expect.objectContaining({
        name: 'John Doe',
        contact_email: 'john@example.com',
      }));
      expect(defaultProps.onSuccess).toHaveBeenCalled();
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  it('shows error message on API failure', async () => {
    const mockCreateStudent = vi.mocked(studentService.createStudent);
    mockCreateStudent.mockRejectedValueOnce({
      response: { data: { detail: 'Service Error' } }
    });

    render(<AddStudentModal {...defaultProps} />);
    
    fireEvent.change(screen.getByPlaceholderText('e.g. John Doe'), { target: { value: 'John Doe' } });
    fireEvent.click(screen.getByText('Register Student'));

    await waitFor(() => {
      expect(screen.getByText('Service Error')).toBeInTheDocument();
    });
  });
});
