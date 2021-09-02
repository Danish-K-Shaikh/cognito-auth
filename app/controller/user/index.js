const express = require('express');
const router = express.Router();

function greetUser(req, res) {
  res.json({ msg: 'Hello ' + req.user.name, data: req.user });
}

router.get('/greet', greetUser);

module.exports = router;
