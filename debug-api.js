// Quick debug script to test API response
const fetch = require('node-fetch');

async function testAPI() {
  try {
    // You'll need to replace this with a real access token from localStorage
    const accessToken = "YOUR_ACCESS_TOKEN_HERE";
    
    const response = await fetch('http://localhost:8000/api/users/profile/', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('API Response:', JSON.stringify(data, null, 2));
    } else {
      console.log('API Error:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Network Error:', error);
  }
}

console.log('This is a debug script. Replace YOUR_ACCESS_TOKEN_HERE with real token and run with node debug-api.js');
