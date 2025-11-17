const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes (needed for React Native)
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Serve videos from the assets/videos directory
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
  }
  
  if (extraVideos.length > 0) {
    console.log(`   ℹ️  Extra videos (not in exercises.json): ${extraVideos.join(', ')}`);
  }
  
  if (missingVideos.length === 0 && requiredVideos.length > 0) {
    console.log('   ✅ All required videos are available!\n');
  }
  
  return { availableVideos, missingVideos, extraVideos };
}

// Health check endpoint
app.get('/health', (req, res) => {
  const validation = validateVideos();
  res.json({ 
    status: 'ok', 
    message: 'Video API server is running',
    videos: {
      total: validation.availableVideos.length,
      required: requiredVideos.length,
      missing: validation.missingVideos,
      available: validation.availableVideos
    }
  });
});

// List all available videos with metadata
app.get('/videos', (req, res) => {
  try {
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
    res.status(500).json({ error: 'Failed to list videos' });
  }
});

// Serve individual video files
app.get('/videos/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(VIDEOS_DIR, filename);

  // Security: prevent directory traversal
  if (!path.resolve(filePath).startsWith(path.resolve(VIDEOS_DIR))) {
    return res.status(403).json({ error: 'Access denied' });
  }

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Video not found', filename });
  }

  // Get file stats
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  // Support range requests for video streaming (important for large files)
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
      'Content-Type': 'video/quicktime', // .mov files
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/quicktime', // .mov files
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
  console.log(`\n📋 Available endpoints:`);
  console.log(`   GET http://localhost:${PORT}/health - Health check`);
  console.log(`   GET http://localhost:${PORT}/videos - List all videos`);
  console.log(`   GET http://localhost:${PORT}/videos/:filename - Stream video\n`);
  
  // Validate videos on startup
  validateVideos();
});

