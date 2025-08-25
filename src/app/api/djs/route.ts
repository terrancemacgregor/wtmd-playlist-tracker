import { NextRequest, NextResponse } from 'next/server';
import { getDJs, getSongs, initDatabase } from '@/lib/db';
import type { Song } from '@/lib/db';

initDatabase();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const djName = searchParams.get('name');
    
    if (djName) {
      // Get songs by specific DJ
      const allSongs = getSongs(1000); // Get more songs to filter
      const djSongs = allSongs.filter((song: Song) => song.dj_name === djName);
      
      return NextResponse.json({
        success: true,
        dj: djName,
        songs: djSongs,
        count: djSongs.length,
        timestamp: new Date().toISOString()
      });
    } else {
      // Get all DJs with their song counts
      const djs = getDJs();
      
      return NextResponse.json({
        success: true,
        data: djs,
        count: djs.length,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error fetching DJs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch DJ data' },
      { status: 500 }
    );
  }
}