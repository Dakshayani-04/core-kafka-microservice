const { Kafka, logLevel } = require('kafkajs');
const { storeEvent, hasProcessed } = require('./eventsStore');

const broker = process.env.KAFKA_BROKER || 'kafka:9092';
const topic = process.env.KAFKA_TOPIC_USER_ACTIVITY || 'user-activity-events';
const consumerGroupId = process.env.KAFKA_CONSUMER_GROUP_ID || 'user-activity-consumer-group';

const kafka = new Kafka({
  clientId: 'core-kafka-microservice',
  brokers: [broker],
  logLevel: logLevel.INFO
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: consumerGroupId });

async function initProducer() {
  await producer.connect();
}

async function publishUserEvent(event) {
  let retries = 3;
  const payload = {
    topic,
    messages: [{ key: event.userId, value: JSON.stringify(event) }]
  };

  while (retries > 0) {
    try {
      await producer.send(payload);
      return;
    } catch (err) {
      console.error('Kafka produce error:', err.message);
      retries -= 1;
      if (retries === 0) {
        throw err;
      }
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
}

async function initConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const value = message.value.toString();
        const event = JSON.parse(value);
        const { eventId, userId, eventType } = event;

        if (hasProcessed(eventId)) {
          console.log('Duplicate event skipped:', eventId);
          return;
        }

        console.log(`Processed event - id: ${eventId}, userId: ${userId}, type: ${eventType}`);

        storeEvent({
          eventId,
          userId,
          eventType,
          timestamp: event.timestamp,
          payload: event.payload
        });
      } catch (err) {
        console.error('Kafka consume error (malformed message):', err.message);
      }
    }
  });
}

module.exports = {
  initProducer,
  publishUserEvent,
  initConsumer
};
