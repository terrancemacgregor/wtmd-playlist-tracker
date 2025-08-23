'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';

export default function AnalyticsPage() {
  const [topSongs, setTopSongs] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(7);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [songsRes, hourlyRes, dailyRes] = await Promise.all([
        fetch(`/api/songs?type=top&days=${timeRange}&limit=20`),
        fetch('/api/stats?type=hourly'),
        fetch('/api/stats?type=daily')
      ]);
      
      const songsData = await songsRes.json();
      const hourlyData = await hourlyRes.json();
      const dailyData = await dailyRes.json();
      
      if (songsData.success) setTopSongs(songsData.data);
      if (hourlyData.success) setHourlyData(hourlyData.data);
      if (dailyData.success) setDailyData(dailyData.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHourLabel = (hour: string) => {
    const h = parseInt(hour);
    if (h === 0) return '12 AM';
    if (h === 12) return '12 PM';
    return h > 12 ? `${h - 12} PM` : `${h} AM`;
  };

  const getMaxPlays = (data: any[]) => {
    return Math.max(...data.map(d => d.play_count || 0));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-wtmd-teal">Analytics Dashboard</h1>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(parseInt(e.target.value))}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-wtmd-orange"
            >
              <option value={1}>Last 24 Hours</option>
              <option value={7}>Last 7 Days</option>
              <option value={30}>Last 30 Days</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-wtmd-orange"></div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-wtmd-teal mb-4">Top Songs</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Artist</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Plays</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {topSongs.map((song: any, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">#{index + 1}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{song.artist}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{song.title}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-wtmd-orange text-white">
                            {song.play_count}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-wtmd-teal mb-4">Hourly Activity</h2>
              <div className="h-64 flex items-end space-x-2">
                {hourlyData.map((hour: any) => {
                  const maxPlays = getMaxPlays(hourlyData);
                  const height = maxPlays > 0 ? (hour.play_count / maxPlays) * 100 : 0;
                  return (
                    <div key={hour.hour} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-wtmd-orange hover:bg-orange-600 transition-colors rounded-t"
                        style={{ height: `${height}%` }}
                        title={`${hour.play_count} plays`}
                      />
                      <span className="text-xs text-gray-600 mt-1">{getHourLabel(hour.hour)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-wtmd-teal mb-4">Daily Trends</h2>
              <div className="space-y-3">
                {dailyData.slice(0, 10).map((day: any) => (
                  <div key={day.date} className="flex items-center justify-between py-2 border-b">
                    <div>
                      <div className="font-medium text-gray-900">
                        {new Date(day.date).toLocaleDateString('en-US', { 
                          weekday: 'short',
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="text-sm text-gray-600">
                        {day.unique_artists} unique artists
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-wtmd-teal">{day.play_count}</div>
                      <div className="text-xs text-gray-600">songs played</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}