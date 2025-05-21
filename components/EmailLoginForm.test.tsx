import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { EmailLoginForm } from './EmailLoginForm';
import { Toaster } from './ui/toaster';

describe('EmailLoginForm', () => {
  afterEach(() => {
    cleanup();
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

  it('validates email on form submission', async () => {
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

    // Wait for toast to appear
    const errorToast = await screen.findByText('Invalid Email');
    expect(errorToast).toBeTruthy();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('calls onLogin with valid email', async () => {
    const mockLogin = vi.fn();
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

    // Wait to check if login was called
    await screen.findByText('Logging in...');
    expect(mockLogin).toHaveBeenCalledWith('test@example.com');
  });
});