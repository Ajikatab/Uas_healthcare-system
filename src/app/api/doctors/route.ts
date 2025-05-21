import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// Get available doctors
export async function GET(req: NextRequest) {
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
        specialization: true
      }
    });

    return new NextResponse(
      JSON.stringify({ data: doctors }),
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
}
