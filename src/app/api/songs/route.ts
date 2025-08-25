import { NextRequest, NextResponse } from 'next/server';
import { getSongs, getSongCount, searchSongs, initDatabase } from '@/lib/db';

initDatabase();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    
    let data;
    let count;
    
    if (search) {
      data = searchSongs(search);
      count = data.length;
    } else {
      data = getSongs(limit, offset);
      count = getSongCount();
    }

    return NextResponse.json({
      success: true,
      data,
      count: data.length,
      total: count,
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