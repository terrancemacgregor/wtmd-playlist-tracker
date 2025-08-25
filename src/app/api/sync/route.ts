import { NextRequest, NextResponse } from 'next/server';
import { fetchAndStoreSongs } from '@/lib/scraper';
import { initDatabase } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Initialize database on each request for Railway
    initDatabase();
    
    console.log('Manual sync triggered');
    const result = await fetchAndStoreSongs();
    
    return NextResponse.json({
      success: true,
      message: 'Playlist synchronized successfully',
      ...result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error syncing playlist:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to sync playlist',
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Use POST method to trigger sync',
    endpoint: '/api/sync',
    method: 'POST'
  });
}