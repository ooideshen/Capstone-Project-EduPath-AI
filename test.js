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
    console.log(`Signing up ${email}...`);
    const signupData = JSON.stringify({ email, name, password: 'password123', role: 'STUDENT' });
    const signupRes = await makeRequest(API_URL + '/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(signupData) } }, signupData);
    console.log('Signup response:', signupRes.status);

    console.log('Logging in...');
    const loginData = JSON.stringify({ name, password: 'password123' });
    const loginRes = await makeRequest(API_URL + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginData) } }, loginData);
    console.log('Login response:', loginRes.status);
    
    if (loginRes.status !== 200) return console.error('Login failed:', loginRes.data);
    
    const parsed = JSON.parse(loginRes.data);
    const token = parsed.accessToken;
    const userId = parsed.userId;
    
    console.log('Testing protected endpoint /api/StudentProfile/user/' + userId + '...');
    const protectRes = await makeRequest(API_URL + '/api/StudentProfile/user/' + userId, { headers: { 'Authorization': 'Bearer ' + token } });
    console.log('Protected endpoint response:', protectRes.status);

    console.log('Testing OPTIONS request...');
    const optionsRes = await makeRequest(API_URL + '/api/StudentProfile/user/' + userId, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://capstone-project-edu-path-ai.vercel.app',
        'Access-Control-Request-Method': 'GET'
      }
    });
    console.log('OPTIONS response:', optionsRes.status);
    console.log('CORS Headers:', optionsRes.headers['access-control-allow-origin']);
    
  } catch (err) {
    console.error(err);
  }
})();
