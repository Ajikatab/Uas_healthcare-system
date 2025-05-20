import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withProtectedApi } from '@/lib/api-middleware';

export async function GET(req: Request) {
  return withProtectedApi(req, async () => {
    const doctors = await prisma.user.findMany({
      where: {
        role: 'DOCTOR'
      },
      select: {
        id: true,
        name: true,
      }
    });

    return NextResponse.json(doctors);
  });
}
