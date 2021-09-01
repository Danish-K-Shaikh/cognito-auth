const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  _userId: {
    type: Mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = postSchema;
