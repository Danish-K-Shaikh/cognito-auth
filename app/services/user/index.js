var Models = require('../../models');
var cognitoUtil = require('../../utils/cognito/cognito');

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
  await cognitoUtil.SignIn(userId, password);
  let user = await findUser(userId);
  user = user.toJSON();
  return user;
}

async function signupUser(params) {
  try {
    const { phone_number = '', email = '', password, name } = params;
    let errorMsg = '';
    // if (!(phone_number && phone_number.trim())) errorMsg += 'Phone No, ';
    // if (!(email && email.trim())) errorMsg += 'Email, ';
    if (!email.trim() && !phone_number.trim()) errorMsg += 'Phone No/Email, ';
    if (!(password && password.trim())) errorMsg += 'Password, ';
    if (!(name && name.trim())) errorMsg += 'Name, ';
    if (errorMsg) throw { status: 422, msg: errorMsg.substring(0, errorMsg.length - 2) + ' is required.' };
    const payload = { phone_number, email, password, name };
    await cognitoUtil.createCognitoUser(payload);
    delete payload.password;
    return await new Models.User(payload).save();
  } catch (err) {
    let error = {};
    switch (err.code) {
      case 'InvalidPasswordException':
        error = { msg: 'Password did not conform with policy', passwordPolicyError: true, status: 422 };
        break;
      case 'UsernameExistsException':
        error = { msg: 'User already exists', userExistsError: true, status: 422 };
        break;
    }
    throw error;
  }
}

async function verifyUserSignup(params) {
  const { userId, code } = params;
  return await cognitoUtil.verifySignupCode(userId, code);
}

async function resendVerification(userId) {
  if (!userId) throw { status: 422, msg: 'Email/Phone Number is required.' };
  let response = await cognitoUtil.resendVerificationCode(userId);
  return response;
}

module.exports = {
  getUsers,
  findUser,
  validateUserPassword,
  signupUser,
  verifyUserSignup,
  resendVerification,
};
