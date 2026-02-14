const { publishUserEvent } = require('../../src/kafka');

test('publishUserEvent throws when broker unreachable', async () => {
  const originalBroker = process.env.KAFKA_BROKER;
  process.env.KAFKA_BROKER = 'invalid:1234';
  
  try {
    await expect(
      publishUserEvent({
        eventId: '1',
        userId: 'u1',
        eventType: 'LOGIN',
        timestamp: new Date().toISOString(),
        payload: {}
      })
    ).rejects.toBeDefined();
  } finally {
    process.env.KAFKA_BROKER = originalBroker;
  }
});
