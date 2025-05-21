import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withProtectedApi } from '@/lib/api-middleware';

export async function GET(req: NextRequest) {
  return withProtectedApi(req, async (request, token) => {
    try {
      const [totalPatients, totalDoctors, totalAppointments] = await Promise.all([
        prisma.user.count({
          where: { role: 'PATIENT' }
        }),
        prisma.user.count({
          where: { role: 'DOCTOR' }
        }),
        prisma.appointment.count()
      ]);

      return new NextResponse(
        JSON.stringify({
          success: true,
          stats: {
            totalPatients,
            totalDoctors,
            totalAppointments
          }
        }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      return new NextResponse(
        JSON.stringify({ error: 'Internal server error' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }, ['ADMIN']); // Only admin can access this endpoint
}
