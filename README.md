# UI Library
https://react-native-aria.geekyants.com/docs/?utm_

checng l

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## 🚀 Quick Start for New Developers

**Setup Steps:**

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Download videos:**
   - Download all video files from: https://drive.google.com/drive/folders/1UbOq1VWOajTtmeWCDY17bTFX7dFJ5f_c?usp=sharing
   - Place them in `assets/videos/` folder
   - Required videos: HandWarmUp.mov, BumperStretch.mov, HamstringStretch.mov, HipFlexorStretch.mov, ChestStretch.mov, LowerBackMuscleRelease.mov, ResetSpineStretch.mov, WarmUpSpineStretch.mov, ShoulderWarmUp.mov, UpperBackStretch.mov

3. **Start the server and app:**
   ```bash
   npm run dev
   ```
   
   This starts both:
   - Express server on `http://localhost:3001` (serves videos)
   - Expo app

### Quick Setup (Using Production API)

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure API**:
   ```bash
   cp .env.example .env
   # Edit .env and add your API URL and key
   ```

3. **Start the app**:
   ```bash
   npm start
   ```

### Quick Setup (Using Local Server)

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Install videos**:
   ```bash
   npm run install-videos
   ```
   (Or manually get videos and place in `assets/videos/`)

3. **Configure and start**:
   ```bash
   cp .env.example .env
   # Edit .env: EXPO_PUBLIC_API_URL=http://localhost:3001
   # Set API_KEY environment variable
   export API_KEY=your-secret-key
   npm run server  # Terminal 1
   npm start       # Terminal 2
   ```

## Get started (Original Instructions)

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

## 📹 Video Configuration

**Videos are served from a local Express server.**

### Setup Instructions

1. **Download Videos:**
   - Go to: https://drive.google.com/drive/folders/1UbOq1VWOajTtmeWCDY17bTFX7dFJ5f_c?usp=sharing
   - Download all `.mov` video files
   - Place them in `assets/videos/` directory

2. **Start the Server:**
   ```bash
   npm run server
   ```
   Or use `npm run dev` to start both server and app together.

3. **Verify Videos:**
   - Server will validate videos on startup
   - Check console for missing videos
   - Videos must be in `assets/videos/` folder

### Required Video Files
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

### Server Endpoints
- `GET /health` - Health check (public)
- `GET /videos` - List all videos (requires auth in production)
- `GET /videos/:filename` - Stream video file (requires auth in production)

**Note:** Authentication is disabled in development mode for easier testing.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
