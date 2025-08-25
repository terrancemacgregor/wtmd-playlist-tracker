import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, getStats, getTopArtists, getSongs } from '@/lib/db';
import type { Song } from '@/lib/db';

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
        
      case 'hourly':
        // Generate hourly statistics from songs data
        const recentSongs = getSongs(1000); // Get more songs for analysis
        const hourlyMap = new Map<number, number>();
        
        // Initialize all hours with 0
        for (let i = 0; i < 24; i++) {
          hourlyMap.set(i, 0);
        }
        
        recentSongs.forEach((song: Song) => {
          const hour = new Date(song.played_at).getHours();
          hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + 1);
        });
        
        data = Array.from(hourlyMap.entries())
          .map(([hour, count]) => ({ hour: hour.toString(), play_count: count }))
          .sort((a, b) => parseInt(a.hour) - parseInt(b.hour));
        break;
        
      case 'daily':
        // Generate daily statistics from songs data
        const allSongs = getSongs(5000); // Get more songs for daily analysis
        const dailyMap = new Map<string, { count: number; artists: Set<string> }>();
        
        allSongs.forEach((song: Song) => {
          const date = song.played_at.split('T')[0]; // Get just the date part
          const existing = dailyMap.get(date) || { count: 0, artists: new Set() };
          existing.count++;
          existing.artists.add(song.artist);
          dailyMap.set(date, existing);
        });
        
        data = Array.from(dailyMap.entries())
          .map(([date, info]) => ({
            date,
            play_count: info.count,
            unique_artists: info.artists.size
          }))
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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