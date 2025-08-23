import { insertSong, initDatabase } from './database';

export function seedDatabase() {
  initDatabase();
  
  const sampleSongs = [
    { artist: 'Pearl Jam', title: 'Alive', album: 'Ten', dj: 'Alex Cortright', show: 'Morning Show', hour: 8 },
    { artist: 'Nirvana', title: 'Smells Like Teen Spirit', album: 'Nevermind', dj: 'Alex Cortright', show: 'Morning Show', hour: 8 },
    { artist: 'The Beatles', title: 'Hey Jude', album: 'Past Masters', dj: 'Megan Byrd', show: 'Middays', hour: 11 },
    { artist: 'Led Zeppelin', title: 'Stairway to Heaven', album: 'IV', dj: 'Megan Byrd', show: 'Middays', hour: 12 },
    { artist: 'Pink Floyd', title: 'Wish You Were Here', album: 'Wish You Were Here', dj: 'Rob Timm', show: 'Afternoons', hour: 15 },
    { artist: 'Queen', title: 'Bohemian Rhapsody', album: 'A Night at the Opera', dj: 'Rob Timm', show: 'Afternoons', hour: 16 },
    { artist: 'David Bowie', title: 'Heroes', album: 'Heroes', dj: 'Paul Hartman', show: 'Detour', hour: 20 },
    { artist: 'The Rolling Stones', title: 'Paint It Black', album: 'Aftermath', dj: 'Paul Hartman', show: 'Detour', hour: 21 },
    { artist: 'Bob Dylan', title: 'Like a Rolling Stone', album: 'Highway 61 Revisited', dj: 'Alex Cortright', show: 'Morning Show', hour: 9 },
    { artist: 'Radiohead', title: 'Creep', album: 'Pablo Honey', dj: 'Megan Byrd', show: 'Middays', hour: 13 },
    { artist: 'U2', title: 'With or Without You', album: 'The Joshua Tree', dj: 'Rob Timm', show: 'Afternoons', hour: 14 },
    { artist: 'The Who', title: 'Baba O\'Riley', album: 'Who\'s Next', dj: 'Rob Timm', show: 'Afternoons', hour: 17 },
    { artist: 'Fleetwood Mac', title: 'Dreams', album: 'Rumours', dj: 'Alex Cortright', show: 'Morning Show', hour: 7 },
    { artist: 'Eagles', title: 'Hotel California', album: 'Hotel California', dj: 'Megan Byrd', show: 'Middays', hour: 10 },
    { artist: 'AC/DC', title: 'Back in Black', album: 'Back in Black', dj: 'Rob Timm', show: 'Afternoons', hour: 16 },
    { artist: 'Guns N\' Roses', title: 'Sweet Child O\' Mine', album: 'Appetite for Destruction', dj: 'Paul Hartman', show: 'Detour', hour: 20 },
    { artist: 'Metallica', title: 'Enter Sandman', album: 'Metallica', dj: 'Paul Hartman', show: 'Detour', hour: 21 },
    { artist: 'Pearl Jam', title: 'Black', album: 'Ten', dj: 'Alex Cortright', show: 'Morning Show', hour: 8 },
    { artist: 'Soundgarden', title: 'Black Hole Sun', album: 'Superunknown', dj: 'Megan Byrd', show: 'Middays', hour: 11 },
    { artist: 'Alice in Chains', title: 'Man in the Box', album: 'Facelift', dj: 'Rob Timm', show: 'Afternoons', hour: 15 },
    { artist: 'Stone Temple Pilots', title: 'Plush', album: 'Core', dj: 'Rob Timm', show: 'Afternoons', hour: 16 },
    { artist: 'Red Hot Chili Peppers', title: 'Under the Bridge', album: 'Blood Sugar Sex Magik', dj: 'Paul Hartman', show: 'Detour', hour: 20 },
    { artist: 'Foo Fighters', title: 'Everlong', album: 'The Colour and the Shape', dj: 'Alex Cortright', show: 'Morning Show', hour: 9 },
    { artist: 'Green Day', title: 'Basket Case', album: 'Dookie', dj: 'Megan Byrd', show: 'Middays', hour: 12 },
    { artist: 'Weezer', title: 'Buddy Holly', album: 'Weezer (Blue Album)', dj: 'Rob Timm', show: 'Afternoons', hour: 14 },
    { artist: 'Beck', title: 'Loser', album: 'Mellow Gold', dj: 'Paul Hartman', show: 'Detour', hour: 21 },
    { artist: 'The Strokes', title: 'Last Nite', album: 'Is This It', dj: 'Alex Cortright', show: 'Morning Show', hour: 8 },
    { artist: 'Arctic Monkeys', title: 'Do I Wanna Know?', album: 'AM', dj: 'Megan Byrd', show: 'Middays', hour: 13 },
    { artist: 'The Black Keys', title: 'Lonely Boy', album: 'El Camino', dj: 'Rob Timm', show: 'Afternoons', hour: 15 },
    { artist: 'Kings of Leon', title: 'Use Somebody', album: 'Only by the Night', dj: 'Rob Timm', show: 'Afternoons', hour: 17 },
  ];
  
  const now = new Date();
  let addedCount = 0;
  
  sampleSongs.forEach((song, index) => {
    const playedAt = new Date(now);
    playedAt.setDate(playedAt.getDate() - Math.floor(index / 10));
    playedAt.setHours(song.hour, Math.floor(Math.random() * 60), 0, 0);
    
    try {
      const result = insertSong({
        artist: song.artist,
        title: song.title,
        album: song.album,
        played_at: playedAt.toISOString(),
        dj_name: song.dj,
        show_name: song.show
      });
      
      if (result.changes > 0) {
        addedCount++;
      }
    } catch (error) {
      console.error(`Error inserting ${song.artist} - ${song.title}:`, error);
    }
  });
  
  console.log(`Added ${addedCount} sample songs to database`);
  return addedCount;
}