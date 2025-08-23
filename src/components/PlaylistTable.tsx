'use client';

interface Song {
  id: number;
  artist: string;
  title: string;
  album?: string;
  played_at: string;
  dj_name?: string;
  show_name?: string;
}

interface PlaylistTableProps {
  songs: Song[];
  showDJ?: boolean;
}

export default function PlaylistTable({ songs, showDJ = true }: PlaylistTableProps) {
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full bg-white">
        <thead className="bg-wtmd-teal text-white">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Artist</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">Album</th>
            {showDJ && (
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell">DJ</th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {songs.map((song) => (
            <tr key={song.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>
                  <div className="font-medium">{formatTime(song.played_at)}</div>
                  <div className="text-xs text-gray-500">{formatDate(song.played_at)}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {song.artist}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {song.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                {song.album || '-'}
              </td>
              {showDJ && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                  <div>
                    <div className="font-medium">{song.dj_name || 'Unknown'}</div>
                    {song.show_name && (
                      <div className="text-xs text-gray-400">{song.show_name}</div>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}