# Core Event-Driven Microservice with Apache Kafka

This project implements a single microservice that acts as both an Apache Kafka producer and consumer for `user-activity-events`, demonstrating core event-driven architecture patterns.

## Features

- REST API: `POST /events/generate` to publish user events, `GET /events/processed` to query processed events.
- Kafka producer and consumer using KafkaJS, with idempotent consumer using in-memory store keyed by `eventId`.
- Docker Compose environment with Zookeeper, Kafka, and the app service, all with health checks.
- Unit and integration tests using Jest and Supertest.

## Setup

```bash
git clone https://github.com/Dakshayani-04/core-kafka-microservice.git
cd core-kafka-microservice
cp .env.example .env
docker-compose up --build
```

The app runs on `http://localhost:3000`.

## API

### POST /events/generate

```http
POST /events/generate
Content-Type: application/json

{
  "userId": "user-123",
  "eventType": "LOGIN",
  "payload": { "ip": "127.0.0.1" }
}
```

Response:

```json
{ "eventId": "UUID_STRING" }
```

### GET /events/processed

```http
GET /events/processed
```

Response:

```json
[
  {
    "eventId": "UUID_STRING",
    "userId": "user-123",
    "eventType": "LOGIN",
    "timestamp": "ISO_8601_STRING",
    "payload": {}
  }
]
```

## Tests

```bash
npm install
npm test
npm run test:unit
npm run test:integration
```

Integration tests expect the Kafka stack to be running via `docker-compose up`.
