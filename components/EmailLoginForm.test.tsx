import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { EmailLoginForm } from './EmailLoginForm';
import { Toaster } from './ui/toaster';

// Mock the toast hook
const mockToast = vi.fn();
vi.mock('./ui/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

describe('EmailLoginForm', () => {
  afterEach(() => {
    cleanup();
    mockToast.mockClear();
  });

  it('renders email input and login button', () => {
    const mockLogin = vi.fn();
    render(
      <>
        <EmailLoginForm onLogin={mockLogin} />
        <Toaster />
      </>
    );

    const emailInput = screen.getByLabelText('Email');
    const loginButton = screen.getByRole('button', { name: /login/i });

    expect(emailInput).toBeTruthy();
    expect(loginButton).toBeTruthy();
  });

  it('validates email on form submission', () => {
    const mockLogin = vi.fn();
    render(
      <>
        <EmailLoginForm onLogin={mockLogin} />
        <Toaster />
      </>
    );

    const emailInput = screen.getByLabelText('Email');
    const loginButton = screen.getByRole('button', { name: /login/i });

    // Invalid email
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(loginButton);

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
    render(
      <>
        <EmailLoginForm onLogin={mockLogin} />
        <Toaster />
      </>
    );

    const emailInput = screen.getByLabelText('Email');
    const loginButton = screen.getByRole('button', { name: /login/i });

    // Valid email
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(loginButton);

    expect(mockLogin).toHaveBeenCalledWith('test@example.com');
    expect(mockToast).not.toHaveBeenCalled();
  });
});