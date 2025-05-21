import { AuthConfig } from 'better-auth';

const authConfig: AuthConfig = {
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key',
  tokenExpiration: '1h', // Token expires in 1 hour
  refreshTokenExpiration: '7d', // Refresh token expires in 7 days
  
  // Additional authentication strategies can be configured here
  strategies: {
    local: {
      usernameField: 'email',
      passwordField: 'password',
    },
  },

  // Optional: Password complexity requirements
  passwordValidation: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
};

export default authConfig;