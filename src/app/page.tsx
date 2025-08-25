'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import PlaylistTable from '@/components/PlaylistTable';

export default function Home() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const fetchSongs = async () => {
    try {
      const response = await fetch('/api/songs?limit=50');
      const data = await response.json();
      if (data.success) {
        setSongs(data.data);
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats?type=overview');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const syncPlaylist = async () => {
    setLoading(true);
    setSyncMessage(null);
    try {
      const response = await fetch('/api/sync', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        setLastSync(new Date());
        const message = data.new > 0 
          ? `Sync complete! Added ${data.new} new songs (${data.total} total found)`
          : `Sync complete! No new songs found (${data.total} songs already tracked)`;
        setSyncMessage(message);
        await fetchSongs();
        await fetchStats();
        
        // Clear message after 5 seconds
        setTimeout(() => setSyncMessage(null), 5000);
      } else {
        setSyncMessage(`Sync failed: ${data.message || 'Unknown error'}`);
        setTimeout(() => setSyncMessage(null), 5000);
      }
    } catch (error) {
      console.error('Error syncing playlist:', error);
      setSyncMessage('Sync failed: Network error');
      setTimeout(() => setSyncMessage(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchSongs(), fetchStats()]);
      setLoading(false);
    };
    loadData();
    
    const interval = setInterval(() => {
      fetchSongs();
      fetchStats();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-wtmd-teal">Live Playlist</h1>
              <div className="flex items-center gap-3">
                <a 
                  href="https://www.wtmd.org/radio/listen/#ways-to-stream"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-wtmd-teal hover:bg-teal-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                  </svg>
                  Listen Live
                </a>
                <button
                  onClick={syncPlaylist}
                  disabled={loading}
                  className="bg-wtmd-orange hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
                >
                  {loading ? 'Syncing...' : 'Sync Now'}
                </button>
              </div>
            </div>
            
            {syncMessage && (
              <div className={`mt-4 p-3 rounded-md ${syncMessage.includes('failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {syncMessage}
              </div>
            )}
            
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-gray-50 p-4 rounded">
                  <div className="text-2xl font-bold text-wtmd-teal">{stats.totalSongs?.toLocaleString() || 0}</div>
                  <div className="text-sm text-gray-600">Total Songs</div>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <div className="text-2xl font-bold text-wtmd-teal">{stats.uniqueArtists?.toLocaleString() || 0}</div>
                  <div className="text-sm text-gray-600">Unique Artists</div>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <div className="text-2xl font-bold text-wtmd-teal">{stats.totalDJs || 0}</div>
                  <div className="text-sm text-gray-600">Active DJs</div>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <div className="text-sm font-medium text-wtmd-teal">
                    {lastSync ? lastSync.toLocaleTimeString() : 'Not synced'}
                  </div>
                  <div className="text-sm text-gray-600">Last Sync</div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-wtmd-teal">Recently Played</h2>
            <span className="text-xs text-gray-500">
              {songs.length > 0 ? `${songs.length} songs tracked` : 'No playlist data available'}
            </span>
          </div>
          {loading && songs.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-wtmd-orange"></div>
              <p className="mt-2 text-gray-600">Loading playlist...</p>
            </div>
          ) : songs.length > 0 ? (
            <PlaylistTable songs={songs} />
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-600 mb-4">
                <p className="font-semibold">No playlist data available</p>
                <p className="text-sm mt-2">WTMD does not currently provide a public API for real-time playlist data.</p>
                <p className="text-sm mt-1">This app is ready to track playlists when data becomes available.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}