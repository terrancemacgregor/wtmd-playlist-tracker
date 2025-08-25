import { NextRequest, NextResponse } from 'next/server';
import { getSongs, getSongCount, searchSongs, initDatabase } from '@/lib/db';
import type { Song } from '@/lib/db';

initDatabase();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    const days = parseInt(searchParams.get('days') || '7');
    
    let data;
    let count;
    
    if (type === 'top') {
      // Get top songs by play count within the specified time range
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      const cutoffDateStr = cutoffDate.toISOString();
      
      const allSongs = getSongs(5000); // Get more songs for analysis
      const songMap = new Map<string, { artist: string; title: string; count: number }>();
      
      allSongs.forEach((song: Song) => {
        if (song.played_at >= cutoffDateStr) {
          const key = `${song.artist}|||${song.title}`;
          const existing = songMap.get(key) || { artist: song.artist, title: song.title, count: 0 };
          existing.count++;
          songMap.set(key, existing);
        }
      });
      
      data = Array.from(songMap.values())
        .map(item => ({ artist: item.artist, title: item.title, play_count: item.count }))
        .sort((a, b) => b.play_count - a.play_count)
        .slice(0, limit);
      
      count = data.length;
    } else if (search) {
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