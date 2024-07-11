import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

export let errorRate = new Rate('errors');

export let options = {
  stages: [
    { duration: '30s', target: 10 }, // 10 users for 30 seconds
    { duration: '1m', target: 20 }, // 20 users for 1 minute
    { duration: '30s', target: 0 }, // Ramp down to 0 users
  ],
  thresholds: {
    errors: ['rate<0.1'], // <10% errors
    http_req_duration: ['p(95)<500'], // 95% requests must complete below 500ms
  },
};

// Function to get the JWT token
function getToken() {
  const loginUrl = 'http://localhost:3000/api/v1/auth/login';
  const payload = JSON.stringify({
    username: 'user2@example.com',
    password: 'password2',
  });
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(loginUrl, payload, params);
  const responseData = res.json();
  return responseData.token;
}

export default function () {
  const token = getToken(); // Move this inside the default function

  const categoryId = 'MLA5725'; // Reemplaza esto con un id de categoría válido
  const criteria = {
    limit: 50,
    offset: 0,
  };

  const url = `http://localhost:3000/api/v1/product/${categoryId}?limit=${criteria.limit}&offset=${criteria.offset}`;
  const params = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = http.get(url, params);

  const result = check(res, {
    'is status 200': (r) => r.status === 200,
    'response time is < 500ms': (r) => r.timings.duration < 500,
  });

  errorRate.add(!result);
  sleep(1);
}
