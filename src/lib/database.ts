import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'wtmd.db');

// Ensure directory exists for the database
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS songs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      artist TEXT NOT NULL,
      title TEXT NOT NULL,
      album TEXT,
      played_at DATETIME NOT NULL,
      dj_name TEXT,
      show_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(artist, title, played_at)
    );

    CREATE TABLE IF NOT EXISTS djs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      show_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS genres (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS song_genres (
      song_id INTEGER,
      genre_id INTEGER,
      FOREIGN KEY (song_id) REFERENCES songs(id),
      FOREIGN KEY (genre_id) REFERENCES genres(id),
      PRIMARY KEY (song_id, genre_id)
    );

    CREATE INDEX IF NOT EXISTS idx_songs_played_at ON songs(played_at);
    CREATE INDEX IF NOT EXISTS idx_songs_artist ON songs(artist);
    CREATE INDEX IF NOT EXISTS idx_songs_dj ON songs(dj_name);
  `);
}

export interface Song {
  id?: number;
  artist: string;
  title: string;
  album?: string;
  played_at: string;
  dj_name?: string;
  show_name?: string;
}

export function insertSong(song: Song) {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO songs (artist, title, album, played_at, dj_name, show_name)
    VALUES (@artist, @title, @album, @played_at, @dj_name, @show_name)
  `);
  return stmt.run(song);
}

export function getRecentSongs(limit: number = 50) {
  const stmt = db.prepare(`
    SELECT * FROM songs
    ORDER BY played_at DESC
    LIMIT ?
  `);
  return stmt.all(limit);
}

export function getSongsByDJ(djName: string, limit: number = 100) {
  const stmt = db.prepare(`
    SELECT * FROM songs
    WHERE dj_name = ?
    ORDER BY played_at DESC
    LIMIT ?
  `);
  return stmt.all(djName, limit);
}

export function getTopArtistsByDJ(djName: string, limit: number = 20) {
  const stmt = db.prepare(`
    SELECT artist, COUNT(*) as play_count
    FROM songs
    WHERE dj_name = ?
    GROUP BY artist
    ORDER BY play_count DESC
    LIMIT ?
  `);
  return stmt.all(djName, limit);
}

export function getTopSongs(days: number = 7, limit: number = 50) {
  const stmt = db.prepare(`
    SELECT artist, title, COUNT(*) as play_count
    FROM songs
    WHERE played_at > datetime('now', '-' || ? || ' days')
    GROUP BY artist, title
    ORDER BY play_count DESC
    LIMIT ?
  `);
  return stmt.all(days, limit);
}

export function getDJStats() {
  const stmt = db.prepare(`
    SELECT 
      dj_name,
      COUNT(*) as total_songs,
      COUNT(DISTINCT artist) as unique_artists,
      COUNT(DISTINCT DATE(played_at)) as days_active,
      MAX(played_at) as last_active
    FROM songs
    WHERE dj_name IS NOT NULL
    GROUP BY dj_name
    ORDER BY total_songs DESC
  `);
  return stmt.all();
}

export default db;