import { describe, it, expect } from 'vitest';
import { authService } from './authService';

describe('Authentication Service', () => {
  it('should register a new user', async () => {
    const result = await authService.register({
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });

    expect(result.success).toBe(true);
    expect(result.user?.email).toBe('test@example.com');
    expect(result.token).toBeTruthy();
  });

  it('should not register a user with mismatched passwords', async () => {
    const result = await authService.register({
      email: 'test2@example.com',
      password: 'password123',
      confirmPassword: 'differentpassword'
    });

    expect(result.success).toBe(false);
    expect(result.message).toBe('Passwords do not match');
  });

  it('should not register a user with existing email', async () => {
    await authService.register({
      email: 'duplicate@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });

    const result = await authService.register({
      email: 'duplicate@example.com',
      password: 'password456',
      confirmPassword: 'password456'
    });

    expect(result.success).toBe(false);
    expect(result.message).toBe('User already exists');
  });

  it('should login a registered user', async () => {
    await authService.register({
      email: 'login@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });

    const result = await authService.login({
      email: 'login@example.com',
      password: 'password123'
    });

    expect(result.success).toBe(true);
    expect(result.user?.email).toBe('login@example.com');
    expect(result.token).toBeTruthy();
  });

  it('should not login with incorrect password', async () => {
    await authService.register({
      email: 'logintest@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });

    const result = await authService.login({
      email: 'logintest@example.com',
      password: 'wrongpassword'
    });

    expect(result.success).toBe(false);
    expect(result.message).toBe('Invalid email or password');
  });
});