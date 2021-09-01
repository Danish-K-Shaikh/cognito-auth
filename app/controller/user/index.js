const express = require('express');
const router = express.Router();

function greetUser(req, res) {
  res.json({ msg: 'Hello ' + req.user.username });
}

router.get('/greet', greetUser);

module.exports = router;
