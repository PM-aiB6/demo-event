const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',           // Change as needed
  host: 'localhost',
  database: 'evenza',         // Change as needed
  password: 'siriusblack',    // Change as needed
  port: 5432,
});

// Get all events
app.get('/events', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add event
app.post('/events', async (req, res) => {
  const { name, startTime, endTime, nature, area } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO events (name, startTime, endTime, nature, area) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, startTime, endTime, nature, area]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update event
app.put('/events/:id', async (req, res) => {
  const { name, startTime, endTime, nature, area } = req.body;
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE events SET name=$1, startTime=$2, endTime=$3, nature=$4, area=$5 WHERE id=$6 RETURNING *',
      [name, startTime, endTime, nature, area, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete event
app.delete('/events/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM events WHERE id=$1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});