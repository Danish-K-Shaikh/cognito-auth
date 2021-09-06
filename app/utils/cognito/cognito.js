const { promisifyCallback } = require('../promiseUtil');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const AWS = require('aws-sdk');
const {
  attributes: attr,
  setCognitoAttributeList,
  initAWS,
  getCognitoUser,
  getUserPool,
  getAuthDetails,
  onLoginSuccess,
  onLoginFailure,
  adminGetUser,
} = require('./helper');
const { param } = require('../../controller/app');

// AWS.config.region = AWS_COGNITO_REGION; // Region
// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//   IdentityPoolId: COGNITO_IDENTITY_POOL_ID,
// });

async function createCognitoUser(user) {
  const { phone_number, email, password, name } = user;

  initAWS();
  var attributeList = [attr('name', name), attr('email', email), attr('phone_number', phone_number)];
  setCognitoAttributeList(attributeList);

  const username = email || phone_number;
  const userPool = getUserPool();
  try {
    const result = await promisifyCallback(userPool.signUp.bind(userPool), username, password, attributeList, null);
    const cognitoUser = result.user;
    return { user: cognitoUser };
  } catch (error) {
    throw error;
  }
}

async function verifySignupCode(userId, code) {
  try {
    const user = getCognitoUser(userId);
    return await promisifyCallback(user.confirmRegistration.bind(user), code, false);
  } catch (err) {
    let errObj = {};
    switch (err.code) {
      case 'CodeMismatchException':
        errObj = { msg: 'Invalid veirfication code', status: 422, invalidVerificationCode: true };
        break;
      case 'ExpiredCodeException':
        errObj = { msg: 'Verification code expired, please request a code again.', status: 401, expiredVerificationCode: true };
        break;
    }
    throw errObj;
  }
}

async function resendVerificationCode(userId) {
  try {
    const user = getCognitoUser(userId);

    // let data = await promisifyCallback(user.resendConfirmationCode.bind(user));
    const userData = await adminGetUser(userId);
    if (userData.UserStatus === 'CONFIRMED') throw { code: 'UserAlreadyVerified' };
    const result = await promisifyCallback(user.resendConfirmationCode.bind(user));

    return result;
  } catch (err) {
    let errObj = {};
    switch (err.code) {
      case 'UserNotFoundException':
        errObj = { msg: 'No such user found', status: 404, userNotFoundError: true };
        break;
      case 'UserAlreadyVerified':
        errObj = { msg: 'User already verified', status: 422, UserAlreadyVerified: true };
    }
    throw errObj;
  }
}

function SignIn(userId, password) {
  const user = getCognitoUser(userId);
  return new Promise((resolve, reject) => {
    user.authenticateUser(getAuthDetails(userId, password), {
      onSuccess: onLoginSuccess(resolve),
      onFailure: onLoginFailure(reject),
    });
  });
}

module.exports = { createCognitoUser, verifySignupCode, SignIn, resendVerificationCode };
