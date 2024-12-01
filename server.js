const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware for parsing JSON data
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory store for votes (simple prototype)
const votes = {};  // Will store votes like { "user1": "Bitware Prince willz ft Vic tumz", ... }
const contestants = {
  "Bitware Prince willz ft Vic tumz": 0,
  "Budget Vic tumz ft torino": 0,
  "Nzikakane Doro weiyz ft prince willz": 0,
  "Wandeka tall man ft prince willz": 0,
};

// Route to get current vote count for a contestant
app.get('/vote-count/:artist', (req, res) => {
  const artist = req.params.artist;
  if (!contestants[artist]) {
    return res.status(404).json({ error: 'Artist not found' });
  }
  res.json({ artist, votes: contestants[artist] });
});

// Route to vote for a contestant
app.post('/vote', (req, res) => {
  const { userId, artist } = req.body;
  
  if (!userId || !artist) {
    return res.status(400).json({ error: 'Missing userId or artist' });
  }

  // Check if the user has already voted for this artist
  if (votes[userId] === artist) {
    return res.status(400).json({ error: 'You have already voted for this artist' });
  }

  // Record the vote
  if (contestants[artist] !== undefined) {
    contestants[artist] += 1;
    votes[userId] = artist;  // Track that the user has voted for this artist
    res.json({ success: true, message: 'Vote recorded' });
  } else {
    res.status(404).json({ error: 'Artist not found' });
  }
});

// Serve the frontend (your HTML, CSS, JS files)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});