const express = require('express');
const router = express.Router();

// POST /api/admin/login  { password }
router.post('/login', (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Wrong password' });
  }

  // not doing real JWT stuff here, the password itself works as the token.
  // good enough for this project, would need to be replaced for a real app.
  res.json({ token: password });
});

module.exports = router;
