import { NextRequest, NextResponse } from 'next/server';
import { getDJStats, getSongsByDJ, getTopArtistsByDJ, initDatabase } from '@/lib/database';

initDatabase();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const djName = searchParams.get('name');
    const type = searchParams.get('type') || 'stats';
    const limit = parseInt(searchParams.get('limit') || '100');

    let data;
    
    if (djName) {
      switch (type) {
        case 'songs':
          data = getSongsByDJ(djName, limit);
          break;
        case 'artists':
          data = getTopArtistsByDJ(djName, limit);
          break;
        default:
          data = {
            songs: getSongsByDJ(djName, 20),
            topArtists: getTopArtistsByDJ(djName, 10)
          };
      }
    } else {
      data = getDJStats();
    }

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching DJ data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch DJ data' },
      { status: 500 }
    );
  }
}