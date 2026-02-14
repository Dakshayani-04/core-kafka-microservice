const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { publishUserEvent } = require('../kafka');
const { getEvents } = require('../eventsStore');

const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const { userId, eventType, payload } = req.body || {};

    if (!userId || !eventType) {
      return res.status(400).json({ error: 'userId and eventType are required' });
    }

    const event = {
      eventId: uuidv4(),
      userId,
      eventType,
      timestamp: new Date().toISOString(),
      payload: payload || {}
    };

    await publishUserEvent(event);

    return res.status(201).json({ eventId: event.eventId });
  } catch (err) {
    console.error('Error in POST /events/generate:', err.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/processed', (req, res) => {
  const events = getEvents().map((e) => ({
    eventId: e.eventId,
    userId: e.userId,
    eventType: e.eventType,
    timestamp: e.timestamp,
    payload: e.payload
  }));
  res.json(events);
});

module.exports = router;
