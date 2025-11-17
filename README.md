# UI Library
https://react-native-aria.geekyants.com/docs/?utm_


# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Video API Configuration

Exercise videos are served from a production API server. **No local video files are required** - the app fetches videos from your API.

### Production Setup (Required)

1. **Host your videos on a production server**:
   - Upload all video files to your production API server
   - Ensure videos are accessible at: `https://your-api.com/videos/{filename}`
   - Example: `https://api.solace-app.com/videos/HandWarmUp.mov`

2. **Configure the API URL**:
   - Create a `.env` file (copy from `.env.example`)
   - Set `EXPO_PUBLIC_API_URL=https://your-api.com`
   - Or update `services/api.ts` directly with your production URL

3. **Deploy and run**:
   ```bash
   npm install
   npm start
   ```
   The app will automatically fetch videos from your production API.

### Local Development (Optional)

If you want to test with local videos:

1. **Place videos in `assets/videos/`** (not in git)
2. **Start the local API server**:
   ```bash
   npm run server
   ```
3. **Set local API URL** in `.env`:
   ```
   EXPO_PUBLIC_API_URL=http://localhost:3001
   ```

### API Endpoints Required

Your production API must provide:
- `GET /videos/:filename` - Stream video files
- Example: `GET https://api.solace-app.com/videos/HandWarmUp.mov`

### Video Hosting Options

You can host videos on:
- **Your own server** (Node.js/Express like `server/index.js`)
- **Cloud storage** (AWS S3, Google Cloud Storage, Azure Blob)
- **CDN** (Cloudflare, CloudFront)
- **Static hosting** (Vercel, Netlify with proper video support)

### Configuration

- **Environment Variable**: `EXPO_PUBLIC_API_URL` (recommended)
- **Fallback**: Uses `http://localhost:3001` in development, `https://api.solace-app.com` in production
- **Override**: Edit `services/api.ts` if needed

### Video Files
The following video files are required (currently stored locally but should be hosted on your API):
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

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
