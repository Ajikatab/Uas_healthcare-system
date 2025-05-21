import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { sanitizeInput } from '@/lib/security';
import { withProtectedApi } from '@/lib/api-middleware';

const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  dateOfBirth: z.string().optional(),
});

export async function GET(req: NextRequest) {
  return withProtectedApi(req, async (request, token) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: token.id },
        include: {
          patients: {
            select: {
              id: true,
              dateOfBirth: true,
            }
          }
        }
      });

      if (!user?.patients?.[0]) {
        return new NextResponse(
          JSON.stringify({ error: 'Patient profile not found' }),
          { 
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      const patientProfile = user.patients[0];
      const response = {
        id: patientProfile.id,
        userId: user.id,
        dateOfBirth: patientProfile.dateOfBirth,
        user: {
          name: user.name,
          email: user.email
        }
      };
      
      return new NextResponse(
        JSON.stringify({ data: response }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (error) {
      console.error('Profile fetch error:', error);
      return new NextResponse(
        JSON.stringify({ error: 'Internal server error' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }, ['PATIENT']);
}

export async function PUT(req: NextRequest) {
  return withProtectedApi(req, async (request, token) => {
    try {
      const body = await request.json();
      const validatedData = profileUpdateSchema.parse(body);
      const sanitizedName = sanitizeInput(validatedData.name);

      const user = await prisma.user.findUnique({
        where: { id: token.id },
        include: { patients: true }
      });

      if (!user?.patients?.[0]) {
        return new NextResponse(
          JSON.stringify({ error: 'Patient profile not found' }),
          { 
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      // Update user name and patient profile
      await prisma.$transaction([
        prisma.user.update({
          where: { id: token.id },
          data: { name: sanitizedName }
        }),
        prisma.patient.update({
          where: { id: user.patients[0].id },
          data: {
            dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : undefined
          }
        })
      ]);

      // Return updated profile data
      const updatedUser = await prisma.user.findUnique({
        where: { id: token.id },
        include: {
          patients: {
            select: {
              id: true,
              dateOfBirth: true,
            }
          }
        }
      });

      if (!updatedUser?.patients?.[0]) {
        throw new Error('Failed to fetch updated profile');
      }

      const response = {
        id: updatedUser.patients[0].id,
        userId: updatedUser.id,
        dateOfBirth: updatedUser.patients[0].dateOfBirth,
        user: {
          name: updatedUser.name,
          email: updatedUser.email
        }
      };

      return new NextResponse(
        JSON.stringify({ data: response }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (error) {
      console.error('Profile update error:', error);
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
  }, ['PATIENT']);
}
