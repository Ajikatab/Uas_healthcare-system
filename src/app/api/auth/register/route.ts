import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emailSchema, passwordSchema, hashPassword, sanitizeInput } from '@/lib/security';
import { z } from 'zod';

// Registration input validation schema
const registrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['PATIENT', 'DOCTOR']).default('PATIENT'),
  dateOfBirth: z.string().optional(),
  bloodType: z.string().optional(),
  allergies: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Validate input
    const validatedData = registrationSchema.parse(body);
    
    // Sanitize inputs
    const sanitizedName = sanitizeInput(validatedData.name);
    const sanitizedAllergies = validatedData.allergies ? sanitizeInput(validatedData.allergies) : undefined;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: sanitizedName,
        role: validatedData.role,
      },
    });

    // If it's a patient, create the patient profile
    if (validatedData.role === 'PATIENT' && validatedData.dateOfBirth) {
      await prisma.patient.create({
        data: {
          userId: user.id,
          dateOfBirth: new Date(validatedData.dateOfBirth),
          bloodType: validatedData.bloodType,
          allergies: sanitizedAllergies,
        },
      });
    }

    // Return success with redirect
    return NextResponse.json(
      { 
        success: true,
        redirectUrl: validatedData.role === 'PATIENT' ? '/appointments/book' : '/auth/signin'
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
