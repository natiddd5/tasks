const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 4000;

app.use(bodyParser.json());

const corsOptions = {
  origin: 'http://localhost:4200', // Replace with your Angular app's URL if different
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'task_management'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

// User registration
app.post('/api/user/register', async (req, res) => {
  console.log('Register request received');
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    db.query('INSERT INTO users (id, email, password) VALUES (?, ?, ?)', [id, email, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.error('Email already exists:', email);
          return res.status(409).json({ message: 'Email already exists' });
        } else {
          console.error('Error registering user:', err);
          return res.status(500).send(err);
        }
      }
      res.status(201).json({ message: 'User registered successfully', userId: id });
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    return res.status(500).send(error);
  }
});

// User login
app.post('/api/user/login', (req, res) => {
  console.log('Login request received');
  const { email, password } = req.body;
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).send(err);
    }
    if (results.length === 0 || !(await bcrypt.compare(password, results[0].password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.status(200).json({ message: 'Login successful', userId: results[0].id });
  });
});

// Get posts for a specific user
app.get('/api/posts/:userId', (req, res) => {
  const { userId } = req.params;
  console.log(`GET /api/posts/${userId} request received`);
  console.log(`user id is : ${userId}`);
  db.query('SELECT * FROM posts WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error fetching posts:', err);
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
});

app.post('/api/posts', (req, res) => {
  console.log('POST /api/posts request received');
  const { title, content, userId } = req.body;
  if (!title || !content || !userId) {
    return res.status(400).send('Invalid post data');
  }
  const id = uuidv4();
  const query = 'INSERT INTO posts (id, title, content, user_id) VALUES (?, ?, ?, ?)';
  db.query(query, [id, title, content, userId], (err, result) => {
    if (err) {
      console.error('Error adding post:', err);
      return res.status(500).send(err);
    }
    res.status(201).json({ id, title, content, userId });
  });
});

app.delete('/api/posts/:id', (req, res) => {
  console.log(`DELETE /api/posts/${req.params.id} request received`);
  const { id } = req.params;
  const query = 'DELETE FROM posts WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting post:', err);
      return res.status(500).send(err);
    }
    res.status(200).json({ message: 'Post deleted' });
  });
});

app.put('/api/posts/:id', (req, res) => {
  console.log(`PUT /api/posts/${req.params.id} request received`);
  const { id } = req.params;
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).send('Invalid post data');
  }
  const query = 'UPDATE posts SET title = ?, content = ? WHERE id = ?';
  db.query(query, [title, content, id], (err, result) => {
    if (err) {
      console.error('Error updating post:', err);
      return res.status(500).send(err);
    }
    res.status(200).json({ id, title, content });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
