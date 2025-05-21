import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmailLoginForm } from './EmailLoginForm';

// Create a mock toast function
const mockToast = vi.fn();

// Mock the use-toast hook
vi.mock('./ui/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

describe('EmailLoginForm', () => {
  const user = userEvent.setup();

  afterEach(() => {
    mockToast.mockClear();
  });

  it('renders email input and login button', () => {
    const mockLogin = vi.fn();
    render(<EmailLoginForm onLogin={mockLogin} />);

    const emailInput = screen.getByLabelText('Email');
    const loginButton = screen.getByRole('button', { name: /login/i });

    expect(emailInput).toBeTruthy();
    expect(loginButton).toBeTruthy();
  });

  it('validates email on form submission', async () => {
    const mockLogin = vi.fn();
    render(<EmailLoginForm onLogin={mockLogin} />);

    const emailInput = screen.getByLabelText('Email');
    const loginButton = screen.getByRole('button', { name: /login/i });

    // Invalid email
    await act(async () => {
      await user.type(emailInput, 'invalid-email');
      await user.click(loginButton);
    });

    // Check toast was called with error
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Invalid Email',
      description: 'Please enter a valid email address.',
      variant: 'destructive',
    });
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('calls onLogin with valid email', async () => {
    const mockLogin = vi.fn(async () => {});
    render(<EmailLoginForm onLogin={mockLogin} />);

    const emailInput = screen.getByLabelText('Email');
    const loginButton = screen.getByRole('button', { name: /login/i });

    // Valid email
    await act(async () => {
      await user.type(emailInput, 'test@example.com');
      await user.click(loginButton);
    });

    expect(mockLogin).toHaveBeenCalledWith('test@example.com');
    expect(mockToast).not.toHaveBeenCalled();
  });
});