const https = require('http'); // local is http
const crypto = require('crypto');

const API_URL = 'http://localhost:8080';
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
    
    if (loginRes.status !== 200) {
      console.log('Login failed', loginRes.status, loginRes.data);
      return;
    }

    const parsed = JSON.parse(loginRes.data);
    const token = parsed.token;
    const userId = parsed.userId;
    
    console.log('Testing protected endpoint /api/StudentProfile/user/' + userId + '...');
    const protectRes = await makeRequest(API_URL + '/api/StudentProfile/user/' + userId, { headers: { 'Authorization': 'Bearer ' + token } });
    console.log('Protected endpoint response:', protectRes.status);
    
  } catch (err) {
    console.error(err);
  }
})();
