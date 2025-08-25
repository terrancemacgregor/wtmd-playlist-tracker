import { NextRequest, NextResponse } from 'next/server';
import { initDatabase } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Initialize database
    initDatabase();
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.RAILWAY_ENVIRONMENT_NAME || 'local'
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