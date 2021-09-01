var userModel = require('../../models/user');

async function getUsers() {
  return userModel;
}

async function findUserByUsername(username) {
  return userModel.find(x => x.username.toLowerCase() === username.toLowerCase());
}

async function validateUserPassword(username, password) {
  const user = await findUserByUsername(username);
  if (!user) throw { status: 404, msg: 'User not found' };
  if (user.password !== password) throw { status: 401, msg: 'Password not match' };
  return user;
}

module.exports = {
  getUsers,
  findUserByUsername,
  validateUserPassword,
};
