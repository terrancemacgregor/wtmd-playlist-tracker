import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, getStats, getTopArtists, getSongs } from '@/lib/db';

initDatabase();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'overview';

    let data;
    
    switch (type) {
      case 'overview':
        data = getStats();
        break;
        
      case 'top-artists':
        data = getTopArtists(30);
        break;
        
      case 'recent':
        data = getSongs(100);
        break;
        
      default:
        data = getStats();
    }

    return NextResponse.json({
      success: true,
      data,
      type,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}