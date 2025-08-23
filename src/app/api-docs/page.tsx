'use client';

import Header from '@/components/Header';
import { useState } from 'react';

const apiEndpoints = [
  {
    method: 'GET',
    path: '/api/songs',
    description: 'Retrieve playlist songs',
    params: [
      { name: 'limit', type: 'number', default: '50', description: 'Number of songs to return' },
      { name: 'type', type: 'string', default: 'recent', description: 'Type of songs (recent, top)' },
      { name: 'days', type: 'number', default: '7', description: 'Number of days for top songs' }
    ],
    example: '/api/songs?type=top&days=7&limit=20',
    response: `{
  "success": true,
  "data": [
    {
      "artist": "The Beatles",
      "title": "Hey Jude",
      "play_count": 5
    }
  ],
  "count": 20,
  "timestamp": "2024-01-01T12:00:00.000Z"
}`
  },
  {
    method: 'GET',
    path: '/api/djs',
    description: 'Get DJ statistics and playlists',
    params: [
      { name: 'name', type: 'string', required: false, description: 'DJ name for specific data' },
      { name: 'type', type: 'string', default: 'stats', description: 'Data type (stats, songs, artists)' },
      { name: 'limit', type: 'number', default: '100', description: 'Number of results' }
    ],
    example: '/api/djs?name=Alex%20Cortright&type=artists&limit=10',
    response: `{
  "success": true,
  "data": [
    {
      "artist": "Pearl Jam",
      "play_count": 12
    }
  ],
  "timestamp": "2024-01-01T12:00:00.000Z"
}`
  },
  {
    method: 'GET',
    path: '/api/stats',
    description: 'Get playlist statistics',
    params: [
      { name: 'type', type: 'string', default: 'overview', description: 'Stats type (overview, hourly, daily, genre-distribution)' }
    ],
    example: '/api/stats?type=overview',
    response: `{
  "success": true,
  "data": {
    "totalSongs": 1234,
    "uniqueArtists": 456,
    "totalDJs": 8,
    "lastUpdate": "2024-01-01T12:00:00.000Z"
  },
  "type": "overview",
  "timestamp": "2024-01-01T12:00:00.000Z"
}`
  },
  {
    method: 'POST',
    path: '/api/sync',
    description: 'Manually trigger playlist synchronization',
    params: [],
    example: 'POST /api/sync',
    response: `{
  "success": true,
  "message": "Playlist synchronized successfully",
  "total": 50,
  "new": 5,
  "timestamp": "2024-01-01T12:00:00.000Z"
}`
  }
];

export default function ApiDocsPage() {
  const [expandedEndpoint, setExpandedEndpoint] = useState<number | null>(null);
  const [copiedExample, setCopiedExample] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedExample(id);
    setTimeout(() => setCopiedExample(null), 2000);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-500';
      case 'POST': return 'bg-blue-500';
      case 'PUT': return 'bg-yellow-500';
      case 'DELETE': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-wtmd-teal mb-4">API Documentation</h1>
          <p className="text-gray-600">
            Complete reference for the WTMD Playlist Tracker API. All endpoints return JSON responses.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-wtmd-teal mb-4">Base URL</h2>
          <div className="bg-gray-100 p-4 rounded font-mono text-sm">
            http://localhost:3000
          </div>
        </div>
        
        <div className="space-y-4">
          {apiEndpoints.map((endpoint, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div
                className="p-6 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedEndpoint(expandedEndpoint === index ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className={`${getMethodColor(endpoint.method)} text-white px-3 py-1 rounded text-sm font-medium`}>
                      {endpoint.method}
                    </span>
                    <code className="text-lg font-mono text-gray-900">{endpoint.path}</code>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform ${expandedEndpoint === index ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <p className="mt-2 text-gray-600">{endpoint.description}</p>
              </div>
              
              {expandedEndpoint === index && (
                <div className="border-t px-6 py-4 space-y-4">
                  {endpoint.params.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Parameters</h3>
                      <table className="min-w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Default</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {endpoint.params.map((param, pIndex) => (
                            <tr key={pIndex}>
                              <td className="px-4 py-2 text-sm font-mono text-gray-900">
                                {param.name}
                                {param.required && <span className="text-red-500 ml-1">*</span>}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-600">{param.type}</td>
                              <td className="px-4 py-2 text-sm text-gray-600">{param.default || '-'}</td>
                              <td className="px-4 py-2 text-sm text-gray-600">{param.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Example Request</h3>
                    <div className="bg-gray-100 p-4 rounded relative">
                      <code className="text-sm text-gray-800">{endpoint.example}</code>
                      <button
                        onClick={() => copyToClipboard(endpoint.example, `example-${index}`)}
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                      >
                        {copiedExample === `example-${index}` ? (
                          <span className="text-green-500 text-sm">Copied!</span>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Example Response</h3>
                    <div className="bg-gray-100 p-4 rounded overflow-x-auto">
                      <pre className="text-sm text-gray-800">{endpoint.response}</pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-wtmd-teal mb-4">Rate Limiting</h2>
          <p className="text-gray-600 mb-4">
            The API automatically fetches new playlist data every 5 minutes. Manual sync requests via POST /api/sync 
            should be limited to prevent overwhelming the source server.
          </p>
          
          <h2 className="text-xl font-bold text-wtmd-teal mb-4 mt-6">Authentication</h2>
          <p className="text-gray-600 mb-4">
            Currently, the API does not require authentication. In production, consider implementing API keys or OAuth 
            for secure access.
          </p>
          
          <h2 className="text-xl font-bold text-wtmd-teal mb-4 mt-6">Error Responses</h2>
          <p className="text-gray-600 mb-2">All endpoints return consistent error responses:</p>
          <div className="bg-gray-100 p-4 rounded">
            <pre className="text-sm text-gray-800">{`{
  "success": false,
  "error": "Error message description",
  "status": 500
}`}</pre>
          </div>
        </div>
      </main>
    </div>
  );
}