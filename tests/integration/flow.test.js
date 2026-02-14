const request = require('supertest');
const app = require('../../src/index');
const { getEvents, resetStore } = require('../../src/eventsStore');

jest.setTimeout(60000);

beforeEach(() => {
  resetStore();
});

test('end-to-end flow with deduplication', async () => {
  const payload = {
    userId: 'user-123',
    eventType: 'LOGIN',
    payload: { ip: '127.0.0.1' }
  };

  const res1 = await request(app).post('/events/generate').send(payload);
  const res2 = await request(app).post('/events/generate').send(payload);

  expect(res1.statusCode).toBe(201);
  expect(res2.statusCode).toBe(201);

  await new Promise((r) => setTimeout(r, 5000));

  const resProcessed = await request(app).get('/events/processed');

  expect(resProcessed.statusCode).toBe(200);
  const events = resProcessed.body;
  expect(events.length).toBe(2);
  const ids = new Set(events.map((e) => e.eventId));
  expect(ids.size).toBe(2);
});
