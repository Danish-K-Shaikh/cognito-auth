var Models = require('../../models');

async function getUsers() {
  return userModel;
}

async function findUser(userId) {
  const user = await Models.User.findOne({ $or: [{ email: userId }, { phone_number: userId }] });
  if (!user) throw { status: 404, msg: 'User Not Found' };
  return user;
}

async function validateUserPassword({ userId, password }) {
  if (!userId) throw { status: 422, msg: 'Email/Phone Number is required.' };
  let user = await findUser(userId);
  await user.comparePassword(password);
  user = user.toJSON();
  delete user.password;
  return user;
}

async function signupUser(params) {
  const { phone_number, email, password, name } = params;
  let errorMsg = '';
  if (!(phone_number && phone_number.trim())) errorMsg += 'Phone No, ';
  if (!(email && email.trim())) errorMsg += 'Email, ';
  if (!(password && password.trim())) errorMsg += 'Password, ';
  if (!(name && name.trim())) errorMsg += 'Name, ';
  if (errorMsg) throw { status: 422, msg: errorMsg.substring(0, errorMsg.length - 2) + ' is required.' };
  const payload = { phone_number, email, password, name };
  return await new Models.User(payload).save();
}

module.exports = {
  getUsers,
  findUser,
  validateUserPassword,
  signupUser,
};
