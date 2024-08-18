const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  // Registration logic (e.g., validate input, hash password, save user)
  res.status(201).json({ message: 'User registered successfully' });
});

module.exports = router;
