import bcryptjs from 'bcryptjs';
import { z } from 'zod';

// Email validation schema
export const emailSchema = z
  .string()
  .email('Invalid email address')
  .min(5, 'Email must be at least 5 characters')
  .max(100, 'Email must be less than 100 characters')
  .transform((email) => email.toLowerCase());

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must be less than 100 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return await bcryptjs.hash(password, 12);
}

// Sanitize input
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .trim();
}

// Rate limiting configuration
export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
};
