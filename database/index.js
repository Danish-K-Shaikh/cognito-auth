const mongoose = require('mongoose');

const mongouri = process.env.MONGO_CONNECTION;

const options = {
  useNewUrlParser: true,
  socketTimeoutMS: 4000000,
  keepAlive: true,
  connectTimeoutMS: 30000,
};
let counter = 1;
module.exports = function () {
  mongoose.connect(mongouri, options, function (err) {
    if (err) console.log('mongoose error on connect', mongouri, err);
  });

  mongoose.connection.on('connected', function (err, db) {
    console.log('Mongo DB Connected');
  });

  // If the connection throws an error
  mongoose.connection.on('error', async function (err) {
    console.log('Mongoose connection error: ', err);
    await mongoose.disconnect();
  });

  // When the connection is disconnected
  mongoose.connection.on('disconnected', function () {
    console.log('Mongoose connection disconnected');
    if (counter > 3) throw `Mongoose coundn't connect`;
    counter++;
    mongoose.connect(mongouri, options, function (err) {
      if (err) console.log('mongoose error');
    });
  });
};
