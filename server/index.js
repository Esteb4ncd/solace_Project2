const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// API Key for authentication (set via environment variable)
const API_KEY = process.env.API_KEY || 'your-secret-api-key-change-this';

// Enable CORS for all routes (needed for React Native)
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Authentication middleware
// In development, allow requests without API key (for easier local testing)
// In production, require API key
const authenticate = (req, res, next) => {
  // Skip authentication in development mode (when using default API key)
  if (API_KEY === 'your-secret-api-key-change-this' || process.env.NODE_ENV !== 'production') {
    return next();
  }
  
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  
  if (!apiKey) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'API key is required. Include it in header: x-api-key or as query param: ?apiKey=your-key'
    });
  }
  
  if (apiKey !== API_KEY) {
    return res.status(403).json({ 
      error: 'Forbidden',
      message: 'Invalid API key'
    });
  }
  
  next();
};

// Serve videos from the assets/videos directory (local files only)
const VIDEOS_DIR = path.join(__dirname, '..', 'assets', 'videos');

// Load exercises.json to validate all required videos exist
const EXERCISES_PATH = path.join(__dirname, '..', 'constants', 'exercises.json');
let requiredVideos = [];

try {
  const exercisesData = JSON.parse(fs.readFileSync(EXERCISES_PATH, 'utf8'));
  requiredVideos = exercisesData.map(ex => ex.videoFileName);
} catch (error) {
  console.warn('⚠️  Could not load exercises.json:', error.message);
}

// Validate all videos exist on startup
function validateVideos() {
  try {
    // Check if videos directory exists
    if (!fs.existsSync(VIDEOS_DIR)) {
      console.log('\n📹 Video Validation:');
      console.log(`   ⚠️  Videos directory does not exist: ${VIDEOS_DIR}`);
      console.log(`   ℹ️  Videos should be hosted on your production API server`);
      return { availableVideos: [], missingVideos: requiredVideos, extraVideos: [] };
    }

    const availableVideos = fs.readdirSync(VIDEOS_DIR).filter(file => 
      file.endsWith('.mov') || file.endsWith('.mp4') || file.endsWith('.m4v')
    );
    
    const missingVideos = requiredVideos.filter(video => !availableVideos.includes(video));
    const extraVideos = availableVideos.filter(video => !requiredVideos.includes(video));
    
    console.log('\n📹 Video Validation:');
    console.log(`   ✅ Found ${availableVideos.length} video(s) in directory`);
    console.log(`   📋 Required: ${requiredVideos.length} video(s) from exercises.json`);
    
    if (missingVideos.length > 0) {
      console.log(`   ⚠️  Missing videos: ${missingVideos.join(', ')}`);
      console.log(`   ℹ️  These videos should be hosted on your production API server`);
    }
    
    if (extraVideos.length > 0) {
      console.log(`   ℹ️  Extra videos (not in exercises.json): ${extraVideos.join(', ')}`);
    }
    
    if (missingVideos.length === 0 && requiredVideos.length > 0) {
      console.log('   ✅ All required videos are available!\n');
    } else if (availableVideos.length === 0) {
      console.log('   ℹ️  No videos found locally - using production API\n');
    }
    
    return { availableVideos, missingVideos, extraVideos };
  } catch (error) {
    console.log('\n📹 Video Validation:');
    console.log(`   ⚠️  Error reading videos directory: ${error.message}`);
    console.log(`   ℹ️  Videos should be hosted on your production API server`);
    return { availableVideos: [], missingVideos: requiredVideos, extraVideos: [] };
  }
}

// Health check endpoint (public, no auth needed)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Video API server is running',
    authenticated: false
  });
});

// Protected health check with video info (requires auth)
app.get('/health/status', authenticate, (req, res) => {
  const validation = validateVideos();
  res.json({ 
    status: 'ok', 
    message: 'Video API server is running',
    authenticated: true,
    videos: {
      total: validation.availableVideos.length,
      required: requiredVideos.length,
      missing: validation.missingVideos,
      available: validation.availableVideos
    }
  });
});

// List all available videos with metadata (requires authentication)
app.get('/videos', authenticate, (req, res) => {
  try {
    // Check if videos directory exists
    if (!fs.existsSync(VIDEOS_DIR)) {
      return res.json({ 
        videos: [],
        videosWithMetadata: [],
        total: 0,
        required: requiredVideos.length,
        missing: requiredVideos,
        message: 'Videos directory not found. Videos should be hosted on production API server.'
      });
    }

    const files = fs.readdirSync(VIDEOS_DIR);
    const videoFiles = files.filter(file => 
      file.endsWith('.mov') || file.endsWith('.mp4') || file.endsWith('.m4v')
    );
    
    // Get file sizes and stats
    const videosWithMetadata = videoFiles.map(filename => {
      const filePath = path.join(VIDEOS_DIR, filename);
      const stats = fs.statSync(filePath);
      const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
      
      return {
        filename,
        size: stats.size,
        sizeMB: parseFloat(sizeInMB),
        url: `http://localhost:${PORT}/videos/${encodeURIComponent(filename)}`,
        isRequired: requiredVideos.includes(filename)
      };
    });
    
    res.json({ 
      videos: videoFiles,
      videosWithMetadata,
      total: videoFiles.length,
      required: requiredVideos.length,
      missing: requiredVideos.filter(v => !videoFiles.includes(v))
    });
  } catch (error) {
    console.error('Error reading videos directory:', error);
    res.status(500).json({ 
      error: 'Failed to list videos',
      message: error.message 
    });
  }
});

// Serve individual video files (requires authentication)
app.get('/videos/:filename', authenticate, (req, res) => {
  const filename = req.params.filename;
  
  // Serve from local files only
  const filePath = path.join(VIDEOS_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ 
      error: 'Video not found', 
      filename,
      message: `Video file not found: ${filename}. Please download videos to ${VIDEOS_DIR}`
    });
  }

  // Serve local file with range request support for video streaming
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/quicktime',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/quicktime',
      'Accept-Ranges': 'bytes',
    };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Video API server running on http://localhost:${PORT}`);
  console.log(`📹 Videos directory: ${VIDEOS_DIR}`);
  console.log(`🔐 API Key authentication: ENABLED`);
  console.log(`\n📋 Available endpoints:`);
  console.log(`   GET /health - Public health check (no auth)`);
  console.log(`   GET /health/status - Protected status (requires API key)`);
  console.log(`   GET /videos - List all videos (requires API key)`);
  console.log(`   GET /videos/:filename - Stream video (requires API key)`);
  console.log(`\n🔑 Authentication:`);
  console.log(`   Include API key in header: x-api-key: ${API_KEY.substring(0, 10)}...`);
  console.log(`   Or as query param: ?apiKey=${API_KEY.substring(0, 10)}...`);
  console.log(`   Set API_KEY environment variable to change the key\n`);
  
  // Validate videos on startup
  validateVideos();
});

