import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '../../types/auth';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const SALT_ROUNDS = 10;

// In-memory user store (replace with database in production)
const users: User[] = [];

export const authService = {
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const { email, password, confirmPassword } = credentials;

    // Validate inputs
    if (!email || !password) {
      return { success: false, message: 'Email and password are required' };
    }

    if (password !== confirmPassword) {
      return { success: false, message: 'Passwords do not match' };
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return { success: false, message: 'User already exists' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const newUser: User = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    users.push(newUser);

    // Generate token
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });

    return {
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      },
      token
    };
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { email, password } = credentials;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { success: false, message: 'Invalid email or password' };
    }

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    return {
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token
    };
  }
};