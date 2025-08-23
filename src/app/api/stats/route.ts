import { NextRequest, NextResponse } from 'next/server';
import db, { initDatabase } from '@/lib/database';

initDatabase();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'overview';

    let data;
    
    switch (type) {
      case 'overview':
        const totalSongs = db.prepare('SELECT COUNT(*) as count FROM songs').get();
        const uniqueArtists = db.prepare('SELECT COUNT(DISTINCT artist) as count FROM songs').get();
        const totalDJs = db.prepare('SELECT COUNT(DISTINCT dj_name) as count FROM songs WHERE dj_name IS NOT NULL').get();
        const lastUpdate = db.prepare('SELECT MAX(created_at) as last_update FROM songs').get();
        
        data = {
          totalSongs: totalSongs.count,
          uniqueArtists: uniqueArtists.count,
          totalDJs: totalDJs.count,
          lastUpdate: lastUpdate.last_update
        };
        break;
        
      case 'hourly':
        data = db.prepare(`
          SELECT 
            strftime('%H', played_at) as hour,
            COUNT(*) as play_count
          FROM songs
          WHERE played_at > datetime('now', '-7 days')
          GROUP BY hour
          ORDER BY hour
        `).all();
        break;
        
      case 'daily':
        data = db.prepare(`
          SELECT 
            DATE(played_at) as date,
            COUNT(*) as play_count,
            COUNT(DISTINCT artist) as unique_artists
          FROM songs
          WHERE played_at > datetime('now', '-30 days')
          GROUP BY date
          ORDER BY date DESC
        `).all();
        break;
        
      case 'genre-distribution':
        data = db.prepare(`
          SELECT 
            artist,
            COUNT(*) as play_count
          FROM songs
          WHERE played_at > datetime('now', '-7 days')
          GROUP BY artist
          ORDER BY play_count DESC
          LIMIT 30
        `).all();
        break;
        
      default:
        data = {};
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