const Mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { promisifyCallback } = require('../../utils/promiseUtil');

const Schema = Mongoose.Schema;

const SALT_WORK_FACTOR = Number(process.env.SALT_WORK_FACTOR);

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    index: true,
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    trim: true,
  },
  phone_number: {
    type: String,
    trim: true,
    unique: true,
    index: true,
  },
});

// async function preSaveHasPassword(next) {
//   var user = this;
//   // only hash the password if it has been modified (or is new)
//   if (!user.isModified('password')) return next();

//   // generate a salt
//   try {
//     const salt = await promisifyCallback(bcrypt.genSalt, SALT_WORK_FACTOR);
//     const hash = await promisifyCallback(bcrypt.hash, user.password, salt);

//     user.password = hash;

//     next();
//   } catch (err) {
//     next(err);
//   }
// }

// function comparePassword(candidatePassword) {
//   return promisifyCallback(bcrypt.compare, candidatePassword, this.password);
// }

// userSchema.pre('save', preSaveHasPassword);

// userSchema.methods.comparePassword = comparePassword;

module.exports = userSchema;
