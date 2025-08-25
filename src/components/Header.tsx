'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-wtmd-teal text-white">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-wtmd-orange">WTMD</span>
              <span className="ml-2 text-xl">Playlist Tracker</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="hover:bg-wtmd-light-teal px-3 py-2 rounded-md text-sm font-medium">
                Live Playlist
              </Link>
              <Link href="/about" className="hover:bg-wtmd-light-teal px-3 py-2 rounded-md text-sm font-medium">
                About
              </Link>
              <Link href="/djs" className="hover:bg-wtmd-light-teal px-3 py-2 rounded-md text-sm font-medium">
                DJs
              </Link>
              <Link href="/analytics" className="hover:bg-wtmd-light-teal px-3 py-2 rounded-md text-sm font-medium">
                Analytics
              </Link>
              <Link href="/api-docs" className="hover:bg-wtmd-light-teal px-3 py-2 rounded-md text-sm font-medium">
                API Docs
              </Link>
            </div>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-wtmd-light-teal focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/" className="block hover:bg-wtmd-light-teal px-3 py-2 rounded-md text-base font-medium">
                Live Playlist
              </Link>
              <Link href="/about" className="block hover:bg-wtmd-light-teal px-3 py-2 rounded-md text-base font-medium">
                About
              </Link>
              <Link href="/djs" className="block hover:bg-wtmd-light-teal px-3 py-2 rounded-md text-base font-medium">
                DJs
              </Link>
              <Link href="/analytics" className="block hover:bg-wtmd-light-teal px-3 py-2 rounded-md text-base font-medium">
                Analytics
              </Link>
              <Link href="/api-docs" className="block hover:bg-wtmd-light-teal px-3 py-2 rounded-md text-base font-medium">
                API Docs
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}