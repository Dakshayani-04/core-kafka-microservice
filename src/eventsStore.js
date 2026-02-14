// In-memory store for processed events and ids (idempotency)
const processedEvents = [];
const processedIds = new Set();

function hasProcessed(eventId) {
  return processedIds.has(eventId);
}

function storeEvent(event) {
  if (processedIds.has(event.eventId)) return false;
  processedIds.add(event.eventId);
  processedEvents.push(event);
  return true;
}

function getEvents() {
  return processedEvents;
}

function resetStore() {
  processedEvents.length = 0;
  processedIds.clear();
}

module.exports = { hasProcessed, storeEvent, getEvents, resetStore };
