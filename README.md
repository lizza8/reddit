# BirdBlitz Royale (Devvit)    
   
3D bird battle royale web game for Reddit Devvit. Mobile-first controls, daily seeded arena, and leaderboard.      
   
## Quick Start  
 
1. Install deps:  
   ```bash
   npm install
   ```
2. Login to Devvit (one time):
   ```bash
   npx devvit login
   ```
3. Upload/register the app (one time): 
   ```bash
   npx devvit upload
   ```
4. Start playtest:
   ```bash
   npx devvit playtest
   ```
5. Open your playtest subreddit (created by Devvit) and open the post:
   - Title: `BirdBlitz Royale – YYYY-MM-DD`
   - Menu: Subreddit menu -> `Play BirdBlitz Royale`

## Project Structure

```
src/                Devvit server + triggers
web/                Webview client (React + R3F)
web/components/     Game scene + UI
web/hooks/          Data hooks
web/stores/         Zustand store
```

## Notes

- App name and playtest subreddit are set by the Devvit CLI during `upload/playtest`.
- The game auto-creates a daily post on install and on the daily cron.

