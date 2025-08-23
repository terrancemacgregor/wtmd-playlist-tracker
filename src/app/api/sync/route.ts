import { NextRequest, NextResponse } from 'next/server';
import { fetchAndStoreSongs } from '@/lib/scraper';
import { initDatabase } from '@/lib/database';

initDatabase();

export async function POST(request: NextRequest) {
  try {
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
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to sync playlist',
        message: error instanceof Error ? error.message : 'Unknown error'
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