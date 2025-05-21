import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withProtectedApi } from '@/lib/api-middleware';
import { z } from 'zod';
import { sanitizeInput } from '@/lib/security';

// Schema for input validation
const appointmentSchema = z.object({
  doctorId: z.string(),
  dateTime: z.string().transform((val) => new Date(val)),
  notes: z.string().optional(),
});

// Create appointment
export async function POST(req: NextRequest) {
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
          role: 'DOCTOR'
        },
        select: {
          id: true,
          name: true,
          specialization: true
        }
      });

      if (!doctor) {
        return new NextResponse(
          JSON.stringify({ error: 'Doctor not found' }),
          { status: 404 }
        );
      }

      // Find patient record for the current user
      const patient = await prisma.patient.findFirst({
        where: {
          userId: token.id
        }
      });

      if (!patient) {
        return new NextResponse(
          JSON.stringify({ error: 'Patient profile not found' }),
          { status: 404 }
        );
      }

      // Create appointment
      const appointment = await prisma.appointment.create({
        data: {
          patientId: patient.id,
          doctorId: validatedData.doctorId,
          dateTime: validatedData.dateTime,
          notes: sanitizedNotes,
        },
        include: {
          doctor: {
            select: {
              name: true,
              specialization: true
            }
          }
        }
      });

      return new NextResponse(
        JSON.stringify(appointment),
        { status: 201 }
      );
    } catch (error) {
      console.error('Error creating appointment:', error);
      if (error instanceof z.ZodError) {
        return new NextResponse(
          JSON.stringify({ error: error.errors }),
          { status: 400 }
        );
      }
      return new NextResponse(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500 }
      );
    }
  });
}

// Get appointments for the current user
export async function GET(req: NextRequest) {
  return withProtectedApi(req, async (request, token) => {
    try {
      // Find patient record for the current user
      const patient = await prisma.patient.findFirst({
        where: {
          userId: token.id
        }
      });

      if (!patient) {
        return new NextResponse(
          JSON.stringify({ error: 'Patient profile not found' }),
          { status: 404 }
        );
      }

      const appointments = await prisma.appointment.findMany({
        where: {
          patientId: patient.id
        },
        include: {
          doctor: {
            select: {
              name: true,
              specialization: true
            }
          }
        },
        orderBy: {
          dateTime: 'desc'
        }
      });

      return new NextResponse(
        JSON.stringify(appointments),
        { status: 200 }
      );
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return new NextResponse(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500 }
      );
    }
  });
}
