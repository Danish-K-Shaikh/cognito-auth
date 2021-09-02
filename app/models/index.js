const Mongoose = require('mongoose');

const userSchema = require('./user');
const postSchema = require('./post');

module.exports = {
  User: Mongoose.model('User', userSchema),
  Post: Mongoose.model('Post', postSchema),
};
