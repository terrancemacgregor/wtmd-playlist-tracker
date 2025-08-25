'use client';

import Header from '@/components/Header';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Listen Now Banner */}
        <div className="bg-wtmd-orange text-white rounded-lg shadow-lg p-6 mb-8 text-center">
          <a 
            href="https://www.wtmd.org/radio/listen/#ways-to-stream"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-2xl font-bold hover:underline"
          >
            <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
            </svg>
            Listen to WTMD Now
          </a>
          <p className="mt-2 text-sm">Stream live 24/7 - Baltimore's music discovery station</p>
          <p className="mt-1 text-xs">Multiple streaming options available</p>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-wtmd-teal mb-6">About WTMD 89.7 FM</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold text-wtmd-teal mb-3">Baltimore's Music Discovery Station</h2>
              <p className="leading-relaxed">
                WTMD 89.7 FM is a non-commercial, listener-supported radio station broadcasting from 
                Towson University in Baltimore, Maryland. Since 2002, WTMD has been dedicated to 
                presenting the best in contemporary music discovery, from emerging artists to 
                established favorites across multiple genres.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-wtmd-teal mb-3">Our Mission</h2>
              <p className="leading-relaxed">
                WTMD connects music lovers with authentic, handpicked music that moves, inspires, 
                and delights. Our knowledgeable DJs curate a unique blend of indie rock, folk, 
                blues, alternative, and world music, introducing listeners to their next favorite 
                artist while celebrating the music they already love.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-wtmd-teal mb-3">Community Connection</h2>
              <p className="leading-relaxed">
                As a community-supported station, WTMD serves the Baltimore-Washington region with 
                more than just great music. We host live performances, support local artists, and 
                produce signature events like First Thursday Concerts in Canton Waterfront Park, 
                bringing the community together through the power of music.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-wtmd-teal mb-3">Award-Winning Radio</h2>
              <p className="leading-relaxed">
                WTMD has been recognized nationally for excellence in broadcasting, earning numerous 
                awards for our programming and community service. Our commitment to quality, diverse 
                music programming has made us a vital part of Baltimore's cultural landscape.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-wtmd-teal mb-3">Support & Listen</h2>
              <p className="leading-relaxed mb-4">
                WTMD relies on the generous support of our listeners to keep great music on the air. 
                Whether you tune in on 89.7 FM in the Baltimore area or stream us online from anywhere 
                in the world, you're part of the WTMD community.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="https://www.wtmd.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-wtmd-teal text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors"
                >
                  Visit WTMD.org
                </a>
                <a 
                  href="https://www.wtmd.org/support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-wtmd-orange text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors"
                >
                  Become a Member
                </a>
              </div>
            </section>

            <section className="border-t pt-6">
              <h2 className="text-2xl font-semibold text-wtmd-teal mb-3">Station Details</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt className="font-semibold text-gray-600">Frequency:</dt>
                  <dd>89.7 FM</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-600">Call Letters:</dt>
                  <dd>WTMD</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-600">Location:</dt>
                  <dd>Towson University, Baltimore, MD</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-600">Format:</dt>
                  <dd>Adult Album Alternative (AAA)</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-600">Owner:</dt>
                  <dd>Towson University</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-600">On Air Since:</dt>
                  <dd>2002</dd>
                </div>
              </dl>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}