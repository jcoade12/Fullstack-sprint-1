const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const port = 3000;

const usersPath = path.join(__dirname, 'users');

// Function to generate a token
const generateToken = (input) => {
  return crypto.createHash('md5').update(input).digest('hex');
};

// Endpoint to create token for a given username
app.get('/create-token/:username', (req, res) => {
  const { username } = req.params;
  const token = generateToken(username);
  const userFilePath = path.join(usersPath, `${username}.json`);
  
  const userData = { username, token };
  
  fs.writeFileSync(userFilePath, JSON.stringify(userData, null, 2));
  res.send(`Token for ${username}: ${token}`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
