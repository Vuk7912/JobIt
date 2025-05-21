import { describe, it, expect } from 'vitest';
import { Pool } from 'pg';
import { AuthConfig } from 'better-auth';

describe('Dependencies', () => {
  it('should import PostgreSQL pool', () => {
    const pool = new Pool();
    expect(pool).toBeDefined();
  });

  it('should import better-auth configuration', () => {
    const authConfig: AuthConfig = {
      jwtSecret: 'test_secret',
      tokenExpiration: '1h',
    };
    expect(authConfig).toBeDefined();
    expect(authConfig.jwtSecret).toBe('test_secret');
  });
});