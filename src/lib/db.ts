// Database wrapper that selects appropriate implementation
// Uses in-memory for Railway (due to ephemeral storage)
// Uses SQLite for local development and Docker

const isRailway = process.env.RAILWAY_ENVIRONMENT_NAME !== undefined;

// Use memory database for Railway, SQLite for everything else
const db = isRailway 
  ? require('./database-memory')
  : require('./database');

export const {
  initDatabase,
  insertSong,
  getSongs,
  getSongCount,
  getStats,
  getDJs,
  getTopArtists,
  searchSongs
} = db;

// Export Song type
export interface Song {
  id?: number;
  artist: string;
  title: string;
  album?: string | null;
  played_at: string;
  dj_name?: string | null;
  show_name?: string | null;
  created_at?: string;
}

export default db.default;