'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import PlaylistTable from '@/components/PlaylistTable';

export default function Home() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);

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
    try {
      const response = await fetch('/api/sync', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        setLastSync(new Date());
        await fetchSongs();
        await fetchStats();
      }
    } catch (error) {
      console.error('Error syncing playlist:', error);
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
              <button
                onClick={syncPlaylist}
                disabled={loading}
                className="bg-wtmd-orange hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
              >
                {loading ? 'Syncing...' : 'Sync Now'}
              </button>
            </div>
            
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
          <h2 className="text-xl font-bold text-wtmd-teal mb-4">Recently Played</h2>
          {loading && songs.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-wtmd-orange"></div>
              <p className="mt-2 text-gray-600">Loading playlist...</p>
            </div>
          ) : songs.length > 0 ? (
            <PlaylistTable songs={songs} />
          ) : (
            <div className="text-center py-8 text-gray-600">
              No songs found. Click "Sync Now" to fetch the latest playlist.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}