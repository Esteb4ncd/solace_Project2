# Google Drive Video Setup

The Express server automatically proxies videos from Google Drive - no downloads needed!

## One-Time Setup (You Only)

**Note:** The server will first check for local videos in `assets/videos/`. If not found, it proxies from Google Drive.

### Step 1: Upload Videos to Google Drive

1. Create a folder in Google Drive
2. Upload all 10 video files:
   - HandWarmUp.mov
   - BumperStretch.mov
   - HamstringStretch.mov
   - HipFlexorStretch.mov
   - ChestStretch.mov
   - LowerBackMuscleRelease.mov
   - ResetSpineStretch.mov
   - WarmUpSpineStretch.mov
   - ShoulderWarmUp.mov
   - UpperBackStretch.mov

### Step 2: Make Files Shareable

For each video file:
1. Right-click the file → "Share"
2. Click "Change" next to "Restricted"
3. Select "Anyone with the link"
4. Click "Copy link"
5. The link will look like: `https://drive.google.com/file/d/FILE_ID_HERE/view`
6. Copy the `FILE_ID_HERE` part (the long string between `/d/` and `/view`)

### Step 3: Update videoUrls.json

Open `constants/videoUrls.json` and replace each `YOUR_GOOGLE_DRIVE_FILE_ID_HERE` with the actual file IDs:

```json
{
  "videoBaseUrl": "https://drive.google.com/uc?export=download&id=",
  "videos": {
    "HandWarmUp.mov": "1a2b3c4d5e6f7g8h9i0j",
    "BumperStretch.mov": "2b3c4d5e6f7g8h9i0j1a",
    ...
  }
}
```

**That's it!** Videos will now stream directly from Google Drive.

## For Other Developers

They just need to:
```bash
npm install
npm start
```

Videos stream automatically - no setup needed!

## How It Works

- Videos are stored on Google Drive
- App fetches video URLs from `videoUrls.json`
- Videos stream directly to the app (no downloads)
- Works on all devices automatically

## Troubleshooting

**Videos not loading?**
- Check that files are set to "Anyone with the link"
- Verify file IDs in `videoUrls.json` are correct
- Make sure the file IDs match the actual Google Drive files

