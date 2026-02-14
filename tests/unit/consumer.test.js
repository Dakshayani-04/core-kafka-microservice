const { storeEvent, hasProcessed, resetStore, getEvents } = require('../../src/eventsStore');

beforeEach(() => {
  resetStore();
});

test('idempotency prevents duplicates', () => {
  const event = {
    eventId: 'e1',
    userId: 'u1',
    eventType: 'LOGIN',
    timestamp: new Date().toISOString(),
    payload: {}
  };
  const first = storeEvent(event);
  const second = storeEvent(event);

  expect(first).toBe(true);
  expect(second).toBe(false);
  expect(hasProcessed('e1')).toBe(true);
  expect(getEvents().length).toBe(1);
});
