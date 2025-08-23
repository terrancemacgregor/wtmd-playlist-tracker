import { NextRequest, NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed-data';

export async function POST(request: NextRequest) {
  try {
    const count = seedDatabase();
    
    return NextResponse.json({
      success: true,
      message: `Added ${count} sample songs to database`,
      count,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to seed database',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}