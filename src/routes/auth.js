const express = require('express');
const bcrypt = require('bcryptjs');
const { users, findUserByEmail, nextUserId } = require('../db');
const { signToken } = require('../auth');

const router = express.Router();

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.post('/register', (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !isValidEmail(email) || typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({
      error: 'ValidationError',
      message: 'Name, a valid email, and a password of at least 8 characters are required.'
    });
  }

  if (findUserByEmail(email)) {
    return res.status(409).json({
      error: 'Conflict',
      message: 'A user with this email already exists.'
    });
  }

  const user = {
    id: nextUserId(),
    name: String(name).trim(),
    email: String(email).toLowerCase(),
    passwordHash: bcrypt.hashSync(password, 10)
  };

  users.push(user);

  return res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
    token: signToken(user)
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      error: 'ValidationError',
      message: 'Email and password are required.'
    });
  }

  const user = findUserByEmail(email);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid email or password.'
    });
  }

  return res.status(200).json({
    id: user.id,
    name: user.name,
    email: user.email,
    token: signToken(user)
  });
});

module.exports = router;
