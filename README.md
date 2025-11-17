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

## Video API Server

Exercise videos are served via a local Express API server. Videos are **not** stored in this repository (they're too large for git).

### Running the Video API Server

1. **Install dependencies** (if you haven't already):
   ```bash
   npm install
   ```

2. **Start the video API server**:
   ```bash
   npm run server
   ```
   
   The server will run on `http://localhost:3001`

3. **Start both the API server and Expo app** (in separate terminals):
   ```bash
   # Terminal 1: Start API server
   npm run server
   
   # Terminal 2: Start Expo app
   npm start
   ```

### API Endpoints

- `GET /health` - Health check endpoint
- `GET /videos` - List all available videos
- `GET /videos/:filename` - Stream a specific video file

### Video Files Location
- Local development: Videos are stored in `assets/videos/` (ignored by git)
- The API server automatically serves videos from this directory
- Production: Update `services/api.ts` to point to your production API URL

### Configuration
- The API server runs on port `3001` by default
- You can change the port by setting the `PORT` environment variable
- The app automatically uses `http://localhost:3001` in development mode

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
