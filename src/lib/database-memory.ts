// In-memory database for Railway deployment
// Since Railway has ephemeral storage, we'll use memory storage

interface Song {
  id?: number;
  artist: string;
  title: string;
  album?: string | null;
  played_at: string;
  dj_name?: string | null;
  show_name?: string | null;
  created_at?: string;
}

class InMemoryDatabase {
  private songs: Song[] = [];
  private nextId = 1;

  insertSong(song: Song) {
    const newSong = {
      ...song,
      id: this.nextId++,
      created_at: new Date().toISOString()
    };
    this.songs.push(newSong);
    return { changes: 1, lastInsertRowid: newSong.id };
  }

  getSongs(limit: number = 50, offset: number = 0) {
    return this.songs
      .sort((a, b) => new Date(b.played_at).getTime() - new Date(a.played_at).getTime())
      .slice(offset, offset + limit);
  }

  getSongCount() {
    return this.songs.length;
  }

  getStats() {
    return {
      totalSongs: this.songs.length,
      uniqueArtists: new Set(this.songs.map(s => s.artist)).size,
      totalDJs: new Set(this.songs.filter(s => s.dj_name).map(s => s.dj_name)).size,
      lastUpdate: this.songs.length > 0 ? this.songs[this.songs.length - 1].created_at : null
    };
  }

  getDJs() {
    const djMap = new Map<string, { count: number; show: string }>();
    
    this.songs.forEach(song => {
      if (song.dj_name) {
        const existing = djMap.get(song.dj_name) || { count: 0, show: song.show_name || '' };
        djMap.set(song.dj_name, {
          count: existing.count + 1,
          show: song.show_name || existing.show
        });
      }
    });

    return Array.from(djMap.entries()).map(([name, data]) => ({
      dj_name: name,
      show_name: data.show,
      song_count: data.count
    })).sort((a, b) => b.song_count - a.song_count);
  }

  getTopArtists(limit: number = 10) {
    const artistMap = new Map<string, number>();
    
    this.songs.forEach(song => {
      artistMap.set(song.artist, (artistMap.get(song.artist) || 0) + 1);
    });

    return Array.from(artistMap.entries())
      .map(([artist, count]) => ({ artist, play_count: count }))
      .sort((a, b) => b.play_count - a.play_count)
      .slice(0, limit);
  }

  searchSongs(query: string) {
    const lowerQuery = query.toLowerCase();
    return this.songs.filter(song => 
      song.artist.toLowerCase().includes(lowerQuery) ||
      song.title.toLowerCase().includes(lowerQuery) ||
      (song.album && song.album.toLowerCase().includes(lowerQuery))
    );
  }

  clear() {
    this.songs = [];
    this.nextId = 1;
  }
}

// Create a singleton instance
const memoryDb = new InMemoryDatabase();

export function initDatabase() {
  // No-op for memory database
  console.log('Using in-memory database for Railway deployment');
}

export function insertSong(song: Omit<Song, 'id' | 'created_at'>) {
  return memoryDb.insertSong(song);
}

export function getSongs(limit?: number, offset?: number) {
  return memoryDb.getSongs(limit, offset);
}

export function getSongCount() {
  return memoryDb.getSongCount();
}

export function getStats() {
  return memoryDb.getStats();
}

export function getDJs() {
  return memoryDb.getDJs();
}

export function getTopArtists(limit?: number) {
  return memoryDb.getTopArtists(limit);
}

export function searchSongs(query: string) {
  return memoryDb.searchSongs(query);
}

export default memoryDb;