const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

let events = []; // This will store events in memory

app.get('/events', (req, res) => {
  res.json(events);
});

app.post('/events', (req, res) => {
  const event = req.body;
  events.push({ id: events.length + 1, ...event });
  res.status(201).json({ message: 'Event added!', event });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});