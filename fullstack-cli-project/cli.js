#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

const appConfigPath = path.join(__dirname, 'config/app-config.json');
const usersPath = path.join(__dirname, 'users');
const logsPath = path.join(__dirname, 'logs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to initialize application
const initApp = () => {
  if (!fs.existsSync(usersPath)) fs.mkdirSync(usersPath);
  if (!fs.existsSync(logsPath)) fs.mkdirSync(logsPath);
  const defaultConfig = { adminEmail: 'admin@example.com', adminPhone: '1234567890' };
  fs.writeFileSync(appConfigPath, JSON.stringify(defaultConfig, null, 2));
  console.log('Application initialized.');
};

// Function to show configuration
const showConfig = () => {
  if (fs.existsSync(appConfigPath)) {
    const config = JSON.parse(fs.readFileSync(appConfigPath));
    console.log(config);
  } else {
    console.log('Configuration file not found.');
  }
};

// Function to set configuration
const setConfig = (key, value) => {
  if (fs.existsSync(appConfigPath)) {
    const config = JSON.parse(fs.readFileSync(appConfigPath));
    config[key] = value;
    fs.writeFileSync(appConfigPath, JSON.stringify(config, null, 2));
    console.log('Configuration updated.');
  } else {
    console.log('Configuration file not found.');
  }
};

// Function to reset configuration
const resetConfig = () => {
  const defaultConfig = { adminEmail: 'admin@example.com', adminPhone: '1234567890' };
  fs.writeFileSync(appConfigPath, JSON.stringify(defaultConfig, null, 2));
  console.log('Configuration reset.');
};

// Function to generate token
const generateToken = (input) => {
  return crypto.createHash('md5').update(input).digest('hex');
};

// Function to create token for user
const createToken = (username) => {
  const token = generateToken(username);
  const userFilePath = path.join(usersPath, `${username}.json`);
  const userData = { username, token };
  fs.writeFileSync(userFilePath, JSON.stringify(userData, null, 2));
  console.log(`Token for ${username}: ${token}`);
};

// Function to update user data
const updateUser = (username, key, value) => {
  const userFilePath = path.join(usersPath, `${username}.json`);
  if (fs.existsSync(userFilePath)) {
    const userData = JSON.parse(fs.readFileSync(userFilePath));
    userData[key] = value;
    fs.writeFileSync(userFilePath, JSON.stringify(userData, null, 2));
    console.log(`${key} updated for ${username}.`);
  } else {
    console.log('User not found.');
  }
};

// Function to search user data
const searchUser = (key, value) => {
  const files = fs.readdirSync(usersPath);
  files.forEach(file => {
    const userData = JSON.parse(fs.readFileSync(path.join(usersPath, file)));
    if (userData[key] === value) {
      console.log(userData);
    }
  });
};

// CLI Commands
const command = process.argv[2];
const option1 = process.argv[3];
const option2 = process.argv[4];
const option3 = process.argv[5];

switch (command) {
  case 'init':
    initApp();
    break;
  case 'config':
    if (option1 === '--show') showConfig();
    if (option1 === '--set') setConfig(option2, option3);
    if (option1 === '--reset') resetConfig();
    break;
  case 'token':
    if (option1 === '--new') createToken(option2);
    if (option1 === '--upd' && option2 === 'e') updateUser(option3, 'email', option4);
    if (option1 === '--upd' && option2 === 'p') updateUser(option3, 'phone', option4);
    if (option1 === '--search' && option2 === 'u') searchUser('username', option3);
    if (option1 === '--search' && option2 === 'e') searchUser('email', option3);
    if (option1 === '--search' && option2 === 'p') searchUser('phone', option3);
    break;
  default:
    console.log('Invalid command');
}

rl.close();
