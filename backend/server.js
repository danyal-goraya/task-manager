const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'taskuser',
  password: process.env.DB_PASSWORD || 'taskpass',
  database: process.env.DB_NAME || 'taskdb',
  port: 5432
});

async function initDb() {
  for (let i = 0; i < 20; i++) {
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        done BOOLEAN DEFAULT false
      )`);
      console.log('Database ready');
      return;
    } catch (e) {
      console.log('Waiting for database...');
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

app.get('/api/tasks', async (req, res) => {
  const r = await pool.query('SELECT * FROM tasks ORDER BY id');
  res.json(r.rows);
});

app.post('/api/tasks', async (req, res) => {
  const r = await pool.query('INSERT INTO tasks (title) VALUES ($1) RETURNING *', [req.body.title]);
  res.json(r.rows[0]);
});

app.put('/api/tasks/:id', async (req, res) => {
  const r = await pool.query('UPDATE tasks SET done = NOT done WHERE id = $1 RETURNING *', [req.params.id]);
  res.json(r.rows[0]);
});

app.delete('/api/tasks/:id', async (req, res) => {
  await pool.query('DELETE FROM tasks WHERE id = $1', [req.params.id]);
  res.json({ ok: true });
});

initDb();
app.listen(3000, () => console.log('Backend running on port 3000'));
