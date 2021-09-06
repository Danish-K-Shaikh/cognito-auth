const AWS = require('aws-sdk');
const jwt_decode = require('jwt-decode');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const { promisifyCallback } = require('../promiseUtil');

const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;
const COGINTO_USER_POOL_ID = process.env.COGINTO_USER_POOL_ID;
const AWS_COGNITO_REGION = process.env.COGNITO_REGION;
const COGNITO_IDENTITY_POOL_ID = process.env.COGNITO_IDENTITY_POOL_ID;

const poolData = {
  UserPoolId: COGINTO_USER_POOL_ID,
  ClientId: COGNITO_CLIENT_ID,
};

let cognitoAttributeList = [];

const attributes = (key, value) => {
  return {
    Name: key,
    Value: value,
  };
};

function setCognitoAttributeList(attributeList = []) {
  attributeList.forEach(element => {
    cognitoAttributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute(element));
  });
}

function getCognitoAttributeList() {
  return cognitoAttributeList;
}

function getCognitoUser(userId) {
  const userData = {
    Username: userId,
    Pool: getUserPool(),
  };
  return new AmazonCognitoIdentity.CognitoUser(userData);
}

function getUserPool() {
  return new AmazonCognitoIdentity.CognitoUserPool(poolData);
}

function getAuthDetails(email, password) {
  var authenticationData = {
    Username: email,
    Password: password,
  };
  return new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
}

function initAWS(region = AWS_COGNITO_REGION, identityPoolId = COGNITO_IDENTITY_POOL_ID) {
  AWS.config.region = region; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: identityPoolId,
  });
}

function decodeJWTToken(token) {
  const { email, exp, auth_time, token_use, sub } = jwt_decode(token.idToken);
  return { token, email, exp, uid: sub, auth_time, token_use };
}

function onLoginSuccess(resolve) {
  return async result => {
    const token = {
      accessToken: result.getAccessToken().getJwtToken(),
      idToken: result.getIdToken().getJwtToken(),
      refreshToken: result.getRefreshToken().getToken(),
    };
    resolve(decodeJWTToken(token));
    //   return resolve({ statusCode: 200, response:  });
  };
}

function onLoginFailure(reject) {
  return error => {
    let errorObj = {};
    switch (error.code) {
      case 'UserNotConfirmedException':
        errorObj = { status: 400, msg: 'User verification is pending', verificationPending: true };
        break;
    }
    console.log({ loginError: error });
    reject(errorObj);
  };
}

async function adminGetUser(username) {
  AWS.config.region = AWS_COGNITO_REGION; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: COGNITO_IDENTITY_POOL_ID,
  });
  AWS.config.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  AWS.config.secretAccessKey = process.env.AWS_SECRET_KEY;
  AWS.config.credentials.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  AWS.config.credentials.secretAccessKey = process.env.AWS_SECRET_KEY;
  AWS.config.apiVersion = 'latest';
  AWS.config.maxRetries = 100;

  var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
  var params = {
    Username: username,
    UserPoolId: COGINTO_USER_POOL_ID,
  };
  return await cognitoidentityserviceprovider.adminGetUser(params).promise();
}

module.exports = {
  initAWS,
  getCognitoAttributeList,
  getUserPool,
  getCognitoUser,
  setCognitoAttributeList,
  getAuthDetails,
  decodeJWTToken,
  attributes,
  onLoginSuccess,
  onLoginFailure,
  adminGetUser,
};
