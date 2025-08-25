import axios from 'axios';
import * as cheerio from 'cheerio';
import { insertSong, type Song } from './db';

const PLAYLIST_URL = 'https://onlineradiobox.com/us/wtmd/playlist/';

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
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();
    const dateStr = `${String(currentMonth).padStart(2, '0')}/${String(currentDay).padStart(2, '0')}`;
    
    // OnlineRadioBox uses a table with class tablelist-schedule
    $('table.tablelist-schedule tbody tr').each((index, element) => {
      const $row = $(element);
      const $timeCell = $row.find('td.tablelist-schedule__time');
      const $trackCell = $row.find('td.track_history_item');
      
      if ($timeCell.length && $trackCell.length) {
        const timeText = $timeCell.find('.time--schedule').text().trim();
        const $trackLink = $trackCell.find('a');
        
        // Skip entries that are just "Total Music Discovery - WTMD" or show names
        const trackText = $trackCell.text().trim();
        if (trackText.includes('Total Music Discovery') || 
            trackText.includes('with ') ||
            !$trackLink.length) {
          return; // Skip this row
        }
        
        // Extract song info from the link text (format: "Artist - Title")
        const fullText = $trackLink.text().trim();
        const parts = fullText.split(' - ');
        
        if (parts.length >= 2 && timeText) {
          const artist = parts[0].trim();
          const title = parts.slice(1).join(' - ').trim(); // Handle cases with multiple dashes
          const [hour, minute] = timeText.split(':').map(s => parseInt(s));
          const djInfo = getCurrentDJ(hour);
          
          songs.push({
            date: dateStr,
            time: timeText,
            title: title,
            artist: artist,
            album: undefined,
            dj: djInfo.dj
          });
        }
      }
    });
    
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