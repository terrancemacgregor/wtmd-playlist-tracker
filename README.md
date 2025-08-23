# WTMD Playlist Tracker

A Next.js application for tracking and analyzing WTMD 89.7 FM playlist data with real-time updates, DJ statistics, and music analytics. Features the official WTMD color scheme and responsive design.

## Features

- **Real-time Playlist Tracking**: Automatically fetches and stores playlist data every 5 minutes
- **DJ Analytics**: Track what each DJ plays, their favorite artists, and play patterns
- **Music Statistics**: View top songs, hourly activity patterns, and daily trends
- **RESTful API**: Full API access to all playlist data
- **WTMD-styled Interface**: Matches the official WTMD website design with teal (#02383b) and orange (#f8951d) color scheme
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Sample Data**: Includes seed data for demonstration purposes

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS 3.4
- **Backend**: Next.js API Routes
- **Database**: SQLite with Better-SQLite3
- **Scraping**: Axios + Cheerio
- **Scheduling**: Node-cron
- **Styling**: Tailwind CSS with custom WTMD color palette

## Installation

1. Clone the repository or extract the zip file:
```bash
cd wtmd-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Initialize the database with sample data:
```bash
# For demo data (recommended for first run)
curl -X POST http://localhost:3000/api/seed

# Or fetch real playlist data
npm run sync
```

## Running the Application

### Development Mode
```bash
npm run dev
```
Visit http://localhost:3000

### Production Mode
```bash
npm run build
npm run start
```

### Run Scheduler (for automatic updates every 5 minutes)
```bash
# In a separate terminal
npm run scheduler
```

## API Endpoints

### Songs
- `GET /api/songs` - Get recent or top songs
  - Query params: `type` (recent/top), `limit`, `days`

### DJs
- `GET /api/djs` - Get DJ statistics
  - Query params: `name`, `type` (stats/songs/artists), `limit`

### Statistics
- `GET /api/stats` - Get playlist statistics
  - Query params: `type` (overview/hourly/daily/genre-distribution)

### Sync
- `POST /api/sync` - Manually trigger playlist sync

## Project Structure

```
wtmd-tracker/
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── analytics/     # Analytics page
│   │   ├── api-docs/      # API documentation
│   │   ├── djs/           # DJ statistics page
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Home page
│   ├── components/        # React components
│   │   ├── Header.tsx
│   │   └── PlaylistTable.tsx
│   └── lib/              # Core functionality
│       ├── database.ts   # Database operations
│       ├── scraper.ts    # Playlist scraping
│       └── scheduler.ts  # Cron job scheduler
├── public/               # Static assets
└── wtmd.db              # SQLite database

```

## Database Schema

### Songs Table
- `id`: Primary key
- `artist`: Artist name
- `title`: Song title
- `album`: Album name (optional)
- `played_at`: Timestamp when played
- `dj_name`: DJ who played the song
- `show_name`: Show name
- `created_at`: Record creation time

### Additional Tables
- `djs`: DJ information
- `genres`: Music genres
- `song_genres`: Song-genre relationships

## Features in Detail

### Live Playlist
- Shows the most recently played songs
- Real-time updates every minute
- Manual sync button for immediate updates
- Display of total songs, unique artists, and active DJs

### DJ Statistics
- Individual DJ profiles
- Top artists played by each DJ
- Total songs and unique artists per DJ
- Recent playlist for each DJ

### Analytics Dashboard
- Top songs by play count
- Hourly activity visualization
- Daily trends and patterns
- Time range selection (24 hours, 7 days, 30 days)

### API Documentation
- Interactive API documentation
- Example requests and responses
- Copy-to-clipboard functionality
- Parameter descriptions

## Pages

- **Home** (`/`) - Live playlist view with recent songs and sync controls
- **DJs** (`/djs`) - DJ statistics, top artists, and individual playlists
- **Analytics** (`/analytics`) - Music trends, top songs, hourly activity charts
- **API Documentation** (`/api-docs`) - Interactive API documentation with examples

## Key Files

- `src/lib/database.ts` - Database operations and schema
- `src/lib/scraper.ts` - Playlist scraping logic
- `src/lib/scheduler.ts` - Automated sync scheduling
- `src/lib/seed-data.ts` - Sample data for demonstration
- `src/app/api/` - API route handlers
- `src/components/` - React components
- `tailwind.config.js` - Custom WTMD color configuration

## Development Notes

- The scraper fetches data from WTMD's playlist page
- DJ assignments are estimated based on typical show schedules
- Database uses SQLite for simplicity and portability
- All times are stored in UTC and converted for display
- Sample data includes 30+ classic rock and alternative songs
- The application auto-refreshes data every minute in the browser

## Troubleshooting

If styles are not loading:
1. Clear the `.next` folder: `rm -rf .next`
2. Restart the development server: `npm run dev`

If the database is empty:
1. Run the seed command: `curl -X POST http://localhost:3000/api/seed`
2. Or sync real data: `npm run sync`

## License

MIT

## Author

Built with Next.js, Tailwind CSS, and SQLite for tracking WTMD 89.7 FM Baltimore's playlist data.