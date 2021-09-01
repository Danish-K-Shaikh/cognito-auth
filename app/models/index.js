const Mongoose = require('mongoose');

const userSchema = require('./user');
const postSchema = require('./post');

module.exports = {
  users: Mongoose.model('User', userSchema),
  posts: Mongoose.model('Post', postSchema),
};
