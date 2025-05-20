import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withProtectedApi } from '@/lib/api-middleware';
import { z } from 'zod';
import { sanitizeInput } from '@/lib/security';

// Appointment input validation schema
const appointmentSchema = z.object({
  patientId: z.string().uuid(),
  doctorId: z.string().uuid(),
  dateTime: z.string().datetime(),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  return withProtectedApi(req, async (request, token) => {
    try {
      const body = await request.json();
      
      // Validate input
      const validatedData = appointmentSchema.parse(body);
      
      // Sanitize notes
      const sanitizedNotes = validatedData.notes ? sanitizeInput(validatedData.notes) : undefined;
      
      // Verify doctor exists
      const doctor = await prisma.user.findFirst({
        where: {
          id: validatedData.doctorId,
          role: 'DOCTOR',
        },
      });

      if (!doctor) {
        return NextResponse.json(
          { error: 'Doctor not found' },
          { status: 404 }
        );
      }

      // Create appointment
      const appointment = await prisma.appointment.create({
        data: {
          patientId: validatedData.patientId,
          doctorId: validatedData.doctorId,
          dateTime: new Date(validatedData.dateTime),
          notes: sanitizedNotes,
        },
      });

      return NextResponse.json(appointment, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: error.errors },
          { status: 400 }
        );
      }
      
      throw error; // Will be caught by withProtectedApi
    }
  }, ['PATIENT', 'DOCTOR', 'ADMIN']);
}

export async function GET(req: Request) {
  return withProtectedApi(req, async (request, token) => {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const doctorId = searchParams.get('doctorId');

    // Build where clause based on role and query params
    const where: any = {};
    if (token.role === 'PATIENT') {
      where.patientId = token.id;
    } else if (token.role === 'DOCTOR') {
      where.doctorId = token.id;
    } else if (patientId) {
      where.patientId = patientId;
    } else if (doctorId) {
      where.doctorId = doctorId;
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: true,
        doctor: true,
      },
    });

    return NextResponse.json(appointments);
  }, ['PATIENT', 'DOCTOR', 'ADMIN']);
}
