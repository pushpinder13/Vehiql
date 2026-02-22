import { db } from '@/lib/prisma';

export async function GET() {
  try {
    await db.car.findFirst({ select: { id: true } });

    return Response.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    return Response.json({ 
      status: 'error', 
      message: error.message 
    }, { status: 500 });
  }
}
