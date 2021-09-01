require('dotenv').config();

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

const controller = require('./app/controller/index');

app.use(express.json());
app.use('/', controller);

app.listen(PORT, function () {
  console.log('Server started at ', PORT);
});
