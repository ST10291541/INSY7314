/* eslint-env jest */
const request = require('supertest');
const app = require('../app');

describe('Health check', () => {
  it('should return status 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Server is healthy'); // <-- updated
  });
});
