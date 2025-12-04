#!/usr/bin/env node

/**
 * Script to check if video server is running and videos are accessible
 * Run this to diagnose video loading issues
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const SERVER_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';
const VIDEOS_DIR = path.join(__dirname, 'assets', 'videos');

console.log('🔍 Checking video setup...\n');

// Check if videos directory exists
console.log('1. Checking videos directory...');
if (!fs.existsSync(VIDEOS_DIR)) {
  console.log('   ❌ Videos directory does not exist:', VIDEOS_DIR);
  console.log('   💡 Create the directory and add video files');
  process.exit(1);
} else {
  console.log('   ✅ Videos directory exists:', VIDEOS_DIR);
}

// List available videos
const videoFiles = fs.readdirSync(VIDEOS_DIR).filter(file => 
  file.endsWith('.mov') || file.endsWith('.mp4') || file.endsWith('.m4v')
);

console.log(`\n2. Found ${videoFiles.length} video file(s):`);
if (videoFiles.length === 0) {
  console.log('   ⚠️  No video files found!');
  console.log('   💡 Download videos from: https://drive.google.com/drive/folders/1MQ909vS36aygZ7UnjantJyNxcinw3isq?usp=sharing');
} else {
  videoFiles.forEach(file => {
    const filePath = path.join(VIDEOS_DIR, file);
    const stats = fs.statSync(filePath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`   ✅ ${file} (${sizeMB} MB)`);
  });
}

// Check if server is running
console.log(`\n3. Checking if server is running at ${SERVER_URL}...`);
const testUrl = `${SERVER_URL}/health`;

http.get(testUrl, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('   ✅ Server is running!');
      try {
        const response = JSON.parse(data);
        console.log('   📋 Server response:', response.message);
      } catch (e) {
        // Not JSON, that's okay
      }
      
      // Test video endpoint
      if (videoFiles.length > 0) {
        const testVideo = videoFiles[0];
        const videoUrl = `${SERVER_URL}/videos/${encodeURIComponent(testVideo)}`;
        console.log(`\n4. Testing video endpoint with: ${testVideo}...`);
        
        http.get(videoUrl, (videoRes) => {
          if (videoRes.statusCode === 200 || videoRes.statusCode === 206) {
            console.log(`   ✅ Video endpoint is accessible! (Status: ${videoRes.statusCode})`);
            console.log(`   📹 Video URL: ${videoUrl}`);
            console.log('\n✅ All checks passed! Videos should load in the app.');
          } else {
            console.log(`   ❌ Video endpoint returned status: ${videoRes.statusCode}`);
            console.log('   💡 Check server logs for errors');
          }
        }).on('error', (err) => {
          console.log(`   ❌ Error accessing video: ${err.message}`);
          console.log('   💡 Make sure the server is running: npm run server');
        });
      } else {
        console.log('\n⚠️  No videos to test, but server is running.');
      }
    } else {
      console.log(`   ❌ Server returned status: ${res.statusCode}`);
    }
  });
}).on('error', (err) => {
  console.log('   ❌ Server is not running or not accessible');
  console.log('   💡 Start the server with: npm run server');
  console.log(`   💡 Error: ${err.message}`);
  console.log('\n📋 To start the server:');
  console.log('   1. Open a terminal');
  console.log('   2. Run: npm run server');
  console.log('   3. Or run both server and app: npm run dev');
});


