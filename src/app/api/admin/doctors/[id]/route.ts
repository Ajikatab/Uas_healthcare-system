import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withProtectedApi } from '@/lib/api-middleware';
import { z } from 'zod';

// Schema for update validation
const updateDoctorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  specialization: z.string().min(2, 'Specialization must be at least 2 characters').optional(),
});

// Get specific doctor
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withProtectedApi(req, async (request, token) => {
    try {
      const doctor = await prisma.user.findFirst({
        where: {
          id: params.id,
          role: 'DOCTOR'
        }
      });

      if (!doctor) {
        return new NextResponse(
          JSON.stringify({ error: 'Doctor not found' }),
          { 
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      return new NextResponse(
        JSON.stringify({ 
          data: {
            id: doctor.id,
            name: doctor.name,
            specialization: doctor.specialization || ''
          }
        }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (error) {
      console.error('Error fetching doctor:', error);
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

// Update doctor
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withProtectedApi(req, async (request, token) => {
    try {
      const body = await request.json();
      const validatedData = updateDoctorSchema.parse(body);

      const updatedDoctor = await prisma.user.update({
        where: {
          id: params.id,
          role: 'DOCTOR'
        },
        data: validatedData
      });

      return new NextResponse(
        JSON.stringify({ 
          data: {
            id: updatedDoctor.id,
            name: updatedDoctor.name,
            specialization: updatedDoctor.specialization || ''
          }
        }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (error) {
      console.error('Error updating doctor:', error);
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

// Delete doctor
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withProtectedApi(req, async (request, token) => {
    try {
      // Check if doctor has any appointments
      const doctor = await prisma.user.findFirst({
        where: {
          id: params.id,
          role: 'DOCTOR'
        },
        include: {
          appointments: true
        }
      });

      if (!doctor) {
        return new NextResponse(
          JSON.stringify({ error: 'Doctor not found' }),
          { 
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      // Don't allow deletion if doctor has active appointments
      const activeAppointments = doctor.appointments.filter(
        (app) => app.status === 'SCHEDULED'
      );

      if (activeAppointments.length > 0) {
        return new NextResponse(
          JSON.stringify({ 
            error: 'Cannot delete doctor with active appointments',
            activeAppointments: activeAppointments.length
          }),
          { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      // Delete the doctor's appointments first
      await prisma.appointment.deleteMany({
        where: {
          doctorId: params.id
        }
      });

      // Delete the doctor
      await prisma.user.delete({
        where: {
          id: params.id
        }
      });

      return new NextResponse(
        JSON.stringify({ success: true }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (error) {
      console.error('Error deleting doctor:', error);
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
