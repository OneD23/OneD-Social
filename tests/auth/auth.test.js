import request from 'supertest';
import { createApp } from '../../src/app.js';

describe('auth routes', () => {
  it('exposes health for test harness', async () => {
    const app = createApp();
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.service).toBe('oned-social-api');
  });
});
