const https = require('https');
const crypto = require('crypto');

const API_URL = 'https://edupath-ai-backend-blio.onrender.com';
const email = `testuser_${crypto.randomBytes(4).toString('hex')}@example.com`;
const name = 'Test User ' + crypto.randomBytes(2).toString('hex');

function makeRequest(url, options, bodyData) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, data }));
    });
    req.on('error', reject);
    if (bodyData) req.write(bodyData);
    req.end();
  });
}

(async () => {
  try {
    const signupData = JSON.stringify({ email, name, password: 'password123', role: 'STUDENT' });
    await makeRequest(API_URL + '/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(signupData) } }, signupData);

    const loginData = JSON.stringify({ name, password: 'password123' });
    const loginRes = await makeRequest(API_URL + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginData) } }, loginData);
    
    const parsed = JSON.parse(loginRes.data);
    const token = parsed.accessToken;
    const userId = parsed.userId;
    
    console.log('Token length:', token.length);
    const parts = token.split('.');
    if(parts.length === 3) {
      console.log('Token header:', Buffer.from(parts[0], 'base64').toString());
      console.log('Token payload:', Buffer.from(parts[1], 'base64').toString());
    } else {
      console.log('Invalid token format');
    }
    
  } catch (err) {
    console.error(err);
  }
})();
