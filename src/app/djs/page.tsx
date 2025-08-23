'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import PlaylistTable from '@/components/PlaylistTable';

interface DJStats {
  dj_name: string;
  total_songs: number;
  unique_artists: number;
  days_active: number;
  last_active: string;
}

export default function DJsPage() {
  const [djStats, setDjStats] = useState<DJStats[]>([]);
  const [selectedDJ, setSelectedDJ] = useState<string | null>(null);
  const [djSongs, setDjSongs] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDJStats();
  }, []);

  const fetchDJStats = async () => {
    try {
      const response = await fetch('/api/djs');
      const data = await response.json();
      if (data.success) {
        setDjStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching DJ stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDJDetails = async (djName: string) => {
    setSelectedDJ(djName);
    setLoading(true);
    try {
      const [songsRes, artistsRes] = await Promise.all([
        fetch(`/api/djs?name=${encodeURIComponent(djName)}&type=songs&limit=20`),
        fetch(`/api/djs?name=${encodeURIComponent(djName)}&type=artists&limit=10`)
      ]);
      
      const songsData = await songsRes.json();
      const artistsData = await artistsRes.json();
      
      if (songsData.success) setDjSongs(songsData.data);
      if (artistsData.success) setTopArtists(artistsData.data);
    } catch (error) {
      console.error('Error fetching DJ details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-wtmd-teal mb-6">DJ Statistics</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {djStats.map((dj) => (
              <div 
                key={dj.dj_name}
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => fetchDJDetails(dj.dj_name)}
              >
                <h3 className="text-xl font-bold text-wtmd-teal mb-3">{dj.dj_name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Songs:</span>
                    <span className="font-medium">{dj.total_songs.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Unique Artists:</span>
                    <span className="font-medium">{dj.unique_artists}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Days Active:</span>
                    <span className="font-medium">{dj.days_active}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Active:</span>
                    <span className="font-medium">{formatDate(dj.last_active)}</span>
                  </div>
                </div>
                <button className="mt-4 w-full bg-wtmd-orange hover:bg-orange-600 text-white py-2 rounded-md text-sm font-medium">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {selectedDJ && (
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-wtmd-teal mb-4">{selectedDJ}'s Playlist</h2>
              
              {topArtists.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-wtmd-teal mb-3">Top Artists</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {topArtists.map((artist: any, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded">
                        <div className="font-medium text-sm">{artist.artist}</div>
                        <div className="text-xs text-gray-600">{artist.play_count} plays</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <h3 className="text-lg font-semibold text-wtmd-teal mb-3">Recent Songs</h3>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-wtmd-orange"></div>
                </div>
              ) : djSongs.length > 0 ? (
                <PlaylistTable songs={djSongs} showDJ={false} />
              ) : (
                <p className="text-gray-600">No songs found for this DJ.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}