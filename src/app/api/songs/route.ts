import { NextRequest, NextResponse } from 'next/server';
import { getRecentSongs, getTopSongs, initDatabase } from '@/lib/database';

initDatabase();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const type = searchParams.get('type') || 'recent';
    const days = parseInt(searchParams.get('days') || '7');

    let data;
    
    switch (type) {
      case 'top':
        data = getTopSongs(days, limit);
        break;
      case 'recent':
      default:
        data = getRecentSongs(limit);
        break;
    }

    return NextResponse.json({
      success: true,
      data,
      count: data.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching songs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch songs' },
      { status: 500 }
    );
  }
}