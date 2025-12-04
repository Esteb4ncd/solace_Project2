# Video Loading Fix Guide

## ✅ Changes Made

1. **Removed authentication requirement** for video endpoints (development only)
2. **Added better error handling** in video player with retry functionality
3. **Improved content-type detection** for different video formats (.mov, .mp4, .m4v)
4. **Added helpful error messages** that guide users to fix issues

## 🚀 Quick Fix Steps

### Step 1: Start the Video Server

The videos are served by a local Express server. You need to start it:

```bash
# Option 1: Start server only
npm run server

# Option 2: Start both server and Expo app (recommended)
npm run dev
```

The server should start on `http://localhost:3001`

### Step 2: Verify Server is Running

Check the terminal output. You should see:
```
🚀 Video API server running on http://localhost:3001
📹 Videos directory: /path/to/assets/videos
✅ Found 10 video(s) in directory
```

### Step 3: Test Video Access

Run the diagnostic script:
```bash
node check-videos.js
```

This will check:
- ✅ Videos directory exists
- ✅ Video files are present
- ✅ Server is running
- ✅ Video endpoint is accessible

## 🔧 Troubleshooting

### Issue: "Cannot connect to video server"

**Solution:**
1. Make sure the server is running: `npm run server`
2. Check if port 3001 is available
3. For physical devices, set `EXPO_PUBLIC_API_URL` to your machine's IP:
   ```bash
   # Find your IP address (Mac/Linux)
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Then in .env file:
   EXPO_PUBLIC_API_URL=http://YOUR_IP:3001
   ```

### Issue: "Video not found"

**Solution:**
1. Verify videos are in `assets/videos/` directory
2. Check file names match `exercises.json`
3. Ensure video files have correct extensions (.mov, .mp4, .m4v)

### Issue: Videos load but don't play

**Solution:**
1. Check video file format (should be .mov, .mp4, or .m4v)
2. Verify video files aren't corrupted
3. Check console for specific error messages

### Issue: Android Emulator can't connect

**Solution:**
- Android emulator uses `10.0.2.2` instead of `localhost`
- The code automatically handles this, but ensure server is accessible

### Issue: Physical Device can't connect

**Solution:**
1. Find your computer's local IP address
2. Set in `.env` file:
   ```
   EXPO_PUBLIC_API_URL=http://192.168.1.XXX:3001
   ```
3. Make sure phone and computer are on same WiFi network
4. Restart Expo app after changing .env

## 📋 Video Files Required

The following videos should be in `assets/videos/`:
- HandWarmUp.mov
- ShoulderWarmUp.mov
- UpperBackStretch.mov
- BumperStretch.mov
- HamstringStretch.mov
- HipFlexorStretch.mov
- ChestStretch.mov
- LowerBackMuscleRelease.mov
- ResetSpineStretch.mov
- WarmUpSpineStretch.mov

## 🎯 Current Status

✅ Videos directory exists: `assets/videos/`
✅ 10 video files found
✅ Server code updated (no auth required for videos)
✅ Error handling improved
✅ Retry functionality added

## 🚀 Next Steps

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Open the app** and try playing a video

3. **Check console logs** for video loading messages:
   - `📹 Video URL for...` - Shows the URL being requested
   - `🔄 Video loading started` - Video is starting to load
   - `✅ Video loaded successfully` - Video is ready to play
   - `❌ Video error` - Something went wrong (check error message)

4. **If videos still don't load:**
   - Run `node check-videos.js` to diagnose
   - Check server terminal for errors
   - Verify video file names match exactly (case-sensitive)
   - Check network connectivity

## 💡 Development Tips

- **Always run `npm run dev`** to start both server and app together
- **Check server logs** in the terminal running `npm run server`
- **Use the retry button** in the video player if loading fails
- **Restart server** if you add new videos or change video files


