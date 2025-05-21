import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withProtectedApi } from '@/lib/api-middleware';
import { z } from 'zod';

// Schema for input validation
const doctorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  specialization: z.string().min(2, 'Specialization must be at least 2 characters'),
});

export async function POST(req: NextRequest) {
  return withProtectedApi(req, async (request, token) => {
    try {
      const body = await request.json();
      const validatedData = doctorSchema.parse(body);
      
      // Create new doctor
      const newDoctor = await prisma.user.create({
        data: {
          name: validatedData.name,
          email: `${validatedData.name.toLowerCase().replace(/\s+/g, '.')}.${Date.now()}@placeholder.com`,
          password: 'placeholder',
          role: 'DOCTOR',
          specialization: validatedData.specialization
        },
        select: {
          id: true,
          name: true,
          specialization: true
        }
      });

      return new NextResponse(
        JSON.stringify({
          success: true,
          data: newDoctor
        }),
        { 
          status: 201,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (error) {
      console.error('Error creating doctor:', error);
      if (error instanceof z.ZodError) {
        return new NextResponse(
          JSON.stringify({ error: error.errors }),
          { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      return new NextResponse(
        JSON.stringify({ error: 'Internal server error' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }, ['ADMIN']);
}

// Get all doctors
export async function GET(req: NextRequest) {
  return withProtectedApi(req, async (request, token) => {
    try {
      const doctors = await prisma.user.findMany({
        where: {
          role: 'DOCTOR'
        },
        orderBy: {
          name: 'asc'
        },
        select: {
          id: true,
          name: true,
          specialization: true,
          appointments: {
            where: {
              status: 'SCHEDULED'
            },
            select: {
              id: true
            }
          }
        }
      });

      // Format response to include appointment count
      const formattedDoctors = doctors.map(doctor => ({
        id: doctor.id,
        name: doctor.name,
        specialization: doctor.specialization,
        activeAppointments: doctor.appointments.length
      }));

      return new NextResponse(
        JSON.stringify({ data: formattedDoctors }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (error) {
      console.error('Error fetching doctors:', error);
      return new NextResponse(
        JSON.stringify({ error: 'Internal server error' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }, ['ADMIN']);
}
