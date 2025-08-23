import axios from 'axios';
import * as cheerio from 'cheerio';
import { insertSong, Song } from './database';

const PLAYLIST_URL = 'https://wtmdradio.org/playlist/dynamic/RecentSongs.html';

interface ParsedSong {
  date: string;
  time: string;
  artist: string;
  title: string;
  album?: string;
  dj?: string;
}

function getCurrentDJ(hour: number): { dj: string; show: string } {
  const weekday = new Date().getDay();
  
  if (weekday >= 1 && weekday <= 5) {
    if (hour >= 6 && hour < 10) return { dj: 'Alex Cortright', show: 'Morning Show' };
    if (hour >= 10 && hour < 14) return { dj: 'Megan Byrd', show: 'Middays' };
    if (hour >= 14 && hour < 18) return { dj: 'Rob Timm', show: 'Afternoons' };
    if (hour >= 18 && hour < 20) return { dj: 'Various', show: 'Evening Shows' };
    if (hour >= 20 && hour < 22) return { dj: 'Paul Hartman', show: 'Detour' };
  }
  
  if (weekday === 6) {
    if (hour >= 8 && hour < 10) return { dj: 'Brooks Long', show: 'Six Degrees of Soul' };
    if (hour >= 10 && hour < 14) return { dj: 'Weekend Host', show: 'Weekend Mix' };
  }
  
  if (weekday === 0) {
    if (hour >= 10 && hour < 12) return { dj: 'Sunday Host', show: 'Sunday Morning' };
    if (hour >= 12 && hour < 14) return { dj: 'Various', show: 'Sunday Afternoon' };
  }
  
  return { dj: 'Automated', show: 'Automated Programming' };
}

export async function scrapePlaylist(): Promise<ParsedSong[]> {
  try {
    console.log('Fetching playlist from:', PLAYLIST_URL);
    const response = await axios.get(PLAYLIST_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    const songs: ParsedSong[] = [];
    const currentYear = new Date().getFullYear();
    
    const text = $('body').text();
    const lines = text.split('\n').filter(line => line.trim());
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Try different parsing patterns
      // Pattern 1: "MM/DD HH:MM Title / Artist / Album"
      let match = line.match(/^(\d{2}\/\d{2})\s+(\d{1,2}:\d{2})\s+(.+?)\s+\/\s+(.+?)(?:\s+\/\s+(.+))?$/);
      
      // Pattern 2: "MM/DD HH:MM Artist / Title"
      if (!match) {
        match = line.match(/^(\d{2}\/\d{2})\s+(\d{1,2}:\d{2})\s+(.+?)\s+\/\s+(.+?)$/);
        if (match) {
          // Swap artist and title for this pattern
          const [_, date, time, artist, title] = match;
          match = [_, date, time, title, artist];
        }
      }
      
      // Pattern 3: Lines with date/time followed by artist on next line
      if (!match && line.match(/^\d{2}\/\d{2}\s+\d{1,2}:\d{2}$/)) {
        const dateTime = line;
        const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : '';
        if (nextLine) {
          const [date, time] = dateTime.split(/\s+/);
          const parts = nextLine.split(/\s+\/\s+/);
          if (parts.length >= 2) {
            match = ['', date, time, parts[1], parts[0], parts[2]];
            i++; // Skip the next line since we've used it
          }
        }
      }
      
      if (match) {
        const [_, date, time, title, artist, album] = match;
        const [month, day] = date.split('/');
        const [hour, minute] = time.split(':');
        
        const playedAt = new Date(
          currentYear,
          parseInt(month) - 1,
          parseInt(day),
          parseInt(hour),
          parseInt(minute)
        );
        
        const djInfo = getCurrentDJ(parseInt(hour));
        
        songs.push({
          date,
          time,
          title: (title || '').trim(),
          artist: (artist || '').trim(),
          album: album?.trim(),
          dj: djInfo.dj
        });
      }
    }
    
    console.log(`Parsed ${songs.length} songs from playlist`);
    return songs;
  } catch (error) {
    console.error('Error scraping playlist:', error);
    return [];
  }
}

export async function fetchAndStoreSongs() {
  try {
    const songs = await scrapePlaylist();
    let newSongs = 0;
    
    for (const song of songs) {
      const [month, day] = song.date.split('/');
      const [hour, minute] = song.time.split(':');
      const currentYear = new Date().getFullYear();
      
      const playedAt = new Date(
        currentYear,
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hour),
        parseInt(minute)
      );
      
      const djInfo = getCurrentDJ(parseInt(hour));
      
      const songData: Song = {
        artist: song.artist,
        title: song.title,
        album: song.album,
        played_at: playedAt.toISOString(),
        dj_name: djInfo.dj,
        show_name: djInfo.show
      };
      
      const result = insertSong(songData);
      if (result.changes > 0) {
        newSongs++;
      }
    }
    
    console.log(`Stored ${newSongs} new songs in database`);
    return { total: songs.length, new: newSongs };
  } catch (error) {
    console.error('Error fetching and storing songs:', error);
    throw error;
  }
}