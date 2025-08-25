import { NextRequest, NextResponse } from 'next/server';
import { getSongs, initDatabase } from '@/lib/db';
import type { Song } from '@/lib/db';

initDatabase();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const djName = searchParams.get('name');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    if (djName) {
      // Get all songs to work with
      const allSongs = getSongs(5000); // Get more songs to filter
      const djSongs = allSongs.filter((song: Song) => song.dj_name === djName);
      
      if (type === 'artists') {
        // Get top artists for this DJ
        const artistMap = new Map<string, number>();
        djSongs.forEach((song: Song) => {
          artistMap.set(song.artist, (artistMap.get(song.artist) || 0) + 1);
        });
        
        const topArtists = Array.from(artistMap.entries())
          .map(([artist, count]) => ({ artist, play_count: count }))
          .sort((a, b) => b.play_count - a.play_count)
          .slice(0, limit);
        
        return NextResponse.json({
          success: true,
          data: topArtists,
          timestamp: new Date().toISOString()
        });
      } else if (type === 'songs') {
        // Get recent songs for this DJ
        const recentSongs = djSongs
          .sort((a: Song, b: Song) => new Date(b.played_at).getTime() - new Date(a.played_at).getTime())
          .slice(0, limit);
        
        return NextResponse.json({
          success: true,
          data: recentSongs,
          timestamp: new Date().toISOString()
        });
      } else {
        // Default: return all songs for the DJ
        return NextResponse.json({
          success: true,
          dj: djName,
          songs: djSongs,
          count: djSongs.length,
          timestamp: new Date().toISOString()
        });
      }
    } else {
      // Get all DJs with their statistics
      const allSongs = getSongs(5000);
      const djMap = new Map<string, { 
        songs: Song[], 
        artists: Set<string>, 
        dates: Set<string>,
        lastActive: Date 
      }>();
      
      allSongs.forEach((song: Song) => {
        if (song.dj_name) {
          const existing = djMap.get(song.dj_name) || {
            songs: [],
            artists: new Set(),
            dates: new Set(),
            lastActive: new Date(0)
          };
          
          existing.songs.push(song);
          existing.artists.add(song.artist);
          const dateStr = song.played_at.split('T')[0];
          existing.dates.add(dateStr);
          const songDate = new Date(song.played_at);
          if (songDate > existing.lastActive) {
            existing.lastActive = songDate;
          }
          
          djMap.set(song.dj_name, existing);
        }
      });
      
      const djStats = Array.from(djMap.entries()).map(([name, data]) => ({
        dj_name: name,
        total_songs: data.songs.length,
        unique_artists: data.artists.size,
        days_active: data.dates.size,
        last_active: data.lastActive.toISOString()
      })).sort((a: any, b: any) => b.total_songs - a.total_songs);
      
      return NextResponse.json({
        success: true,
        data: djStats,
        count: djStats.length,
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