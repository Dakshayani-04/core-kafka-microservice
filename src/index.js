const express = require('express');
const bodyParser = require('body-parser');
const eventsRouter = require('./routes/events');
const { initProducer, initConsumer } = require('./kafka');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/events', eventsRouter);

async function start() {
  try {
    await initProducer();
    await initConsumer();

    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start app:', err.message);
    process.exit(1);
  }
}

start();

module.exports = app;
