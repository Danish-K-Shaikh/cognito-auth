const express = require('express');
const app = express();

const PORT = process.env.PORT || 3003;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.status(200).json({ msg: 'Welcome to bug predators' });
});

app.post('/', function (req, res) {
  res.status(200).json({ msg: 'Welcome to bug predators', payload: req.body });
});

app.listen(PORT, function (params) {
  console.log(`Welcome to bug predators. \nServer started at http://localhost:${PORT}/`);
});
