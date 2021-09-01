var jwt = require('jsonwebtoken');
const { promisifyCallback } = require('../../utils/promiseUtil');
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY;

function generateToken(user) {
  return jwt.sign(user, ACCESS_TOKEN, { expiresIn: TOKEN_EXPIRY });
}

function generateRefreshToken(user) {
  return jwt.sign(user, REFRESH_TOKEN, { expiresIn: '1 days' });
}

async function validateToken(token) {
  const user = await promisifyCallback(jwt.verify, token, ACCESS_TOKEN);
  return user;
}

async function validateRefreshToken(token) {
  return await promisifyCallback(jwt.verify, token, REFRESH_TOKEN);
}

exports.generateToken = generateToken;
exports.generateRefreshToken = generateRefreshToken;
exports.validateToken = validateToken;
exports.validateRefreshToken = validateRefreshToken;
