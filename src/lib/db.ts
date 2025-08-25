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

export type { Song } from './database';
export default db.default;