# Video API Server

## Overview
This Express server serves exercise videos for the Solace app. **Deploy this to production** so users don't need to download videos locally.

## Quick Start (Production)

1. **Upload videos to your server**:
   - Place all `.mov` files in `assets/videos/` on your server
   - Required videos: HandWarmUp.mov, BumperStretch.mov, etc. (see exercises.json)

2. **Deploy the server**:
   ```bash
   # Install dependencies
   npm install
   
   # Set port (optional, defaults to 3001)
   export PORT=3001
   
   # Start server (use PM2, systemd, or your hosting service)
   node server/index.js
   ```

3. **Update app configuration**:
   - Set `EXPO_PUBLIC_API_URL=https://your-server.com` in `.env`
   - Or update `services/api.ts` with your production URL

## Running Locally (Development)

```bash
npm run server
```

The server will start on `http://localhost:3001`

## API Endpoints

- `GET /health` - Health check with video validation status
- `GET /videos` - List all available videos
- `GET /videos/:filename` - Stream a specific video file (supports range requests for streaming)

## Deployment Options

### Option 1: Deploy to a VPS/Server
- Upload the `server/` folder and videos
- Install Node.js
- Run with PM2: `pm2 start server/index.js`
- Use nginx as reverse proxy

### Option 2: Deploy to Cloud Platforms
- **Heroku**: Add `Procfile` with `web: node server/index.js`
- **Railway**: Auto-detects Node.js, set PORT env var
- **Render**: Set build command and start command
- **DigitalOcean App Platform**: Configure Node.js app

### Option 3: Use Cloud Storage + CDN
Instead of serving from this server, you can:
- Upload videos to AWS S3, Google Cloud Storage, or Azure Blob
- Use CloudFront/Cloudflare CDN
- Update API to return direct CDN URLs

## Video Storage

- **Production**: Videos must be in `assets/videos/` on your server
- **Local Development**: Optional - place videos in `assets/videos/` for testing
- **Git**: Videos are in `.gitignore` (not committed)

## Environment Variables

- `PORT` - Server port (default: 3001)

## Notes

- Server gracefully handles missing videos (returns 404/503)
- Supports HTTP range requests for video streaming
- CORS enabled for React Native apps
- Validates videos on startup

