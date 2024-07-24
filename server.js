const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 4000;

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // replace with your MySQL username
  password: 'admin', // replace with your MySQL password
  database: 'task_management'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

app.get('/api/posts', (req, res) => {
  console.log('GET /api/posts request received');
  db.query('SELECT * FROM posts', (err, results) => {
    if (err) {
      console.error('Error fetching posts:', err);
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
});

app.post('/api/posts', (req, res) => {
  console.log('POST /api/posts request received');
  const { title, content } = req.body;
  console.log('Received data:', { title, content });

  if (!title || !content) {
    console.error('Invalid post data:', { title, content });
    return res.status(400).send('Invalid post data');
  }

  const id = uuidv4();
  const query = 'INSERT INTO posts (id, title, content) VALUES (?, ?, ?)';

  db.query(query, [id, title, content], (err, result) => {
    if (err) {
      console.error('Error adding post:', err);
      return res.status(500).send(err);
    }
    console.log('Post added successfully:', { id, title, content });
    res.status(201).json({ id, title, content });
  });
});

app.delete('/api/posts/:id', (req, res) => {
  console.log('DELETE /api/posts request received');
  const { id } = req.params;
  const query = 'DELETE FROM posts WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting post:', err);
      return res.status(500).send(err);
    }
    console.log('Post deleted successfully:', id);
    res.status(200).json({ message: 'Post deleted' });
  });
});

app.put('/api/posts/:id', (req, res) => {
  console.log('PUT /api/posts request received');
  const { id } = req.params;
  const { title, content } = req.body;
  console.log('Received data for update:', { id, title, content });

  if (!title || !content) {
    console.error('Invalid post data for update:', { title, content });
    return res.status(400).send('Invalid post data');
  }

  const query = 'UPDATE posts SET title = ?, content = ? WHERE id = ?';

  db.query(query, [title, content, id], (err, result) => {
    if (err) {
      console.error('Error updating post:', err);
      return res.status(500).send(err);
    }
    console.log('Post updated successfully:', { id, title, content });
    res.status(200).json({ id, title, content });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
