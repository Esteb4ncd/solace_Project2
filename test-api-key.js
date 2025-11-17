// Simple test script to verify OpenAI API key is working
// Run with: node test-api-key.js

// Load environment variables (Expo uses dotenv internally)
const fs = require('fs');
const path = require('path');

function loadEnvFile() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        process.env[key] = value;
      }
    });
  }
}

loadEnvFile();

async function testOpenAIKey() {
  const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

  console.log('\n🔑 Testing OpenAI API Key...\n');

  if (!OPENAI_API_KEY) {
    console.log('❌ ERROR: No API key found!');
    console.log('   Make sure you have EXPO_PUBLIC_OPENAI_API_KEY in your .env file\n');
    return;
  }

  if (OPENAI_API_KEY === 'your-api-key-here') {
    console.log('❌ ERROR: API key not set!');
    console.log('   Please replace "your-api-key-here" with your actual API key in .env file\n');
    return;
  }

  if (!OPENAI_API_KEY.startsWith('sk-')) {
    console.log('⚠️  WARNING: API key should start with "sk-"');
    console.log('   Your key starts with:', OPENAI_API_KEY.substring(0, 5) + '...\n');
  }

  console.log('✅ API Key found:', OPENAI_API_KEY.substring(0, 7) + '...' + OPENAI_API_KEY.slice(-4));
  console.log('   Testing API connection...\n');

  try {
    // Test with a simple API call (list models endpoint)
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
    });

    if (response.ok) {
      console.log('✅ SUCCESS: API key is valid and working!\n');
      console.log('   You can now use the voice transcription feature.\n');
    } else {
      const errorText = await response.text();
      console.log('❌ ERROR: API key test failed');
      console.log('   Status:', response.status);
      console.log('   Error:', errorText, '\n');
    }
  } catch (error) {
    console.log('❌ ERROR: Failed to connect to OpenAI API');
    console.log('   Error:', error.message, '\n');
  }
}

testOpenAIKey();

