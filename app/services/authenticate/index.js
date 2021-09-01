var jwt = require('jsonwebtoken');
const { promisyCallback } = require('../../utils/promiseUtil');
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY;

function generateToken(user) {
  return jwt.sign(user, ACCESS_TOKEN, { expiresIn: TOKEN_EXPIRY });
}

async function validateToken(token) {
  const user = await promisyCallback(jwt.verify, token, ACCESS_TOKEN);
  return user;
}

exports.generateToken = generateToken;
exports.validateToken = validateToken;
