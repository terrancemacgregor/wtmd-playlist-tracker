import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Check database connection
    const dbCheck = db.prepare('SELECT 1 as check').get();
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: dbCheck ? 'connected' : 'disconnected',
      version: process.env.npm_package_version || '1.0.0'
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    );
  }
}