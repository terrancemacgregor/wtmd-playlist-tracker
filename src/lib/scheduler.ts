import cron from 'node-cron';
import { fetchAndStoreSongs } from './scraper';
import { initDatabase } from './database';

let cronJob: cron.ScheduledTask | null = null;

export function startScheduler() {
  initDatabase();
  
  if (cronJob) {
    console.log('Scheduler already running');
    return;
  }
  
  cronJob = cron.schedule('*/5 * * * *', async () => {
    console.log('Running scheduled playlist sync at', new Date().toISOString());
    try {
      const result = await fetchAndStoreSongs();
      console.log('Scheduled sync completed:', result);
    } catch (error) {
      console.error('Error in scheduled sync:', error);
    }
  });
  
  cronJob.start();
  console.log('Scheduler started - will sync every 5 minutes');
  
  fetchAndStoreSongs().then(result => {
    console.log('Initial sync completed:', result);
  }).catch(error => {
    console.error('Error in initial sync:', error);
  });
}

export function stopScheduler() {
  if (cronJob) {
    cronJob.stop();
    cronJob = null;
    console.log('Scheduler stopped');
  }
}

export function getSchedulerStatus() {
  return {
    running: cronJob !== null,
    nextRun: cronJob ? 'Every 5 minutes' : 'Not scheduled'
  };
}