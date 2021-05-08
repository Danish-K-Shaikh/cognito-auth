const express = require('express');
const app = express();

const PORT = process.env.PORT || 3003;

app.get('/', function (req, res) {
  res.status(200).json({ msg: 'Welcome to bug predators' });
});

app.listen(PORT, function (params) {
  console.log(`Welcome to bug predators. \nServer started at http://localhost:${PORT}/`);
});
