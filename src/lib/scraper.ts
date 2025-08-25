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
    
    console.log('Looking for playlist table...');
    
    // Try multiple selectors for OnlineRadioBox
    const selectors = [
      'table.tablelist-schedule tbody tr',
      'table.table-striped tbody tr',
      '.playlist-tracks tr',
      'table tbody tr'
    ];
    
    let rowsFound = false;
    for (const selector of selectors) {
      const rows = $(selector);
      if (rows.length > 0) {
        console.log(`Found ${rows.length} rows using selector: ${selector}`);
        rowsFound = true;
        
        rows.each((index, element) => {
          const $row = $(element);
          const rowText = $row.text();
          
          // Look for time patterns (HH:MM)
          const timeMatch = rowText.match(/(\d{1,2}:\d{2})/);
          if (!timeMatch) return;
          
          const timeText = timeMatch[1];
          
          // Look for artist - title pattern
          const songMatch = rowText.match(/([^-]+)\s*-\s*([^-]+)/);
          if (!songMatch) return;
          
          const artist = songMatch[1].trim();
          const title = songMatch[2].trim();
          
          // Skip if it looks like a show name or station ID
          if (artist.toLowerCase().includes('wtmd') || 
              artist.toLowerCase().includes('total music') ||
              title.toLowerCase().includes('wtmd') ||
              artist.includes('with ')) {
            return;
          }
          
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
        });
        
        if (songs.length > 0) break;
      }
    }
    
    if (!rowsFound) {
      console.log('No playlist table found on page');
      console.log('Page title:', $('title').text());
      console.log('Tables found:', $('table').length);
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
    let skippedSongs = 0;
    
    for (const song of songs) {
      try {
        // Validate required fields
        if (!song.date || !song.time || !song.artist || !song.title) {
          console.log('Skipping song with missing data:', song);
          skippedSongs++;
          continue;
        }
        
        const dateParts = song.date.split('/');
        const timeParts = song.time.split(':');
        
        // Validate date and time parts
        if (dateParts.length < 2 || timeParts.length < 2) {
          console.log('Invalid date/time format:', song.date, song.time);
          skippedSongs++;
          continue;
        }
        
        const [month, day] = dateParts;
        const [hour, minute] = timeParts;
        const currentYear = new Date().getFullYear();
        
        // Parse and validate numbers
        const monthNum = parseInt(month);
        const dayNum = parseInt(day);
        const hourNum = parseInt(hour);
        const minuteNum = parseInt(minute);
        
        if (isNaN(monthNum) || isNaN(dayNum) || isNaN(hourNum) || isNaN(minuteNum)) {
          console.log('Invalid numeric values in date/time:', song.date, song.time);
          skippedSongs++;
          continue;
        }
        
        const playedAt = new Date(
          currentYear,
          monthNum - 1,
          dayNum,
          hourNum,
          minuteNum
        );
        
        // Check if date is valid
        if (isNaN(playedAt.getTime())) {
          console.log('Invalid date created:', song.date, song.time);
          skippedSongs++;
          continue;
        }
        
        const djInfo = getCurrentDJ(hourNum);
        
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
      } catch (songError) {
        console.error('Error processing individual song:', song, songError);
        skippedSongs++;
      }
    }
    
    console.log(`Stored ${newSongs} new songs, skipped ${skippedSongs} invalid entries`);
    return { total: songs.length, new: newSongs, skipped: skippedSongs };
  } catch (error) {
    console.error('Error fetching and storing songs:', error);
    throw error;
  }
}