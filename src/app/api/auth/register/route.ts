import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emailSchema, passwordSchema, hashPassword, sanitizeInput } from '@/lib/security';
import { z } from 'zod';

// Registration input validation schema
const registrationSchema = z.object({  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.literal('PATIENT'),
  dateOfBirth: z.string(),
  address: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Registration request:', { ...body, password: '[REDACTED]' });
    
    // Validate input
    const validatedData = registrationSchema.parse(body);
    console.log('Validated data:', { ...validatedData, password: '[REDACTED]' });
    
    // Sanitize inputs
    const sanitizedName = sanitizeInput(validatedData.name);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      console.log('User already exists:', validatedData.email);
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create user (only patients allowed)
    console.log('Creating patient user...');
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: sanitizedName,
        role: 'PATIENT',
      },
    });
    console.log('User created:', user.id);    // Create the patient profile
    console.log('Creating patient profile...');
    await prisma.patient.create({
      data: {
        userId: user.id,
        dateOfBirth: new Date(validatedData.dateOfBirth),
        address: validatedData.address ? sanitizeInput(validatedData.address) : '',
      },
    });
    console.log('Patient profile created');

    // Return success with redirect
    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful',
        redirectUrl: '/auth?action=login'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
